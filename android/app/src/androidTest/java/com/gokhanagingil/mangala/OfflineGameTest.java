package com.gokhanagingil.mangala;

import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.Scanner;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Native WebView integration tests, with no network permission. */
@RunWith(AndroidJUnit4.class)
public final class OfflineGameTest {
    private ActivityScenario<MainActivity> scenario;

    @Before public void openCleanGame() throws Exception {
        scenario=ActivityScenario.launch(MainActivity.class);
        await("!!document.querySelector('[data-action=new]')");
        js("localStorage.clear(); localStorage.setItem('mangala.settings',JSON.stringify({sound:false,speed:'fast',paceVersion:2})); document.documentElement.dataset.qaOld='true'; location.reload();");
        await("!document.documentElement.dataset.qaOld && !!document.querySelector('[data-action=new]') && !document.querySelector('[data-action=resume]')");
    }
    @After public void close() { if(scenario!=null)scenario.close(); }

    private String js(String expression) throws Exception {
        CountDownLatch done=new CountDownLatch(1);
        AtomicReference<String> result=new AtomicReference<>();
        scenario.onActivity(activity -> activity.gameView().evaluateJavascript(expression,value -> {
            result.set(value);done.countDown();
        }));
        assertTrue("JavaScript callback timeout",done.await(15,TimeUnit.SECONDS));
        return result.get();
    }
    private void await(String condition) throws Exception {
        for(int i=0;i<600;i++){
            if("true".equals(js(condition)))return;
            Thread.sleep(100);
        }
        fail("Condition not reached: "+condition+"; worker="+js("document.body.dataset.worker")+"; page="+js("document.body.innerText.slice(0,1600)"));
    }
    private void click(String selector) throws Exception { js("document.querySelector('"+selector+"').click()"); }
    private void back() {
        scenario.onActivity(activity -> activity.getOnBackPressedDispatcher().onBackPressed());
    }

    @Test public void offlineAiWorkerAndSoloTurn() throws Exception {
        scenario.onActivity(activity -> {
            assertEquals(PackageManager.PERMISSION_DENIED,activity.checkSelfPermission("android.permission.INTERNET"));
            assertFalse(activity.gameView().getSettings().getAllowFileAccess());
            assertFalse(activity.gameView().getSettings().getAllowContentAccess());
        });
        assertTrue(js("document.querySelector('.selected-rival').textContent").contains("Deniz"));
        click("[data-action=opponents]");
        assertEquals("5",js("document.querySelectorAll('.rival-card:disabled').length"));
        back();
        await("!document.querySelector('#modal').open");
        assertEquals("true",js("typeof MangalaAndroid?.createAiWorker==='function'"));
        for(String level:new String[]{"beginner","hard"}){
            js("document.body.dataset.worker='pending';import(new URL('./engine.js',location.href).href).then(({initialState})=>{const w=MangalaAndroid.createAiWorker();w.onmessage=({data})=>{document.body.dataset.worker=Number.isInteger(data.pit)&&data.pit>=7&&data.pit<=12?'ok':'fail:'+JSON.stringify(data);w.terminate();};w.onerror=e=>document.body.dataset.worker='error:'+e.message;w.postMessage({id:1,state:initialState(1),level:'"+level+"',style:'balanced'});}).catch(e=>document.body.dataset.worker='import:'+e.message)");
            await("document.body.dataset.worker==='ok'");
        }
        click("[data-action=new]");
        click("[data-pit=\"0\"]");click("[data-action=commit]");
        await("JSON.parse(localStorage.getItem('mangala.session'))?.history.length>=2 && !!document.querySelector('.bottom-pit:not(:disabled)')");
        assertEquals("48",js("document.querySelectorAll('.board .stone').length"));
        assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth"));
    }

    @Test public void localTurnSurvivesRotationAndActivityRecreation() throws Exception {
        click("[data-mode=local]");click("[data-action=new]");
        click("[data-pit=\"0\"]");click("[data-action=commit]");
        await("!!document.querySelector('.top-pit:not(:disabled)')");
        assertEquals("1",js("JSON.parse(localStorage.getItem('mangala.session')).history.length"));
        scenario.onActivity(activity -> activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE));
        await("innerWidth>innerHeight");
        assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth"));
        assertEquals("1",js("JSON.parse(localStorage.getItem('mangala.session')).history.length"));
        scenario.recreate();
        await("!!document.querySelector('[data-action=resume]')");
        click("[data-action=resume]");
        await("!!document.querySelector('.top-pit:not(:disabled)')");
        assertEquals("48",js("document.querySelectorAll('.board .stone').length"));
        scenario.onActivity(activity -> activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT));
        await("innerHeight>innerWidth");
        back();
        await("!!document.querySelector('[data-action=resume]') && !document.body.classList.contains('is-playing')");
    }

    @Test public void winningUnlocksNextOpponentAndAllowsReturning() throws Exception {
        String fixture;
        try(Scanner scanner=new Scanner(InstrumentationRegistry.getInstrumentation().getContext().getAssets().open("winning-position.json"),"UTF-8")){
            fixture=scanner.useDelimiter("\\A").next();
        }
        js("(()=>{const f="+fixture+";localStorage.setItem('mangala.session',JSON.stringify(f.session));localStorage.setItem('qa.pit',String(f.pit));document.documentElement.dataset.qaOld='true';location.reload();})()");
        await("!document.documentElement.dataset.qaOld && !!document.querySelector('[data-action=resume]')");
        click("[data-action=resume]");
        js("document.querySelector('[data-pit=\"'+localStorage.getItem('qa.pit')+'\"]').click()");
        click("[data-action=commit]");
        await("!!document.querySelector('[data-action=next-opponent]:not(:disabled)')");
        assertEquals("true",js("JSON.parse(localStorage.getItem('mangala.career')).cleared.includes('deniz')"));
        click("[data-action=next-opponent]");
        await("JSON.parse(localStorage.getItem('mangala.session')).opponentId==='ece'");
        click("[data-action=opponents]");
        assertEquals("4",js("document.querySelectorAll('.rival-card:disabled').length"));
        click("[data-action=select-opponent][data-id=deniz]");
        await("!!document.querySelector('[data-action=confirm]')");
        click("[data-action=confirm]");
        await("JSON.parse(localStorage.getItem('mangala.session')).opponentId==='deniz'");
        assertEquals("true",js("JSON.parse(localStorage.getItem('mangala.career')).cleared.includes('deniz')"));
        scenario.recreate();
        await("!!document.querySelector('.selected-rival')");
        assertTrue(js("document.querySelector('.selected-rival').textContent").contains("Deniz"));
        click("[data-action=opponents]");
        assertEquals("4",js("document.querySelectorAll('.rival-card:disabled').length"));
    }

    @Test public void tutorialKeepsAllStonesAndNativeBackClosesDialog() throws Exception {
        click("[data-action=learn]");
        click("[data-pit=\"0\"]");click("[data-action=commit]");
        await("!!document.querySelector('[data-action=next-lesson]')");
        assertEquals("\"1\"",js("document.querySelector('[data-pit=\"0\"] .pit-number').textContent"));
        assertEquals("\"5\"",js("document.querySelector('[data-pit=\"1\"] .pit-number').textContent"));
        assertEquals("48",js("document.querySelectorAll('.board .stone').length"));
        click("[data-action=rules]");back();
        await("!document.querySelector('#modal').open");
        assertEquals("true",js("document.body.classList.contains('is-playing')"));
        back();
        await("!!document.querySelector('[data-action=new]')");
    }
}
