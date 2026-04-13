/**
 * AI Chat Loader - ASCII-only wrapper
 * Fetches the real ai-chat.js with explicit UTF-8 decoding
 * to fix character encoding on Wix
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
