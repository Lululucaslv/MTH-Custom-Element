/**
 * Assessment Hub Loader - ASCII-only wrapper
 * Fetches the real assessment-hub.js with explicit UTF-8 decoding
 * to fix character encoding on Wix
 * v3: use constructor instead of document.createElement for Wix compatibility
 */
class AssessmentHubLoader extends HTMLElement {
            static get observedAttributes() { return ['user-id','user-email','user-name','lang','src']; }
            constructor() {
                            super();
                            this._attrs = {};
                            this._loaded = false;
            }
            attributeChangedCallback(n,_,v) { this._attrs[n] = v; }
            connectedCallback() {
                            if (this._loaded) return;
                            this._loaded = true;
                            this.style.display = 'block';
                            this.style.width = '100%';
                            this.style.minHeight = '100%';
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
                                })
                                .catch(function(e) { console.error('AssessmentHubLoader fetch error:', e); });
            }
            _injectReal() {
                            // Wix overrides customElements.define, so document.createElement
                // may not return an upgraded element. Use the constructor directly.
                var AH = customElements.get('assessment-hub');
                            var el = AH ? new AH() : document.createElement('assessment-hub');
                            if (this._attrs['user-id']) el.setAttribute('user-id', this._attrs['user-id']);
                            if (this._attrs['user-email']) el.setAttribute('user-email', this._attrs['user-email']);
                            if (this._attrs['user-name']) el.setAttribute('user-name', this._attrs['user-name']);
                            if (this._attrs['lang']) el.setAttribute('lang', this._attrs['lang']);
                            el.style.display = 'block';
                            el.style.width = '100%';
                            el.style.minHeight = '100%';
                            this.appendChild(el);
            }
}
customElements.define('assessment-hub-loader', AssessmentHubLoader);
