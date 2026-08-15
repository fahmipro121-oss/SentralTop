package com.kaizen.sentraltop

import android.app.Application
import android.content.Intent
import java.io.PrintWriter
import java.io.StringWriter

class SentralTopApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
            try {
                val sw = StringWriter()
                throwable.printStackTrace(PrintWriter(sw))
                val intent = Intent(applicationContext, CrashActivity::class.java)
                intent.putExtra("error_text", sw.toString())
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                applicationContext.startActivity(intent)
            } catch (e: Exception) {
            }
            android.os.Process.killProcess(android.os.Process.myPid())
        }
    }
}
