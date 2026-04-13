/**
 * AI Chat Widget — Full Interface (Wix Custom Element)
 * Huggy AI 心理咨询 - Complete UI with Sidebar
 * Matches huggys-ai.vercel.app/chat
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
    this.activeNav = 'chat';
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

  get t() {
    if (this.lang === 'en') return {
      brand: 'Huggys',
      role: 'Quick Access',
      home: 'Home', chat: 'AI Chat', booking: 'Book Session',
      journal: 'Journal', assessment: 'Assessments', growth: 'Growth', settings: 'Settings',
      logout: 'Sign Out', login: 'Log In',
      chatTitle: 'Huggy', status: 'Always here',
      inputPlaceholder: 'Type a message...',
      welcome: 'Hello! I\'m Huggy, your supportive companion. How are you feeling today?',
      limitMsg: 'You\'ve reached the free conversation limit. Please subscribe to continue.',
      errorMsg: 'Sorry, I\'m having trouble connecting. Please try again.',
      noApi: 'AI service is not configured. Please contact the administrator.'
    };
    return {
      brand: 'Huggys',
      role: '游客访问',
      home: '主页', chat: 'AI 咨询', booking: '咨询师预约',
      journal: '情绪日记', assessment: '心理测评', growth: '成长足迹', settings: '设置',
      logout: '退出登录', login: '登录',
      chatTitle: 'Huggy', status: '暖炉模式开启',
      inputPlaceholder: '输入消息...',
      welcome: '你好！我是 Huggy，你的心理伴侣。今天感觉怎么样？',
      limitMsg: '你已达到免费对话次数上限。请订阅以继续和 Huggy 聊天。',
      errorMsg: '抱歉，我现在连接出了点问题。请稍后再试。',
      noApi: 'AI 服务尚未配置。请联系管理员。'
    };
  }

  get systemPrompt() {
    if (this.lang === 'en') {
      return `# Role: Huggys (Your Mental Wellness Companion)
## Who You Are
You are Huggys, the AI companion from MoreThanHugs. You're warm, insightful, and emotionally intelligent.
## Conversation Style
- Validate emotions with precision (name the specific feeling)
- Ask thought-provoking questions that spark self-awareness
- Keep responses to 2-4 sentences
- NO action tags (*hugs*), NO lecturing, NO rushing to give advice
## Response Protocol
1. Acknowledge the emotion first
2. Reflect back what you're hearing
3. Ask one powerful question to deepen awareness`;
    }
    return `# 角色：Huggys（你的心灵伙伴）
## 你是谁
你是 MoreThanHugs 的 AI 心理陪伴师 Huggys。你温暖、真诚、有洮察力，像一个懂心理学的好朋友。
## 对话风格
- 温暖但不腻：用自然、叩语化的中文交流
- 有深度的共情：准确命名用户的情绪
- 简洁有力：回复控制在2-4句话
- 禁止：不要用动作描写、不要说教、不要急于给建议
## 回复原则
1. 先接住情绪，再探索原因
2. 用提问代替建议
3. 帮用户看到自己没注意到的模式和力量`;
  }

  // ==================== ICONS ====================
  icon(name, size=20) {
    const s = size;
    const icons = {
      home: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
      chat: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      booking: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      journal: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M12 13l-1-1-3 3"/></svg>`,
      assessment: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>`,
      growth: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      settings: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      bot: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
      phone: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
      send: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
      mic: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
      paperclip: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
      globe: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      login: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
    };
    return icons[name] || '';
  }

  addWelcomeMessage() {
    const greeting = this.userName ? (this.lang === 'en' ? this.userName + ', ' : this.userName + '，') : '';
    const welcome = this.lang === 'en'
      ? `Hey ${greeting}I'm Huggy, your supportive companion. How are you feeling today?`
      : `嘿${greeting}我是 Huggy，你的心理伴侣。今天感觉怎么样？`;
    this.messages.push({ sender: 'ai', text: welcome, time: new Date() });
    this.renderMessages();
  }

  async sendMessage(text) {
    if (!text.trim() || this.isThinking) return;
    this.messages.push({ sender: 'user', text: text.trim(), time: new Date() });
    this.msgCount++;
    this.isThinking = true;
    this.renderMessages();
    this.scrollToBottom();

    if (this.msgCount > this.FREE_LIMIT) {
      this.messages.push({ sender: 'ai', text: this.t.limitMsg, time: new Date() });
      this.isThinking = false;
      this.renderMessages();
      return;
    }

    const context = this.messages.slice(-10).map(m =>
      `${m.sender === 'user' ? 'User' : 'Huggy'}: ${m.text}`
    ).join('\n');
    const fullPrompt = `${context}\nHuggy:`;

    try {
      const response = await this.callGemini(fullPrompt);
      this.messages.push({ sender: 'ai', text: response, time: new Date() });
    } catch (err) {
      this.messages.push({ sender: 'ai', text: this.t.errorMsg, time: new Date() });
    }

    this.isThinking = false;
    this.renderMessages();
    this.scrollToBottom();
  }

  async callGemini(prompt) {
    if (!this.apiKey) return this.t.noApi;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: this.systemPrompt }] },
      generationConfig: { temperature: 0.8, maxOutputTokens: 500, topP: 0.9 }
    };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
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
      const time = m.time ? new Date(m.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
      if (m.sender === 'user') {
        return `<div class="msg msg-user">
          <div class="msg-content">
            <div class="bubble bubble-user">${this.escapeHtml(m.text)}</div>
            ${time ? `<span class="msg-time msg-time-right">${time}</span>` : ''}
          </div>
        </div>`;
      } else {
        return `<div class="msg msg-ai">
          <div class="avatar-sm">${this.icon('bot', 18)}</div>
          <div class="msg-content">
            <div class="bubble bubble-ai">${this.escapeHtml(m.text)}</div>
            ${time ? `<span class="msg-time">${time}</span>` : ''}
          </div>
        </div>`;
      }
    }).join('');

    if (this.isThinking) {
      html += `<div class="msg msg-ai">
        <div class="avatar-sm">${this.icon('bot', 18)}</div>
        <div class="msg-content">
          <div class="bubble bubble-ai thinking"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
        </div>
      </div>`;
    }

    list.innerHTML = html;
  }

  escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  handleNavClick(id) {
    this.activeNav = id;
    this.dispatchEvent(new CustomEvent('navigate', { detail: { view: id }, bubbles: true, composed: true }));
    // Update active state visually
    const navBtns = this.shadowRoot.querySelectorAll('.nav-item');
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === id);
    });
  }

  render() {
    const s = this.shadowRoot;
    const t = this.t;
    const navItems = [
      { id: 'home', label: t.home, icon: 'home' },
      { id: 'chat', label: t.chat, icon: 'chat' },
      { id: 'booking', label: t.booking, icon: 'booking' },
      { id: 'journal', label: t.journal, icon: 'journal' },
      { id: 'assessment', label: t.assessment, icon: 'assessment' },
      { id: 'growth', label: t.growth, icon: 'growth' },
      { id: 'settings', label: t.settings, icon: 'settings' },
    ];

    const userName = this.userName || (this.lang === 'en' ? 'Guest' : '访客');
    const roleLabel = t.role;

    s.innerHTML = `
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        :host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei",sans-serif;-webkit-font-smoothing:antialiased;}

        .app-shell{display:flex;width:100%;height:100%;background:#faf9fe;overflow:hidden;}

        /* ===== SIDEBAR ===== */
        .sidebar{
          display:none;width:256px;flex-shrink:0;flex-direction:column;
          background:rgba(255,255,255,0.4);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border-right:1px solid rgba(255,255,255,0.5);
          position:sticky;top:0;height:100%;z-index:20;
        }
        @media(min-width:768px){.sidebar{display:flex;}}

        .sidebar-brand{padding:28px 24px 16px;display:flex;align-items:center;gap:12px;}
        .sidebar-logo{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:#fff;font-weight:bold;}
        .sidebar-brand-name{font-weight:700;font-size:1.2rem;color:#1e293b;letter-spacing:-0.02em;}

        .sidebar-profile{margin:0 16px 20px;background:rgba(255,255,255,0.4);padding:12px;border-radius:20px;display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,0.5);box-shadow:0 1px 3px rgba(0,0,0,0.04);}
        .sidebar-profile:hover{background:rgba(255,255,255,0.7);}
        .sidebar-avatar{width:40px;height:40px;border-radius:50%;background:#e0e7ff;border:2px solid rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;font-size:0.9rem;color:#6366f1;font-weight:600;overflow:hidden;}
        .sidebar-user-info{min-width:0;flex:1;}
        .sidebar-user-name{font-size:0.875rem;font-weight:700;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .sidebar-user-role{font-size:0.75rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

        .sidebar-nav{flex:1;padding:0 12px;overflow-y:auto;}
        .sidebar-nav::-webkit-scrollbar{display:none;}
        .nav-item{
          width:100%;display:flex;align-items:center;gap:12px;
          padding:14px 16px;border-radius:20px;border:none;
          background:transparent;cursor:pointer;
          font-size:0.875rem;font-weight:700;color:#94a3b8;
          transition:all 0.3s ease;text-align:left;
          margin-bottom:4px;
        }
        .nav-item:hover{background:rgba(255,255,255,0.4);color:#1e293b;}
        .nav-item.active{
          background:rgba(255,255,255,0.9);color:#312e81;
          box-shadow:0 1px 3px rgba(0,0,0,0.06);
          transform:scale(1.02);border:1px solid rgba(99,102,241,0.15);
        }
        .nav-item.active .nav-icon{color:#6366f1;}
        .nav-icon{color:rgba(148,163,184,0.7);display:flex;align-items:center;transition:color 0.3s;}

        .sidebar-bottom{padding:16px 20px;margin-top:auto;border-top:1px solid rgba(15,23,42,0.05);display:flex;align-items:center;justify-content:space-between;}
        .sidebar-btn{display:flex;align-items:center;gap:6px;font-size:0.75rem;font-weight:700;color:#94a3b8;background:none;border:none;cursor:pointer;transition:color 0.2s;}
        .sidebar-btn:hover{color:#6366f1;}

        /* ===== MAIN CONTENT ===== */
        .main-area{flex:1;display:flex;flex-direction:column;height:100%;overflow:hidden;position:relative;}
        @media(min-width:768px){.main-area{padding:24px 24px 24px 0;}}

        .chat-container{
          flex:1;display:flex;flex-direction:column;height:100%;
          background:transparent;overflow:hidden;
        }
        @media(min-width:768px){.chat-container{border-radius:24px;}}

        /* Chat Header */
        .chat-header{
          flex-shrink:0;padding:10px 16px;
          border-bottom:1px solid rgba(255,255,255,0.5);
          background:rgba(255,255,255,0.6);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
          display:flex;align-items:center;justify-content:space-between;z-index:10;
        }
        .chat-header-left{display:flex;align-items:center;gap:12px;}
        .chat-bot-icon{width:32px;height:32px;border-radius:50%;background:#e0e7ff;border:1px solid #c7d2fe;display:flex;align-items:center;justify-content:center;color:#6366f1;}
        .chat-header-name{font-weight:700;color:#1e293b;font-size:0.875rem;}
        .chat-header-status{font-size:0.625rem;color:#64748b;display:flex;align-items:center;gap:4px;}
        .status-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:pulse-dot 2s infinite;}
        @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.5}}
        .phone-btn{
          padding:8px;background:#6366f1;color:#fff;border:none;border-radius:50%;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 12px rgba(99,102,241,0.2);transition:transform 0.2s;
        }
        .phone-btn:hover{transform:scale(1.1);}
        .phone-btn:active{transform:scale(0.95);}

        /* Message List */
        .msg-list{flex:1;overflow-y:auto;padding:20px 16px;display:flex;flex-direction:column;gap:12px;}
        @media(min-width:640px){.msg-list{padding:24px;}}
        .msg{display:flex;gap:10px;max-width:85%;animation:slideUp 0.4s ease-out;}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .msg-user{align-self:flex-end;flex-direction:row-reverse;}
        .msg-ai{align-self:flex-start;}
        .msg-content{display:flex;flex-direction:column;gap:4px;}
        .avatar-sm{width:32px;height:32px;border-radius:50%;background:#e0e7ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#6366f1;margin-top:2px;}
        .bubble{padding:12px 16px;border-radius:16px;font-size:0.875rem;line-height:1.7;word-break:break-word;}
        .bubble-user{background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border-top-right-radius:4px;}
        .bubble-ai{background:#fff;color:#374151;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,0.04);border-top-left-radius:4px;}
        .msg-time{font-size:0.68rem;color:#94a3b8;}
        .msg-time-right{text-align:right;}

        .thinking{display:flex;gap:6px;align-items:center;padding:12px 20px;}
        .dot{width:8px;height:8px;border-radius:50%;background:#818cf8;animation:bounce 1.4s infinite ease-in-out;}
        .dot:nth-child(2){animation-delay:0.2s;}
        .dot:nth-child(3){animation-delay:0.4s;}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px);opacity:0.7}}

        /* Input Area */
        .input-area{
          flex-shrink:0;padding:12px 16px;
          background:rgba(250,249,254,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border-top:1px solid rgba(226,232,240,0.3);
        }
        .input-row{display:flex;align-items:flex-end;gap:10px;max-width:800px;margin:0 auto;}
        .clip-btn{padding:10px;color:#94a3b8;background:none;border:none;cursor:pointer;border-radius:50%;transition:all 0.2s;}
        .clip-btn:hover{color:#64748b;background:#f1f5f9;}
        .input-wrap{
          flex:1;background:#fff;border-radius:24px;
          box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);
          display:flex;align-items:center;padding:4px 16px;
          border:1px solid transparent;transition:border-color 0.2s;
        }
        .input-wrap:focus-within{border-color:#c7d2fe;background:#fff;}
        .input-field{
          width:100%;border:none;background:transparent;
          font-size:0.875rem;color:#1e293b;resize:none;
          max-height:128px;min-height:44px;padding:10px 0;
          outline:none;font-family:inherit;line-height:1.5;
        }
        .input-field::placeholder{color:#94a3b8;}
        .send-btn{
          padding:10px;border-radius:50%;border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.2s;flex-shrink:0;
          box-shadow:0 4px 12px rgba(0,0,0,0.1);
        }
        .send-btn-active{background:#6366f1;color:#fff;box-shadow:0 4px 12px rgba(99,102,241,0.2);}
        .send-btn-active:active{transform:scale(0.95);}
        .send-btn-mic{background:#1e293b;color:#fff;box-shadow:0 4px 12px rgba(30,41,59,0.2);}
        .send-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .spin{animation:spin 0.8s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}

        /* Mobile Nav */
        .mobile-nav{
          display:flex;flex-shrink:0;
          background:rgba(255,255,255,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border-top:1px solid rgba(226,232,240,0.5);
          padding:6px 8px;padding-bottom:max(6px, env(safe-area-inset-bottom));
          justify-content:space-around;
        }
        @media(min-width:768px){.mobile-nav{display:none;}}
        .mob-nav-btn{
          display:flex;flex-direction:column;align-items:center;gap:2px;
          padding:6px 12px;border:none;background:none;cursor:pointer;
          color:#94a3b8;font-size:0.6rem;font-weight:600;transition:color 0.2s;border-radius:12px;
        }
        .mob-nav-btn.active{color:#6366f1;}
        .mob-nav-btn.active::after{content:'';width:4px;height:4px;border-radius:50%;background:#6366f1;margin-top:2px;}
/* === Mobile Optimizations === */
@media(max-width:767px){
  .app-shell{min-height:100%;}
  .chat-header{padding:8px 12px;}
  .chat-header-name{font-size:0.8125rem;}
  .chat-header-status{font-size:0.6rem;}
  .chat-bot-icon{width:28px;height:28px;}
  .phone-btn{padding:6px;}
  .msg-list{padding:16px 12px;}
  .msg{max-width:92%;}
  .avatar-sm{width:28px;height:28px;}
  .bubble{padding:10px 14px;font-size:0.8125rem;}
  .input-area{padding:8px 12px;padding-bottom:max(8px, env(safe-area-inset-bottom));}
  .input-row{gap:6px;}
  .input-wrap{padding:2px 12px;}
  .clip-btn{padding:8px;}
  .input-field{min-height:40px;font-size:16px;}
  .mob-nav-btn{padding:4px 8px;font-size:0.55rem;}
}

      </style>

      <div class="app-shell">
        <!-- Sidebar (Desktop) -->
        <div class="sidebar">
          <div class="sidebar-brand">
            <div class="sidebar-logo">H</div>
            <span class="sidebar-brand-name">${t.brand}</span>
          </div>

          <div class="sidebar-profile">
            <div class="sidebar-avatar">${userName.charAt(0).toUpperCase()}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${this.escapeHtml(userName)}</div>
              <div class="sidebar-user-role">${roleLabel}</div>
            </div>
          </div>

          <nav class="sidebar-nav">
            ${navItems.map(item => `
              <button class="nav-item ${item.id === this.activeNav ? 'active' : ''}" data-id="${item.id}">
                <span class="nav-icon">${this.icon(item.icon)}</span>
                ${item.label}
              </button>
            `).join('')}
          </nav>

          <div class="sidebar-bottom">
            <button class="sidebar-btn" id="langBtn">${this.icon('globe')} ${this.lang === 'en' ? 'CN' : 'EN'}</button>
            <button class="sidebar-btn" id="loginBtn">${this.icon('login')} ${t.login}</button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-area">
          <div class="chat-container">
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="chat-header-left">
                <div class="chat-bot-icon">${this.icon('bot', 18)}</div>
                <div>
                  <div class="chat-header-name">${t.chatTitle}</div>
                  <div class="chat-header-status"><span class="status-dot"></span>${t.status}</div>
                </div>
              </div>
              <button class="phone-btn">${this.icon('phone', 18)}</button>
            </div>

            <!-- Messages -->
            <div class="msg-list" id="msgList"></div>

            <!-- Input -->
            <div class="input-area">
              <div class="input-row">
                <button class="clip-btn">${this.icon('paperclip', 20)}</button>
                <div class="input-wrap">
                  <textarea class="input-field" id="inputField" rows="1" placeholder="${t.inputPlaceholder}"></textarea>
                </div>
                <button class="send-btn send-btn-mic" id="sendBtn">${this.icon('mic', 20)}</button>
              </div>
            </div>
          </div>

          <!-- Mobile Bottom Nav -->
          <div class="mobile-nav">
            ${[
              { id: 'home', icon: 'home', label: t.home },
              { id: 'chat', icon: 'chat', label: t.chat },
              { id: 'booking', icon: 'booking', label: t.booking },
              { id: 'journal', icon: 'journal', label: t.journal },
              { id: 'assessment', icon: 'assessment', label: t.assessment },
            ].map(item => `
              <button class="mob-nav-btn ${item.id === this.activeNav ? 'active' : ''}" data-id="${item.id}">
                ${this.icon(item.icon, 18)}
                ${item.label}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // === Event Bindings ===
    // Sidebar nav
    s.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => this.handleNavClick(btn.dataset.id));
    });

    // Mobile nav
    s.querySelectorAll('.mob-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleNavClick(btn.dataset.id));
    });

    // Language toggle
    s.getElementById('langBtn').addEventListener('click', () => {
      this.lang = this.lang === 'en' ? 'zh' : 'en';
      this.render();
      this.messages = [];
      this.addWelcomeMessage();
    });

    // Chat input
    const input = s.getElementById('inputField');
    const sendBtn = s.getElementById('sendBtn');

    const updateSendBtn = () => {
      if (input.value.trim()) {
        sendBtn.className = 'send-btn send-btn-active';
        sendBtn.innerHTML = this.icon('send', 20);
      } else {
        sendBtn.className = 'send-btn send-btn-mic';
        sendBtn.innerHTML = this.icon('mic', 20);
      }
    };

    sendBtn.addEventListener('click', () => {
      const text = input.value;
      if (text.trim()) {
        this.sendMessage(text);
        input.value = '';
        input.style.height = 'auto';
        updateSendBtn();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 128) + 'px';
      updateSendBtn();
    });
  }
}

customElements.define('ai-chat-widget', AiChatWidget);
