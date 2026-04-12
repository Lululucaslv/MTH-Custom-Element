/**
 * Love Quiz — Wix Custom Element
 * 恋爱人格测试 - Vanilla JS Web Component
 */
class LoveQuiz extends HTMLElement {
  static get observedAttributes() { return ['user-id','user-email','user-name','lang']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.userId = 'guest';
    this.userEmail = '';
    this.userName = '';
    this.lang = 'zh';
    this.screen = 'start';
    this.currentQuestion = 0;
    this.scores = {passionate:0, hunter:0, possessive:0};
    this.resultId = '';
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback(n,_,v) {
    if (n==='user-id') this.userId=v||'guest';
    if (n==='user-email') this.userEmail=v||'';
    if (n==='user-name') this.userName=v||'';
    if (n==='lang') this.lang=v||'zh';
  }

  get questions() {
    return [
      {zh:'你暗恋的人突煶给你发了一条消息，打破了3天的沉默。你的第一反应？',options:[{text:'心跳加速！立刻满腔热情地回复 🔥',scores:[3,3,2]},{text:'冷静地过一会儿再回，保持高冷 🧊',scores:[0,1,0]},{text:'试探一下：等更久看ta是否在乎 🎯',scores:[1,0,3]}]},
      {zh:'在恋爱中，你理想的相处模式是？',options:[{text:'我主导，ta跟着我的节奏走 👑',scores:[2,3,2]},{text:'我们是平等的，各自自由 🦋',scores:[1,0,0]},{text:'ta追我，我享受被需要的感觉 💫',scores:[2,0,1]}]},
      {zh:'你看到伴侣的前任给他们的动态点赞了。你？',options:[{text:'立刻问清楚怎么回事，我需要解释！ 🔥',scores:[3,1,3]},{text:'没关系，我不太在意 😌',scores:[0,0,0]},{text:'随口提一下，暗示我的存在 😏',scores:[1,2,2]}]},
      {zh:'当你喜欢一个人时，你会？',options:[{text:'直接告白，绝对坦诚 🎯',scores:[3,3,1]},{text:'等对方先表白 🌙',scores:[0,0,1]},{text:'放暗号觀察对方反应 🕵️',scores:[1,1,2]}]},
      {zh:'伴侣想要和朋友一起出去，没有你。你的感受？',options:[{text:'我会想ta，会不停发消息 📱',scores:[3,0,3]},{text:'太好了！我也有自己的计划 🦅',scores:[0,2,0]},{text:'有点不安，但我信任ta 💭',scores:[1,0,1]}]},
      {zh:'吵架后，你会怎么做？',options:[{text:'要求立刻谈清楚 🔥',scores:[3,2,2]},{text:'给彼此空间，等ta来找我 👑',scores:[0,0,0]},{text:'反复分析哪里出了问题 🧠',scores:[2,1,3]}]},
      {zh:'当你正在约会时，有人对你表示兴趣。你？',options:[{text:'立刻拒绝，我很忠诚 💪',scores:[2,0,2]},{text:'享受被关注但保持距离 😏',scores:[0,2,0]},{text:'有点受宠若惊，可能轷微回应 🌸',scores:[1,1,0]}]},
      {zh:'你的爱的语言是？',options:[{text:'肢体接触和持续的亲密 🤗',scores:[3,2,3]},{text:'一起做各自的事的高质量时光 🏡',scores:[0,1,0]},{text:'瑜言蜜语和暖心的小举动 💌',scores:[2,2,1]}]},
      {zh:'当你和多个人约会时，多久后才会要求独占？',options:[{text:'立刻！我需要确定关系 🔥',scores:[3,0,3]},{text:'不急，我喜欢保留选择 🦋',scores:[0,2,0]},{text:'顺其自然，可能2-3个月 📅',scores:[1,1,1]}]},
      {zh:'你理想的约会是？',options:[{text:'充满惊喜的冒险 🎢',scores:[3,3,0]},{text:'随意的相处，和谁都行 😌',scores:[0,0,0]},{text:'浫���晙餐，让我觉得被选中 💎',scores:[2,0,2]}]},
      {zh:'你会查看伴侣的手机。多久一次？',options:[{text:'经常，我需要知道情况 👁️',scores:[1,1,3]},{text:'从不，我完全信任ta 🕊️',scores:[0,0,0]},{text:'很少，除非感觉不寻劲 🤔',scores:[1,1,1]}]},
      {zh:'在爱情中，你最可能？',options:[{text:'完全迷失在对方身上 🔥',scores:[3,1,3]},{text:'保持自我和独立兴趣 🦅',scores:[0,2,0]},{text:'融入但暗中保持掌控 �',scores:[1,2,2]}]},
      {zh:'如果你的伴侣获得他人的关注，你？',options:[{text:'自豪，喜欢炫耀ta 💪',scores:[2,3,1]},{text:'完全无所谓，那是ta的事 😌',scores:[0,0,0]},{text:'内心深处感到不安和威胁 😰',scores:[1,0,3]}]},
      {zh:'你在爱情中最大的恐惧是？',options:[{text:'被抛弃或被取代 💔',scores:[3,0,3]},{text:'失去独立和自由 🦋',scores:[0,2,0]},{text:'受到情感上的伤害或背叛 🥀',scores:[2,1,1]}]},
      {zh:'你想被怎样地爱？',options:[{text:'热烈地、全心全意地、ALL IN 🔥',scores:[3,1,2]},{text:'轻轻地、自由地、没有压力 🌬️',scores:[0,2,0]},{text:'细心地、忠诚地、全身心的奉献 💝',scores:[2,0,3]}]},
    ];
  }

  get personalityTypes() {
    return {
      'burning-lover':{zh:'燃烧型恋人',emoji:'🔥',desc:'爱对你来说就是一场熊烈火，全身心投入。你热烈地爱，热情地追求，需要完全的奉献。',personality:'你是那个凌晨2点发47条消息、计划惊喜旅行、把恋爱当成24/7热情项目的浦���主义者。',gradient:'linear-gradient(135deg,#ef4444,#f97316,#ec4899)',compatible:['devoted-guardian','mysterious-shadow']},
      'devoted-guardian':{zh:'守护型恋人',emoji:'👑',desc:'热情却稳定，你强烈地爱但想要保护和掌控。伴侣是你的优先级和执念。',personality:'你是保护欲强、忠诚但暗地里嫉妒的那个。你喜欢计划他们的生活、记住每一个细节、成为不可替代的人。',gradient:'linear-gradient(135deg,#4f46e5,#6366f1,#3b82f6)',compatible:['burning-lover','butterfly-free']},
      'mysterious-shadow':{zh:'神秘阴影',emoji:'🕵️‍♀️',desc:'你热情地爱但喜欢玩游戏。你按自己的节奏追求，让对方猜测你的真实感受。',personality:'爱情皆甹家〔—你分析每一步棋、测试他们的承诺、从不完全摊牌。距离是你的力量。',gradient:'linear-gradient(135deg,#334155,#4f46e5,#ec4899)',compatible:['burning-lover','butterfly-free']},
      'hunter-prey':{zh:'猎人型恋人',emoji:'🦊',desc:'冷静但好胜，你主动追求但保持自由。爱情对你来说是场游戏，你要赢。',personality:'你喜欢追猎的刺激感。一旦"得到"他们，你可能会失去兴趣。你需要新鲜感、刺激和掌控权。',gradient:'linear-gradient(135deg,#f59e0b,#f97316,#ef4444)',compatible:['butterfly-free','devoted-guardian']},
      'butterfly-free':{zh:'蝴蝶自由',emoji:'🦋',desc:'爱是自由。你对一切都很冷静，按自己的节奏追求，需要空间呼吸。没有占有欲。',personality:'关系自由主义者——你轻轻地爱、自由地生活、相信承诺不应该像牢笼。你是所有人猑朋友。',gradient:'linear-gradient(135deg,#4ade80,#22d3ee,#3b82f6)',compatible:['hunter-prey','wind-like']},
      'timid-deer':{zh:'胆小鹿',emoji:'🦌',desc:'安静而冷静，但你希望被追求。你很挑刔，希望有人能向你证明奉献。',personality:'浦���的悊观主义者——你相信爱但很害怕。你需要持续的保诅和深层的、专一的爱来感到安全。',gradient:'linear-gradient(135deg,#f9a8d4,#a5b4fc,#818cf8)',compatible:['devoted-guardian','mysterious-shadow']},
      'wind-like':{zh:'风一样的存在',emoji:'🌬️',desc:'冷静、神秘、自由。你按自己的方式爱，保持距离，难以琢磨。承诺？也许永远不会。',personality:'终极之豠——没人真正知道你在想什么。你吸引人但从不完全投入。独立是一切。',gradient:'linear-gradient(135deg,#9ca3af,#93c5fd,#5eead4)',compatible:['butterfly-free','hunter-prey']},
      'devoted-obsessive':{zh:'执念型恋人',emoji:'💝',desc:'你安静地深爱。你不是追求者，但一旦承诺就完全奉献且占有。永远是你的。',personality:'沉默的仰慕者变成坚定的伴侣——你觀察、分析、从暗处爱。你的奉献就是你的身份。',gradient:'linear-gradient(135deg,#f43f5e,#ec4899,#ef4444)',compatible:['burning-lover','devoted-guardian']},
    };
  }

  startQuiz() {
    this.scores = {passionate:0, hunter:0, possessive:0};
    this.currentQuestion = 0;
    this.screen = 'question';
    this.render();
  }

  handleAnswer(idx) {
    const q = this.questions[this.currentQuestion];
    const sc = q.options[idx].scores;
    this.scores.passionate += sc[0];
    this.scores.hunter += sc[1];
    this.scores.possessive += sc[2];
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.render();
    } else {
      this.calculateResult();
    }
  }

  calculateResult() {
    const p = this.scores.passionate >= 10;
    const h = this.scores.hunter >= 10;
    const po = this.scores.possessive >= 10;
    const key = `${p}-${h}-${po}`;
    const map = {
      'true-true-true':'burning-lover',
      'true-true-false':'mysterious-shadow',
      'true-false-true':'devoted-guardian',
      'true-false-false':'hunter-prey',
      'false-true-true':'devoted-obsessive',
      'false-true-false':'butterfly-free',
      'false-false-true':'timid-deer',
      'false-false-false':'wind-like',
    };
    this.resultId = map[key] || 'butterfly-free';
    this.screen = 'result';
    this.render();
    this.dispatchEvent(new CustomEvent('quizComplete', {
      detail: { type: this.resultId, scores: {...this.scores} }, bubbles: true
    }));
  }

  render() {
    const s = this.shadowRoot;
    if (this.screen === 'start') this.renderStart(s);
    else if (this.screen === 'question') this.renderQuiz(s);
    else this.renderResult(s);
  }

  renderStart(s) {
    s.innerHTML = `
      <style>${this.baseCSS()}
        .wrap{min-height:100vh;background:linear-gradient(135deg,#fce7f3,#fee2e2,#fff7ed);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;}
        .emoji{font-size:3.5rem;margin-bottom:16px;}
        .title{font-size:2.25rem;font-weight:800;background:linear-gradient(135deg,#ef4444,#ec4899,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;}
        .sub{font-size:1.1rem;color:#64748b;margin-bottom:32px;}
        .info{background:rgba(255,255,255,0.7);backdrop-filter:blur(8px);border-radius:16px;padding:20px;max-width:480px;color:#475569;font-size:0.9rem;line-height:1.7;margin-bottom:32px;}
        .start-btn{background:linear-gradient(135deg,#ec4899,#ef4444,#f97316);color:#fff;font-weight:700;font-size:1rem;padding:14px 36px;border:none;border-radius:12px;cursor:pointer;transition:transform .2s;}
        .start-btn:hover{transform:scale(1.05);}
        .back-link{margin-top:16px;color:#94a3b8;font-size:0.875rem;cursor:pointer;border:none;background:none;}
        .footer{margin-top:20px;font-size:0.8rem;color:#94a3b8;}
      </style>
      <div class="wrap">
        <div class="emoji">💕</div>
        <div class="title">你的恋爱人格是什么？</div>
        <div class="sub">正经人谁分析恋爱啊？</div>
        <div class="info">通过15道恋爱情景题，发现你的恋爱人格类型。热烈型？守护型？还是自由型？来测测看吧！</div>
        <button class="start-btn" id="startBtn">开始测试 🔥</button>
        <button class="back-link" id="backBtn">&larr; 返回</button>
        <div class="footer">结果很适合在小红书分享哦</div>
      </div>`;
    s.getElementById('startBtn').onclick = () => this.startQuiz();
    s.getElementById('backBtn').onclick = () => this.dispatchEvent(new CustomEvent('goBack',{bubbles:true}));
  }

  renderQuiz(s) {
    const q = this.questions[this.currentQuestion];
    const pct = (this.currentQuestion / this.questions.length) * 100;
    s.innerHTML = `
      <style>${this.baseCSS()}
        .wrap{min-height:100vh;background:linear-gradient(135deg,#eef2ff,#eef2ff,#fdf2f8);display:flex;flex-direction:column;}
        .header{position:sticky;top:0;background:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);z-index:10;}
        .back{background:none;border:none;cursor:pointer;color:#ec4899;font-size:1.2rem;}
        .counter{font-size:0.85rem;color:#64748b;}
        .pbar{flex:1;height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden;}
        .pfill{height:100%;background:linear-gradient(90deg,#ec4899,#ef4444,#f97316);border-radius:99px;transition:width .4s;}
        .body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px;max-width:640px;margin:0 auto;width:100%;}
        .qtxt{font-size:1.25rem;font-weight:700;color:#1e293b;text-align:center;margin-bottom:32px;line-height:1.6;}
        .opts{display:flex;flex-direction:column;gap:12px;width:100%;}
        .opt{display:flex;align-items:center;gap:12px;width:100%;padding:16px;background:rgba(255,255,255,0.8);backdrop-filter:blur(4px);border:2px solid transparent;border-radius:12px;cursor:pointer;text-align:left;font-size:0.95rem;color:#1e293b;transition:all .2s;}
        .opt:hover{border-color:#f9a8d4;transform:scale(1.03);box-shadow:0 4px 12px rgba(236,72,153,0.15);}
        .opt-dot{width:24px;height:24px;border-radius:50%;border:2px solid #f9a8d4;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#ec4899;font-weight:700;flex-shrink:0;}
      </style>
      <div class="wrap">
        <div class="header">
          <button class="back" id="qBack">&larr;</button>
          <span class="counter">Question ${this.currentQuestion+1}/${this.questions.length} · ${Math.round(pct)}%</span>
          <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
        </div>
        <div class="body">
          <div class="qtxt">${q.zh}</div>
          <div class="opts">
            ${q.options.map((o,i) => `<button class="opt" data-idx="${i}"><span class="opt-dot">${String.fromCharCode(65+i)}</span>${o.text}</button>`).join('')}
          </div>
        </div>
      </div>`;
    s.getElementById('qBack').onclick = () => { this.screen='start'; this.render(); };
    s.querySelectorAll('.opt').forEach(btn => {
      btn.onclick = () => this.handleAnswer(parseInt(btn.dataset.idx));
    });
  }

  renderResult(s) {
    const t = this.personalityTypes[this.resultId];
    const dims = [
      {name:'热烈程度',emoji:'❤️‍🔥',score:this.scores.passionate,max:15,gradient:'linear-gradient(90deg,#ef4444,#ec4899)'},
      {name:'主动程度',emoji:'🦊',score:this.scores.hunter,max:15,gradient:'linear-gradient(90deg,#f59e0b,#f97316)'},
      {name:'占有程度',emoji:'🔒',score:this.scores.possessive,max:15,gradient:'linear-gradient(90deg,#6366f1,#ec4899)'},
    ];
    const compatHTML = (t.compatible||[]).map(c => {
      const ct = this.personalityTypes[c];
      return ct ? `<span class="compat-item">${ct.emoji} ${ct.zh}</span>` : '';
    }).join('');

    s.innerHTML = `
      <style>${this.baseCSS()}
        .wrap{min-height:100vh;background:linear-gradient(135deg,#0f172a,#1e293b,#0f172a);padding:24px;color:#fff;}
        .header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
        .back{background:none;border:none;cursor:pointer;color:#c7d2fe;font-size:1.2rem;}
        .htitle{color:#e2e8f0;font-weight:600;}
        .result-card{border-radius:24px;padding:32px;text-align:center;color:#fff;margin-bottom:24px;box-shadow:0 8px 32px rgba(0,0,0,0.3);}
        .remoji{font-size:4.5rem;margin-bottom:12px;}
        .rname{font-size:2rem;font-weight:800;margin-bottom:4px;}
        .rsub{font-size:0.9rem;opacity:0.8;margin-bottom:16px;}
        .rdesc{font-size:0.95rem;line-height:1.7;margin-bottom:16px;opacity:0.95;}
        .rpersonality{background:rgba(255,255,255,0.15);border-radius:12px;padding:16px;font-size:0.9rem;line-height:1.7;text-align:left;}
        .dims-section{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px;margin-bottom:24px;}
        .dims-title{font-weight:700;margin-bottom:16px;font-size:1rem;}
        .dim-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
        .dim-emoji{font-size:1.2rem;}
        .dim-label{font-size:0.85rem;color:#cbd5e1;min-width:70px;}
        .dim-bar{flex:1;height:14px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;}
        .dim-fill{height:100%;border-radius:99px;transition:width .6s;}
        .dim-score{font-size:0.8rem;color:#94a3b8;min-width:40px;text-align:right;}
        .compat{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px;margin-bottom:24px;}
        .compat-title{font-weight:700;margin-bottom:12px;font-size:1rem;}
        .compat-list{display:flex;gap:12px;flex-wrap:wrap;}
        .compat-item{background:rgba(255,255,255,0.1);padding:8px 16px;border-radius:99px;font-size:0.85rem;}
        .actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:24px;}
        .btn{padding:12px 24px;border-radius:12px;font-weight:600;font-size:0.9rem;cursor:pointer;border:none;transition:transform .2s;}
        .btn:hover{transform:scale(1.05);}
        .btn-primary{background:linear-gradient(135deg,#ec4899,#ef4444);color:#fff;}
        .btn-secondary{background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.2);}
        .footer{text-align:center;font-size:0.8rem;color:#64748b;}
      </style>
      <div class="wrap">
        <div class="header">
          <button class="back" id="rBack">&larr;</button>
          <span class="htitle">你的恋爱人格</span>
          <div></div>
        </div>
        <div class="result-card" style="background:${t.gradient}">
          <div class="remoji">${t.emoji}</div>
          <div class="rname">${t.zh}</div>
          <div class="rsub">Your Love Personality</div>
          <div class="rdesc">${t.desc}</div>
          <div class="rpersonality">${t.personality}</div>
        </div>
        <div class="dims-section">
          <div class="dims-title">维度分析</div>
          ${dims.map(d => `<div class="dim-row">
            <span class="dim-emoji">${d.emoji}</span>
            <span class="dim-label">${d.name}</span>
            <div class="dim-bar"><div class="dim-fill" style="width:${Math.min(d.score/d.max*100,100)}%;background:${d.gradient}"></div></div>
            <span class="dim-score">${Math.min(d.score,d.max)}/${d.max}</span>
          </div>`).join('')}
        </div>
        ${compatHTML ? `<div class="compat"><div class="compat-title">最佳匹配类型</div><div class="compat-list">${compatHTML}</div></div>` : ''}
        <div class="actions">
          <button class="btn btn-primary" id="shareBtn">复制结果文案</button>
          <button class="btn btn-secondary" id="retryBtn">🔄 重新测试</button>
        </div>
        <div class="footer">快去小红书分享你的结果吧！ 📸</div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `我的恋爱人格是"${t.zh}" ${t.emoji}\n你的呢？来测试一下吧！`;
      if (navigator.clipboard) { navigator.clipboard.writeText(txt); }
      const btn = s.getElementById('shareBtn');
      btn.textContent = '已复制!';
      setTimeout(() => btn.textContent = '复制结果文案', 2000);
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('love-quiz', LoveQuiz);
