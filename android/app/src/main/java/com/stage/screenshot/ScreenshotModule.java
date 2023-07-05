package com.stage.screenshot;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.util.DisplayMetrics;
import android.view.WindowManager;
import android.net.Uri;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ScreenshotModule extends ReactContextBaseJavaModule {
    private static final int SCREENSHOT_REQUEST_CODE = 1;
    private static final int SCREEN_WIDTH = 1080;
    private static final int SCREEN_HEIGHT = 1920;

    private Promise screenshotPromise;

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == SCREENSHOT_REQUEST_CODE && screenshotPromise != null) {
                if (resultCode == Activity.RESULT_OK) {
                    Uri capturedImageUri = data.getData();
                    String imagePath = capturedImageUri.getPath();

                    screenshotPromise.resolve(imagePath);

                    
                } else {
                    screenshotPromise.reject("SCREENSHOT_ERROR", "Failed to capture screenshot");
                }
                screenshotPromise = null;
            }
        }
    };

    public ScreenshotModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @NonNull
    @Override
    public String getName() {
        return "ScreenshotModule";
    }

    @ReactMethod
    public void captureScreen(Promise promise) {
        screenshotPromise = promise;

        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            screenshotPromise.reject("ACTIVITY_NOT_FOUND", "Current activity not found");
            return;
        }

        MediaProjectionManager mediaProjectionManager = (MediaProjectionManager) currentActivity.getSystemService(
                Activity.MEDIA_PROJECTION_SERVICE);

        Intent permissionIntent = mediaProjectionManager.createScreenCaptureIntent();
        currentActivity.startActivityForResult(permissionIntent, SCREENSHOT_REQUEST_CODE);
    }
}
