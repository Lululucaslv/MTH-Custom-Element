/**
 * Assessment Hub Loader - ASCII-only wrapper
 * Fetches the real assessment-hub.js with explicit UTF-8 decoding
 * to fix character encoding on Wix
 */
class AssessmentHubLoader extends HTMLElement {
  static get observedAttributes() { return ['user-id','user-email','user-name','lang','src','api-key']; }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._attrs = {};
    this._loaded = false;
  }
  attributeChangedCallback(n,_,v) { this._attrs[n] = v; }
  connectedCallback() {
    var src = this._attrs['src'] || 'https://lululucaslv.github.io/MTH-Custom-Element/assessment-hub.js';
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
    var el = document.createElement('assessment-hub');
    if (this._attrs['user-id']) el.setAttribute('user-id', this._attrs['user-id']);
    if (this._attrs['user-email']) el.setAttribute('user-email', this._attrs['user-email']);
    if (this._attrs['user-name']) el.setAttribute('user-name', this._attrs['user-name']);
    if (this._attrs['lang']) el.setAttribute('lang', this._attrs['lang']);
    if (this._attrs['api-key']) el.setAttribute('api-key', this._attrs['api-key']);
    el.style.display = 'block';
    el.style.width = '100%';
    el.style.height = '100%';
    this.shadowRoot.appendChild(el);
  }
}
customElements.define('assessment-hub-loader', AssessmentHubLoader);
