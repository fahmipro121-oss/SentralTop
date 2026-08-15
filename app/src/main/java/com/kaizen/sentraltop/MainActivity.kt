package com.kaizen.sentraltop

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.PrintWriter
import java.io.StringWriter

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
            try {
                val sw = StringWriter()
                throwable.printStackTrace(PrintWriter(sw))
                val tv = TextView(this)
                tv.text = sw.toString()
                tv.setTextColor(Color.WHITE)
                tv.setBackgroundColor(Color.parseColor("#0F172A"))
                tv.textSize = 11f
                tv.setPadding(30, 80, 30, 30)
                val scroll = ScrollView(this)
                scroll.setBackgroundColor(Color.parseColor("#0F172A"))
                scroll.addView(tv)
                setContentView(scroll)
            } catch (inner: Exception) {
            }
            Thread.sleep(60000)
        }

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefresh = findViewById(R.id.swipeRefresh)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                return false
            }
        }

        webView.addJavascriptInterface(NativeBridge(this), "SentralNative")
        webView.loadUrl("file:///android_asset/index.html")

        swipeRefresh.setOnRefreshListener {
            webView.reload()
            swipeRefresh.isRefreshing = false
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
