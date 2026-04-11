/**
 * Assessment Hub — Wix Custom Element
 * Main test page with card grid, routes to individual quizzes
 * Loads sub-quiz elements dynamically
 */
class AssessmentHub extends HTMLElement {
  static get observedAttributes() { return ['user-id','user-email','user-name','lang']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.userId = 'guest';
    this.userEmail = '';
    this.userName = '';
    this.lang = 'zh';
    this.activeQuiz = null; // null = hub, 'sbti' | 'fun' | 'love' | 'stress' | 'ai-chat' | 'mbti' | 'phq9' | 'gad7' | 'holland' | 'human3'
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback(n,_,v) {
    if (n==='user-id') this.userId=v||'guest';
    if (n==='user-email') this.userEmail=v||'';
    if (n==='user-name') this.userName=v||'';
    if (n==='lang') this.lang=v||'zh';
  }

  get funQuizCards() {
    return [
      {id:'fun',name:'精神狶态鉴定',emoji:'🧠',desc:'20题 · 4维度 · 16种类型',gradient:'linear-gradient(135deg,#6366f1,#818cf8,#f472b6)',shadow:'rgba(99,102,241,0.3)'},
      {id:'love',name:'恋爱人格鉴定',emoji:'💘',desc:'15题 · 8种恋爱类型',gradient:'linear-gradient(135deg,#ec4899,#f43f5e,#ef4444)',shadow:'rgba(236,72,153,0.3)'},
      {id:'stress',name:'你的压力怪兽',emoji:'👾',desc:'12题 · 8种怪兽类型',gradient:'linear-gradient(135deg,#334155,#1e293b,#312e81)',shadow:'rgba(99,102,241,0.3)'},
      {id:'sbti',name:'SB-TI 人格测试',emoji:'🔮',desc:'30题 · 15维度 · 25+类型',gradient:'linear-gradient(135deg,#f59e0b,#f97316,#ef4444)',shadow:'rgba(249,115,22,0.3)'},
    ];
  }

  get proCards() {
    return [
      {id:'mbti',name:'MBTI 性格测试',desc:'探索你的16种性格类型',icon:'👤',color:'#6366f1',bg:'#eef2ff'},
      {id:'phq9',name:'PHQ-9 抑郁筛查',desc:'专业的抑郁症状评估',icon:'📊',color:'#0ea5e9',bg:'#f0f9ff'},
      {id:'gad7',name:'GAD-7 焦虑评估',desc:'广泛性焦虑障碍筛查',icon:'⚡',color:'#f97316',bg:'#fff7ed'},
      {id:'holland',name:'Holland 职业兴趣',desc:'发现你的职业倾向',icon:'❓',color:'#14b8a6',bg:'#f0fdfa'},
    ];
  }

  openQuiz(id) {
    this.activeQuiz = id;
    this.render();
  }

  goBack() {
    this.activeQuiz = null;
    this.render();
  }

  render() {
    const s = this.shadowRoot;
    if (this.activeQuiz) {
      this.renderActiveQuiz(s);
    } else {
      this.renderHub(s);
    }
  }

  renderHub(s) {
    const funCards = this.funQuizCards.map(c => `
      <div class="fun-card" data-id="${c.id}" style="background:${c.gradient}">
        <div class="fun-emoji">${c.emoji}</div>
        <div class="fun-name">${c.name}</div>
        <div class="fun-desc">${c.desc}</div>
      </div>
    `).join('');

    const humanCard = `
      <div class="human-card" data-id="human3">
        <div class="human-badge">HUMAN 3.0</div>
        <div class="human-title">HUMAN 3.0 综合人格评估</div>
        <div class="human-desc">AI驱动的深度人格分析，通过对话式评估全面了解你的心理特征</div>
        <button class="human-btn">开始评估 →</button>
      </div>
    `;

    const proGrid = this.proCards.map(c => `
      <div class="pro-card" data-id="${c.id}">
        <div class="pro-icon" style="background:${c.bg};color:${c.color}">${c.icon}</div>
        <div class="pro-info">
          <div class="pro-name">${c.name}</div>
          <div class="pro-desc">${c.desc}</div>
        </div>
        <div class="pro-arrow">→</div>
      </div>
    `).join('');

    // AI Chat card
    const chatCard = `
      <div class="chat-card" data-id="ai-chat">
        <div class="chat-emoji">🤖</div>
        <div class="chat-info">
          <div class="chat-name">AI 心理咨询</div>
          <div class="chat-desc">和 Huggy AI 聊聊你的心事</div>
        </div>
        <div class="chat-arrow">→</div>
      </div>
    `;

    s.innerHTML = `
      <style>${this.baseCSS()}
        .hub{min-height:100vh;background:#f8fafc;padding:24px;max-width:1024px;margin:0 auto;}
        .header{margin-bottom:32px;}
        .header-title{font-size:1.75rem;font-weight:800;color:#1e293b;margin-bottom:4px;}
        .header-sub{font-size:0.95rem;color:#64748b;}
        .section-title{display:flex;align-items:center;gap:8px;font-size:1.1rem;font-weight:700;color:#1e293b;margin-bottom:16px;}
        .hot-badge{background:linear-gradient(135deg,#ec4899,#6366f1);color:#fff;font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:99px;}
        .fun-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:40px;}
        @media(min-width:768px){.fun-grid{grid-template-columns:repeat(4,1fr);}}
        .fun-card{border-radius:24px;padding:24px;color:#fff;cursor:pointer;transition:all .2s;min-height:160px;display:flex;flex-direction:column;justify-content:flex-end;}
        .fun-card:hover{transform:scale(1.02);box-shadow:0 12px 24px var(--shadow-color,rgba(0,0,0,0.15));}
        .fun-card:active{transform:scale(0.98);}
        .fun-emoji{font-size:2rem;margin-bottom:8px;}
        .fun-name{font-size:1rem;font-weight:700;margin-bottom:4px;}
        .fun-desc{font-size:0.75rem;opacity:0.85;}
        .human-card{background:linear-gradient(135deg,#1e293b,#1e3a5f);border:1px solid #334155;border-radius:36px;padding:32px;color:#fff;cursor:pointer;margin-bottom:16px;transition:all .2s;}
        .human-card:hover{transform:scale(1.01);box-shadow:0 8px 24px rgba(0,0,0,0.2);}
        .human-badge{display:inline-block;background:rgba(251,191,36,0.2);border:1px solid rgba(255,255,255,0.2);color:#fbbf24;font-size:0.7rem;font-weight:700;padding:4px 12px;border-radius:99px;margin-bottom:12px;}
        .human-title{font-size:1.5rem;font-weight:800;margin-bottom:8px;}
        .human-desc{font-size:0.9rem;color:#94a3b8;margin-bottom:16px;line-height:1.6;}
        .human-btn{background:#fff;color:#1e293b;font-weight:600;padding:10px 24px;border:none;border-radius:12px;cursor:pointer;font-size:0.9rem;}
        .pro-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:40px;}
        @media(max-width:600px){.pro-grid{grid-template-columns:1fr;}}
        .pro-card{background:#fff;border:1px solid #f1f5f9;border-radius:24px;padding:20px;display:flex;align-items:center;gap:16px;cursor:pointer;transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,0.04);}
        .pro-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08);transform:translateY(-2px);}
        .pro-icon{width:48px;height:48px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0;}
        .pro-info{flex:1;}
        .pro-name{font-weight:700;color:#1e293b;font-size:0.95rem;margin-bottom:2px;}
        .pro-desc{font-size:0.8rem;color:#94a3b8;}
        .pro-arrow{color:#cbd5e1;font-size:1.2rem;}
        .chat-card{background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:24px;padding:20px;display:flex;align-items:center;gap:16px;cursor:pointer;transition:all .2s;color:#fff;margin-bottom:24px;}
        .chat-card:hover{transform:scale(1.02);box-shadow:0 8px 24px rgba(99,102,241,0.3);}
        .chat-emoji{font-size:2rem;}
        .chat-info{flex:1;}
        .chat-name{font-weight:700;font-size:1.1rem;}
        .chat-desc{font-size:0.85rem;opacity:0.85;}
        .chat-arrow{font-size:1.2rem;opacity:0.7;}
      </style>
      <div class="hub">
        <div class="header">
          <div class="header-title">心理测评中心</div>
          <div class="header-sub">探索你的内心世界</div>
        </div>

        <div class="section-title">✨ 趣味测试 <span class="hot-badge">HOT</span></div>
        <div class="fun-grid">${funCards}</div>

        ${chatCard}

        <div class="section-title">📋 专业评估</div>
        ${humanCard}
        <div class="pro-grid">${proGrid}</div>
      </div>`;

    // Bind click events
    s.querySelectorAll('.fun-card').forEach(el => {
      el.onclick = () => this.openQuiz(el.dataset.id);
    });
    s.querySelector('.human-card').onclick = () => this.openQuiz('human3');
    s.querySelectorAll('.pro-card').forEach(el => {
      el.onclick = () => this.openQuiz(el.dataset.id);
    });
    s.querySelector('.chat-card').onclick = () => this.openQuiz('ai-chat');
  }

  renderActiveQuiz(s) {
    const quizMap = {
      'sbti': {tag:'sbti-quiz', src:'https://lululucaslv.github.io/MTH-Custom-Element/sbti-quiz.js'},
      'fun': {tag:'fun-quiz', src:'https://lululucaslv.github.io/MTH-Custom-Element/fun-quiz.js'},
      'love': {tag:'love-quiz', src:'https://lululucaslv.github.io/MTH-Custom-Element/love-quiz.js'},
      'stress': {tag:'stress-quiz', src:'https://lululucaslv.github.io/MTH-Custom-Element/stress-quiz.js'},
      'ai-chat': {tag:'ai-chat-widget', src:'https://lululucaslv.github.io/MTH-Custom-Element/ai-chat.js'},
    };

    const quiz = quizMap[this.activeQuiz];

    if (quiz) {
      // Load external quiz component
      s.innerHTML = `
        <style>${this.baseCSS()}
          .quiz-container{width:100%;min-height:100vh;}
        </style>
        <div class="quiz-container" id="quizContainer"></div>`;

      // Dynamically load the quiz script if not already defined
      if (!customElements.get(quiz.tag)) {
        const script = document.createElement('script');
        script.src = quiz.src;
        script.onload = () => this.injectQuizElement(s, quiz.tag);
        document.head.appendChild(script);
      } else {
        this.injectQuizElement(s, quiz.tag);
      }
    } else {
      // Professional tests - show coming soon or AI chat placeholder
      const names = {
        'mbti':'MBTI 性格测试','phq9':'PHQ-9 抑郁筛查','gad7':'GAD-7 焦虑评估',
        'holland':'Holland 职业兴趣','human3':'HUMAN 3.0 综合评估'
      };
      s.innerHTML = `
        <style>${this.baseCSS()}
          .placeholder{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;background:#f8fafc;}
          .placeholder-icon{font-size:4rem;margin-bottom:16px;}
          .placeholder-title{font-size:1.5rem;font-weight:700;color:#1e293b;margin-bottom:8px;}
          .placeholder-desc{color:#64748b;margin-bottom:32px;font-size:0.95rem;}
          .back-btn{background:#4f46e5;color:#fff;font-weight:600;padding:12px 28px;border:none;border-radius:12px;cursor:pointer;font-size:0.95rem;}
          .back-btn:hover{background:#4338ca;}
        </style>
        <div class="placeholder">
          <div class="placeholder-icon">🚧</div>
          <div class="placeholder-title">${names[this.activeQuiz] || this.activeQuiz}</div>
          <div class="placeholder-desc">此功能即将上线，敬请期待！</div>
          <button class="back-btn" id="backBtn">← 返回测评中心</button>
        </div>`;
      s.getElementById('backBtn').onclick = () => this.goBack();
    }
  }

  injectQuizElement(s, tag) {
    const container = s.getElementById('quizContainer');
    if (!container) return;
    const el = document.createElement(tag);
    el.setAttribute('user-id', this.userId);
    el.setAttribute('user-email', this.userEmail);
    el.setAttribute('user-name', this.userName);
    el.setAttribute('lang', this.lang);
    el.addEventListener('goBack', () => this.goBack());
    el.addEventListener('quizComplete', (e) => {
      this.dispatchEvent(new CustomEvent('quizComplete', { detail: e.detail, bubbles: true }));
    });
    container.appendChild(el);
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('assessment-hub', AssessmentHub);
