/**
 * AI Chat Loader - ASCII-only wrapper
 * Shows a welcome landing screen first; loads the real ai-chat.js
 * only after the user clicks the CTA button.
 */
class AiChatLoader extends HTMLElement {
  static get observedAttributes() { return ['user-id','user-email','user-name','lang','api-key']; }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._attrs = {};
    this._loaded = false;
  }
  attributeChangedCallback(n,_,v) { this._attrs[n] = v; }
  connectedCallback() {
    /* Hide legacy Wix native sections that duplicate content.
       Walk up to the Wix component wrapper, then hide any sibling <section> elements
       so only this custom element is visible (prevents content duplication on mobile). */
    try {
      var wrapper = this.closest('[id^="comp-"]');
      if (wrapper && wrapper.parentElement) {
        var siblings = wrapper.parentElement.children;
        for (var i = 0; i < siblings.length; i++) {
          if (siblings[i] !== wrapper && siblings[i].tagName === 'SECTION') {
            siblings[i].style.display = 'none';
          }
        }
      }
    } catch(e) { /* ignore */ }

    this._showLanding();
  }

  _showLanding() {
    var lang = this._attrs['lang'] || 'zh';
    var isEn = lang === 'en';

    var title = isEn ? 'AI Counseling' : 'AI \u5fc3\u7406\u54a8\u8be2';
    var subtitle = isEn
      ? 'Chat with Huggy, your supportive AI companion. Share how you feel in a safe, private space.'
      : '\u548c Huggy \u804a\u804a\u5427\uff0c\u4f60\u7684 AI \u5fc3\u7406\u4f34\u4fa3\u3002\u5728\u5b89\u5168\u79c1\u5bc6\u7684\u7a7a\u95f4\u91cc\uff0c\u8bf4\u51fa\u4f60\u7684\u611f\u53d7\u3002';
    var btnText = isEn ? 'Start AI Counseling' : '\u8fdb\u884c AI \u54a8\u8be2';
    var note = isEn
      ? 'Free trial includes 10 messages per session'
      : '\u514d\u8d39\u4f53\u9a8c\u6bcf\u6b21\u5305\u542b 10 \u6761\u6d88\u606f';

    this.shadowRoot.innerHTML = '\
      <style>\
        *{margin:0;padding:0;box-sizing:border-box;}\
        :host{display:block;width:100%;height:100%;}\
        .landing{\
          display:flex;flex-direction:column;align-items:center;justify-content:center;\
          width:100%;height:100%;min-height:400px;\
          background:linear-gradient(135deg,#faf9fe 0%,#eef2ff 50%,#fdf2f8 100%);\
          font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei",sans-serif;\
          -webkit-font-smoothing:antialiased;\
          padding:40px 24px;text-align:center;\
        }\
        .landing-icon{\
          width:80px;height:80px;border-radius:50%;\
          background:linear-gradient(135deg,#6366f1,#ec4899);\
          display:flex;align-items:center;justify-content:center;\
          font-size:2.2rem;color:#fff;font-weight:bold;\
          margin-bottom:24px;\
          box-shadow:0 8px 32px rgba(99,102,241,0.25);\
          animation:float 3s ease-in-out infinite;\
        }\
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}\
        .landing-title{\
          font-size:1.5rem;font-weight:700;color:#1e293b;\
          margin-bottom:12px;letter-spacing:-0.02em;\
        }\
        .landing-subtitle{\
          font-size:0.95rem;color:#64748b;line-height:1.7;\
          max-width:360px;margin-bottom:32px;\
        }\
        .landing-btn{\
          display:inline-flex;align-items:center;gap:10px;\
          padding:16px 40px;border:none;border-radius:50px;\
          background:linear-gradient(135deg,#6366f1,#818cf8);\
          color:#fff;font-size:1rem;font-weight:700;\
          cursor:pointer;transition:all 0.3s ease;\
          box-shadow:0 4px 16px rgba(99,102,241,0.3);\
          font-family:inherit;\
        }\
        .landing-btn:hover{\
          transform:translateY(-2px);\
          box-shadow:0 8px 24px rgba(99,102,241,0.4);\
        }\
        .landing-btn:active{transform:translateY(0);}\
        .landing-btn svg{flex-shrink:0;}\
        .landing-note{\
          margin-top:20px;font-size:0.8rem;color:#94a3b8;\
        }\
        .landing-features{\
          display:flex;gap:24px;margin-bottom:32px;flex-wrap:wrap;justify-content:center;\
        }\
        .feature-item{\
          display:flex;flex-direction:column;align-items:center;gap:8px;\
          color:#64748b;font-size:0.8rem;\
        }\
        .feature-icon{\
          width:44px;height:44px;border-radius:16px;\
          background:rgba(99,102,241,0.08);\
          display:flex;align-items:center;justify-content:center;\
          color:#6366f1;\
        }\
      </style>\
      <div class="landing">\
        <div class="landing-icon">H</div>\
        <div class="landing-title">' + title + '</div>\
        <div class="landing-subtitle">' + subtitle + '</div>\
        <div class="landing-features">\
          <div class="feature-item">\
            <div class="feature-icon">\
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>\
            </div>\
            ' + (isEn ? 'Private & Safe' : '\u5b89\u5168\u79c1\u5bc6') + '\
          </div>\
          <div class="feature-item">\
            <div class="feature-icon">\
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>\
            </div>\
            ' + (isEn ? 'Warm & Caring' : '\u6e29\u6696\u5171\u60c5') + '\
          </div>\
          <div class="feature-item">\
            <div class="feature-icon">\
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>\
            </div>\
            ' + (isEn ? 'Bilingual' : '\u4e2d\u82f1\u53cc\u8bed') + '\
          </div>\
        </div>\
        <button class="landing-btn" id="startBtn">\
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>\
          ' + btnText + '\
        </button>\
        <div class="landing-note">' + note + '</div>\
      </div>\
    ';

    var self = this;
    this.shadowRoot.getElementById('startBtn').addEventListener('click', function() {
      self._loadChat();
    });
  }

  _loadChat() {
    // Show loading state
    this.shadowRoot.innerHTML = '\
      <style>\
        :host{display:block;width:100%;height:100%;}\
        .loading{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;min-height:400px;background:#faf9fe;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei",sans-serif;}\
        .spinner{width:40px;height:40px;border:3px solid #e0e7ff;border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:16px;}\
        @keyframes spin{to{transform:rotate(360deg)}}\
        .loading-text{color:#64748b;font-size:0.9rem;}\
      </style>\
      <div class="loading">\
        <div class="spinner"></div>\
        <div class="loading-text">' + ((this._attrs['lang'] || 'zh') === 'en' ? 'Loading...' : '\u52a0\u8f7d\u4e2d...') + '</div>\
      </div>\
    ';

    var src = 'https://lululucaslv.github.io/MTH-Custom-Element/ai-chat.js';
    var self = this;
    fetch(src)
      .then(function(r) { return r.arrayBuffer(); })
      .then(function(buf) {
        var text = new TextDecoder('utf-8').decode(buf);
        var blob = new Blob([text], { type: 'application/javascript;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var script = document.createElement('script');
        script.src = url;
        script.onload = function() {
          URL.revokeObjectURL(url);
          self._injectReal();
        };
        document.head.appendChild(script);
      });
  }

  _injectReal() {
    // Wix overrides document.createElement - use innerHTML instead
    var attrs = '';
    if (this._attrs['user-id']) attrs += ' user-id="' + this._attrs['user-id'] + '"';
    if (this._attrs['user-email']) attrs += ' user-email="' + this._attrs['user-email'] + '"';
    if (this._attrs['user-name']) attrs += ' user-name="' + this._attrs['user-name'] + '"';
    if (this._attrs['lang']) attrs += ' lang="' + this._attrs['lang'] + '"';
    if (this._attrs['api-key']) attrs += ' api-key="' + this._attrs['api-key'] + '"';
    this.shadowRoot.innerHTML = '<ai-chat-widget style="display:block;width:100%;height:100%"' + attrs + '></ai-chat-widget>';
  }
}
customElements.define('ai-chat-loader', AiChatLoader);
