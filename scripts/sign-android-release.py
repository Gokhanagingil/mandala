#!/usr/bin/env python3
"""Sign only verified Mangala release inputs with the pinned permanent identity.

The keystore and password file must be outside the repository. This command
never generates a key, so a missing backup cannot silently break future updates.
"""
import argparse, hashlib, json, re, subprocess, tempfile, zipfile
from pathlib import Path

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('unsigned_apk',type=Path)
parser.add_argument('output_apk',type=Path)
parser.add_argument('--keystore',required=True,type=Path)
parser.add_argument('--password-file',required=True,type=Path)
parser.add_argument('--apksigner',required=True,type=Path)
args=parser.parse_args()
repo=Path(__file__).resolve().parents[1]
identity=json.loads((repo/'android/signing/release-identity.json').read_text())
for path in (args.keystore,args.password_file):
    if not path.is_file(): parser.error('Missing private signing material; restore the existing backup. Do not create another key.')
    if path.resolve().is_relative_to(repo): parser.error('Keep private signing material outside the repository.')
if args.output_apk.exists(): parser.error('Output already exists; use a new release path.')
metadata=json.loads(args.unsigned_apk.with_suffix('.json').read_text())
if metadata['applicationId']!=identity['applicationId'] or metadata['debuggable']:
    parser.error('Unexpected release identity or debuggable APK.')
if metadata['versionCode']<identity['minimumVersionCode']:
    parser.error('Version code is older than the permanent release line.')
if metadata['unsignedSha256']!=hashlib.sha256(args.unsigned_apk.read_bytes()).hexdigest():
    parser.error('Unsigned APK hash does not match build metadata.')
certificate=subprocess.run(['keytool','-exportcert','-keystore',str(args.keystore),'-storepass:file',str(args.password_file),'-alias',identity['keyAlias']],capture_output=True,check=True).stdout
if hashlib.sha256(certificate).hexdigest()!=identity['certificateSha256']:
    parser.error('Wrong signing key: certificate does not match the permanent identity.')

def payload(path):
    with zipfile.ZipFile(path) as archive:
        if archive.testzip(): raise RuntimeError('Corrupt APK ZIP')
        names=archive.namelist()
        if len(names)!=len(set(names)): raise RuntimeError('Duplicate APK entries')
        return {name:hashlib.sha256(archive.read(name)).hexdigest() for name in names
                if not re.fullmatch(r'META-INF/(MANIFEST.MF|[^/]+\.(SF|RSA|DSA|EC))',name,re.I)}

before=payload(args.unsigned_apk)
args.output_apk.parent.mkdir(parents=True,exist_ok=True)
subprocess.run(['java','-jar',str(args.apksigner),'sign','--ks',str(args.keystore),
    '--ks-key-alias',identity['keyAlias'],'--ks-pass','file:'+str(args.password_file),
    '--v1-signing-enabled','false',
    '--v2-signing-enabled','true','--v3-signing-enabled','true','--v4-signing-enabled','false',
    '--out',str(args.output_apk),str(args.unsigned_apk)],check=True)
verification=subprocess.check_output(['java','-jar',str(args.apksigner),'verify','--verbose','--print-certs',str(args.output_apk)],text=True)
certs=re.findall(r'Signer #\d+ certificate SHA-256 digest: ([0-9a-f]+)',verification)
if certs!=[identity['certificateSha256']]: raise RuntimeError('Unexpected final APK signing identity')
for version in (2,3):
    if not re.search(r'Verified using v'+str(version)+r' scheme.*: true',verification):
        raise RuntimeError('APK signature scheme verification failed')
if payload(args.output_apk)!=before: raise RuntimeError('Signing changed application payload')
report={**metadata,'apkSha256':hashlib.sha256(args.output_apk.read_bytes()).hexdigest(),
        'certificateSha256':identity['certificateSha256'],'signatureSchemes':[2,3],
        'payloadUnchanged':True,'productionSigning':True}
args.output_apk.with_suffix('.verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
