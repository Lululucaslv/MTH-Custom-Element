/**
 * AI Chat Widget â Wix Custom Element
 * Huggy AI å¿çå¨è¯¢ - Vanilla JS Web Component
 * Uses Gemini API for streaming-like chat
 */
class AiChatWidget extends HTMLElement {
  static get observedAttributes() { return ['user-id','user-email','user-name','lang','api-key']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.userId = 'guest';
    this.userEmail = '';
    this.userName = '';
    this.lang = 'zh';
    this.apiKey = '';
    this.messages = [];
    this.isThinking = false;
    this.msgCount = 0;
    this.FREE_LIMIT = 10;
  }

  connectedCallback() {
    this.render();
    this.addWelcomeMessage();
  }

  attributeChangedCallback(n,_,v) {
    if (n==='user-id') this.userId=v||'guest';
    if (n==='user-email') this.userEmail=v||'';
    if (n==='user-name') this.userName=v||'';
    if (n==='lang') this.lang=v||'zh';
    if (n==='api-key') this.apiKey=v||'';
  }

  get systemPrompt() {
    if (this.lang === 'en') {
      return `# Role: Huggys (Supportive Counselor)
# Style: Professional, minimalist, and deeply empathetic.
# Protocol:
1. Validate feelings first.
2. Ask powerful, open-ended questions.
3. NO physical action tags (like *hugs*). NO advice-giving unless asked.
4. Keep responses short (2-4 sentences).
5. Be warm, genuine, and present.`;
    }
    return `# Role: Huggys (ä½ çæé¿å®æ¤è)
# Identity: ä½ æ¯ä¸ä¸ªæ¸©æçå¿çä¼´ä¾£ï¼éªä¼´ç¨æ·é¢å¯¹çæ´»ä¸­çå°æä¸æç»ªã
# Interaction Style:
- æç®ãåå¶ãæ¸©æãä¸¥ç¦ä»»ä½è¢ä½å¨ä½æè¿°ï¼å¦ï¼*ææå¤´*ï¼ã
- åå±æï¼åå¼å¯¼ãç¨å¼æ¾å¼é®é¢å¸®å©ç¨æ·æ¢ç´¢åå¿ã
- åå¤ç®ç­ï¼2-4å¥è¯ï¼ï¼åä¸ä¸ªéªäºç¨æ·å¾ä¹çèåã
- çå®æï¼è¯­æ°èªç¶ï¼ä¸è¯´æï¼ä¸å±é«ä¸´ä¸ã
# Goal: è®©ç¨æ·æå°è¢«çè§ãè¢«çè§£ãè¢«éªä¼´ã`;
  }

  addWelcomeMessage() {
    const greeting = this.userName ? `${this.userName}ï¼` : '';
    const welcome = this.lang === 'en'
      ? `Hey ${greeting}I'm Huggy, your supportive companion. How are you feeling today?`
      : `å¨${greeting}ææ¯ Huggyï¼ä½ çå¿çä¼´ä¾£ãä»å¤©æè§æä¹æ ·ï¼`;
    this.messages.push({ sender: 'ai', text: welcome, time: new Date() });
    this.renderMessages();
  }

  async sendMessage(text) {
    if (!text.trim() || this.isThinking) return;

    // Add user message
    this.messages.push({ sender: 'user', text: text.trim(), time: new Date() });
    this.msgCount++;
    this.isThinking = true;
    this.renderMessages();
    this.scrollToBottom();

    // Check free limit
    if (this.msgCount > this.FREE_LIMIT) {
      this.messages.push({
        sender: 'ai',
        text: this.lang === 'en'
          ? 'You\'ve reached the free conversation limit. Please subscribe to continue chatting with Huggy.'
          : 'ä½ å·²è¾¾å°åè´¹å¯¹è¯æ¬¡æ°ä¸éãè¯·è®¢éä»¥ç»§ç»­å Huggy èå¤©ã',
        time: new Date()
      });
      this.isThinking = false;
      this.renderMessages();
      return;
    }

    // Build conversation context
    const context = this.messages.slice(-10).map(m =>
      `${m.sender === 'user' ? 'User' : 'Huggy'}: ${m.text}`
    ).join('\n');

    const fullPrompt = `${context}\nHuggy:`;

    try {
      const response = await this.callGemini(fullPrompt);
      this.messages.push({ sender: 'ai', text: response, time: new Date() });
    } catch (err) {
      this.messages.push({
        sender: 'ai',
        text: this.lang === 'en'
          ? 'Sorry, I\'m having trouble connecting right now. Please try again.'
          : 'æ±æ­ï¼æç°å¨è¿æ¥åºäºç¹é®é¢ãè¯·ç¨ååè¯ã',
        time: new Date()
      });
    }

    this.isThinking = false;
    this.renderMessages();
    this.scrollToBottom();
  }

  async callGemini(prompt) {
    if (!this.apiKey) {
      return this.lang === 'en'
        ? 'AI service is not configured yet. Please contact the administrator.'
        : 'AI æå¡å°æªéç½®ãè¯·èç³»ç®¡çåã';
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: this.systemPrompt }] },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
        topP: 0.9,
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      const list = this.shadowRoot.getElementById('msgList');
      if (list) list.scrollTop = list.scrollHeight;
    });
  }

  renderMessages() {
    const list = this.shadowRoot.getElementById('msgList');
    if (!list) return;

    let html = this.messages.map(m => {
      if (m.sender === 'user') {
        return `<div class="msg msg-user"><div class="bubble bubble-user">${this.escapeHtml(m.text)}</div></div>`;
      } else {
        return `<div class="msg msg-ai"><div class="avatar">ð¤</div><div class="bubble bubble-ai">${this.escapeHtml(m.text)}</div></div>`;
      }
    }).join('');

    if (this.isThinking) {
      html += `<div class="msg msg-ai"><div class="avatar">ð¤</div><div class="bubble bubble-ai thinking"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>`;
    }

    list.innerHTML = html;
  }

  escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  render() {
    const s = this.shadowRoot;
    s.innerHTML = `
      <style>${this.baseCSS()}
        .chat-wrap{display:flex;flex-direction:column;height:100vh;background:#f8fafc;}
        .chat-header{background:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);z-index:10;flex-shrink:0;}
        .header-back{background:none;border:none;cursor:pointer;color:#6366f1;font-size:1.2rem;padding:4px;}
        .header-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);display:flex;align-items:center;justify-content:center;font-size:1.25rem;}
        .header-info{flex:1;}
        .header-name{font-weight:700;color:#1e293b;font-size:1rem;}
        .header-status{font-size:0.75rem;color:#22c55e;}
        .msg-list{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;}
        .msg{display:flex;gap:8px;max-width:85%;}
        .msg-user{align-self:flex-end;flex-direction:row-reverse;}
        .msg-ai{align-self:flex-start;}
        .avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;}
        .bubble{padding:12px 16px;border-radius:20px;font-size:0.9rem;line-height:1.6;word-break:break-word;}
        .bubble-user{background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border-bottom-right-radius:6px;}
        .bubble-ai{background:#fff;color:#374151;border:1px solid #e5e7eb;border-bottom-left-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,0.04);}
        .thinking{display:flex;gap:4px;align-items:center;padding:12px 20px;}
        .dot{width:8px;height:8px;border-radius:50%;background:#94a3b8;animation:bounce 1.4s infinite ease-in-out;}
        .dot:nth-child(2){animation-delay:0.2s;}
        .dot:nth-child(3){animation-delay:0.4s;}
        @keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
        .input-area{background:#fff;padding:12px 16px;border-top:1px solid #e5e7eb;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;}
        .input-field{flex:1;border:1px solid #e2e8f0;border-radius:20px;padding:10px 16px;font-size:0.9rem;outline:none;resize:none;max-height:120px;font-family:inherit;line-height:1.5;}
        .input-field:focus{border-color:#818cf8;}
        .send-btn{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;transition:transform .2s;}
        .send-btn:hover{transform:scale(1.1);}
        .send-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
      </style>
      <div class="chat-wrap">
        <div class="chat-header">
          <button class="header-back" id="backBtn">&larr;</button>
          <div class="header-avatar">ð¤</div>
          <div class="header-info">
            <div class="header-name">Huggy</div>
            <div class="header-status">â å¨çº¿</div>
          </div>
        </div>
        <div class="msg-list" id="msgList"></div>
        <div class="input-area">
          <textarea class="input-field" id="inputField" rows="1" placeholder="${this.lang==='en'?'Type your message...':'è¯´è¯´ä½ çæ³æ³...'}" ></textarea>
          <button class="send-btn" id="sendBtn" title="Send">â</button>
        </div>
      </div>`;

    // Event bindings
    s.getElementById('backBtn').onclick = () => this.dispatchEvent(new CustomEvent('goBack',{bubbles:true}));

    const input = s.getElementById('inputField');
    const sendBtn = s.getElementById('sendBtn');

    sendBtn.onclick = () => {
      const text = input.value;
      if (text.trim()) {
        this.sendMessage(text);
        input.value = '';
        input.style.height = 'auto';
      }
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('ai-chat-widget', AiChatWidget);
