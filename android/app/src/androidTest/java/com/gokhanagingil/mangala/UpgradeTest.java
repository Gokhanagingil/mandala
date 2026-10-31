package com.gokhanagingil.mangala;

import android.content.pm.ApplicationInfo;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Two separate instrumentation invocations straddle a real adb install -r update. */
@RunWith(AndroidJUnit4.class)
public final class UpgradeTest {
    private ActivityScenario<MainActivity> scenario;
    private String js(String source) throws Exception {
        CountDownLatch done=new CountDownLatch(1);
        AtomicReference<String> value=new AtomicReference<>();
        scenario.onActivity(a -> a.gameView().evaluateJavascript(source,r -> {value.set(r);done.countDown();}));
        assertTrue(done.await(15,TimeUnit.SECONDS));
        return value.get();
    }
    private void await(String expression) throws Exception {
        for(int i=0;i<600;i++){
            if("true".equals(js(expression)))return;
            Thread.sleep(100);
        }
        fail("Not reached: "+expression);
    }
    private void click(String selector) throws Exception {js("document.querySelector('"+selector+"').click()");}

    @Test public void seedBeforeUpdate() throws Exception {
        try(ActivityScenario<MainActivity> opened=ActivityScenario.launch(MainActivity.class)){
            scenario=opened;
            await("!!document.querySelector('[data-action=new]')");
            js("localStorage.clear();localStorage.setItem('mangala.career',JSON.stringify({version:1,cleared:['deniz'],selected:'ece'}));localStorage.setItem('mangala.progress',JSON.stringify({solved:[1,2,3],learned:true}));localStorage.setItem('mangala.settings',JSON.stringify({sound:false,speed:'fast',paceVersion:2}));document.body.dataset.old='yes';location.reload();");
            await("!document.body.dataset.old && !!document.querySelector('.selected-rival')");
            assertTrue(js("document.querySelector('.selected-rival').textContent").contains("Ece"));
            click("[data-mode=local]");click("[data-action=new]");
            click("[data-pit=\"0\"]");click("[data-action=commit]");
            await("!!document.querySelector('.top-pit:not(:disabled)')");
            js("localStorage.setItem('mangala.settings',JSON.stringify({sound:true,speed:'slow',paceVersion:2}));localStorage.setItem('qa.expected',JSON.stringify(Object.fromEntries(['session','career','progress','settings'].map(k=>[k,localStorage.getItem('mangala.'+k)]))));");
            assertEquals("1",js("JSON.parse(localStorage.getItem('mangala.session')).history.length"));
        }
    }

    @Test public void verifyAfterUpdate() throws Exception {
        try(ActivityScenario<MainActivity> opened=ActivityScenario.launch(MainActivity.class)){
            scenario=opened;
            scenario.onActivity(a -> {
                assertEquals("com.gokhanagingil.mangala",a.getPackageName());
                assertEquals("Mangala",a.getApplicationInfo().loadLabel(a.getPackageManager()).toString());
                assertEquals(0,a.getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE);
                assertEquals(14002,BuildConfig.VERSION_CODE);
                assertEquals("1.4.1",BuildConfig.VERSION_NAME);
            });
            await("!!document.querySelector('[data-action=resume]')");
            assertEquals("true",js("(()=>{const e=JSON.parse(localStorage.getItem('qa.expected'));return !!e&&Object.entries(e).every(([k,v])=>localStorage.getItem('mangala.'+k)===v);})()"));
            assertTrue(js("document.querySelector('.selected-rival').textContent").contains("Ece"));
            click("[data-action=resume]");
            await("!!document.querySelector('.top-pit:not(:disabled)')");
            assertEquals("48",js("document.querySelectorAll('.board .stone').length"));
            assertEquals("1",js("JSON.parse(localStorage.getItem('mangala.session')).history.length"));
            assertTrue(js("document.querySelector('[data-action=speed]').textContent").contains("Sakin"));
        }
    }
}
