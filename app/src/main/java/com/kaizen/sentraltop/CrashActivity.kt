package com.kaizen.sentraltop

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.widget.ScrollView
import android.widget.TextView

class CrashActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val message = intent.getStringExtra("error_text") ?: "Unknown error"
        val tv = TextView(this)
        tv.text = message
        tv.setTextColor(Color.WHITE)
        tv.setBackgroundColor(Color.parseColor("#0F172A"))
        tv.textSize = 12f
        tv.setPadding(30, 80, 30, 30)
        val scroll = ScrollView(this)
        scroll.setBackgroundColor(Color.parseColor("#0F172A"))
        scroll.addView(tv)
        setContentView(scroll)
    }
}
