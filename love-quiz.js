/**
 * Love Quiz â Wix Custom Element
 * æç±äººæ ¼æµè¯ - Vanilla JS Web Component
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
      {zh:'ä½ ææçäººç¨ç¶å§äºä¸æ¡æ¶æ¯ï¼æç ´äº3å¤©çæ²é»ãä½ çç¬¬ä¸ååºï¼',options:[{text:'å¿è·³å éï¼ç«å»æ»¡èç­æå°åå¤ ð¥',scores:[3,3,2]},{text:'å·éå°è¿ä¸ä¼å¿ååï¼ä¿æé«å· ð§',scores:[0,1,0]},{text:'è¯æ¢ä¸ä¸ï¼ç­æ´ä¹çtaæ¯å¦å¨ä¹ ð¯',scores:[1,0,3]}]},
      {zh:'å¨æç±ä¸­ï¼ä½ çæ³çç¸å¤æ¨¡å¼æ¯ï¼',options:[{text:'æä¸»å¯¼ï¼taè·çæçèå¥èµ° ð',scores:[2,3,2]},{text:'æä»¬æ¯å¹³ç­çï¼åèªèªç± ð¦',scores:[1,0,0]},{text:'taè¿½æï¼æäº«åè¢«éè¦çæè§ ð«',scores:[2,0,1]}]},
      {zh:'ä½ çå°ä¼´ä¾£çåä»»ç»ä»ä»¬çå¨æç¹èµäºãä½ ï¼',options:[{text:'ç«å»é®æ¸æ¥æä¹åäºï¼æéè¦è§£éï¼ ð¥',scores:[3,1,3]},{text:'æ²¡å³ç³»ï¼æä¸å¤ªå¨æ ð',scores:[0,0,0]},{text:'éå£æä¸ä¸ï¼æç¤ºæçå­å¨ ð',scores:[1,2,2]}]},
      {zh:'å½ä½ åæ¬¢ä¸ä¸ªäººæ¶ï¼ä½ ä¼ï¼',options:[{text:'ç´æ¥åç½ï¼ç»å¯¹å¦è¯ ð¯',scores:[3,3,1]},{text:'ç­å¯¹æ¹åè¡¨ç½ ð',scores:[0,0,1]},{text:'æ¾æå·è§å¯å¯¹æ¹ååº ðµï¸',scores:[1,1,2]}]},
      {zh:'ä¼´ä¾£æ³è¦åæåä¸èµ·åºå»ï¼æ²¡æä½ ãä½ çæåï¼',options:[{text:'æä¼æ³taï¼ä¼ä¸ååæ¶æ¯ ð±',scores:[3,0,3]},{text:'å¤ªå¥½äºï¼æä¹æèªå·±çè®¡å ð¦',scores:[0,2,0]},{text:'æç¹ä¸å®ï¼ä½æä¿¡ä»»ta ð­',scores:[1,0,1]}]},
      {zh:'åµæ¶åï¼ä½ ä¼æä¹åï¼',options:[{text:'è¦æ±ç«å»è°æ¸æ¥ ð¥',scores:[3,2,2]},{text:'ç»å½¼æ­¤ç©ºé´ï¼ç­taæ¥æ¾æ ð',scores:[0,0,0]},{text:'åå¤åæåªéåºäºé®é¢ ð§ ',scores:[2,1,3]}]},
      {zh:'å½ä½ æ­£å¨çº¦ä¼æ¶ï¼æäººå¯¹ä½ è¡¨ç¤ºå´è¶£ãä½ ï¼',options:[{text:'ç«å»æç»ï¼æå¾å¿ è¯ ðª',scores:[2,0,2]},{text:'äº«åè¢«å³æ³¨ä½ä¿æè·ç¦» ð',scores:[0,2,0]},{text:'æç¹åå® è¥æï¼å¯è½è½»å¾®ååº ð¸',scores:[1,1,0]}]},
      {zh:'ä½ çç±çè¯­è¨æ¯ï¼',options:[{text:'è¢ä½æ¥è§¦åæç»­çäº²å¯ ð¤',scores:[3,2,3]},{text:'ä¸èµ·ååèªçäºçé«è´¨éæ¶å ð¡',scores:[0,1,0]},{text:'çè¨èè¯­åæå¿çå°ä¸¾å¨ ð',scores:[2,2,1]}]},
      {zh:'å½ä½ åå¤ä¸ªäººçº¦ä¼æ¶ï¼å¤ä¹åæä¼è¦æ±ç¬å ï¼',options:[{text:'ç«å»ï¼æéè¦ç¡®å®å³ç³» ð¥',scores:[3,0,3]},{text:'ä¸æ¥ï¼æåæ¬¢ä¿çéæ© ð¦',scores:[0,2,0]},{text:'é¡ºå¶èªç¶ï¼å¯è½2-3ä¸ªæ ð',scores:[1,1,1]}]},
      {zh:'å½ çæ³ççº¦ä¼æ¯ï¼',options:[{text:'åæ»¡æåçåé© ð¢',scores:[3,3,0]},{text:'éæçç¸å¤ï¼åè°é½è¡ ð',scores:[0,0,0]},{text:'æµªæ¼«æé¤ï¼è®©æè§å¾è¢«éä¸­ ð',scores:[2,0,2]}]},
      {zh:'ä½ ä¼æ¥çä¼´ä¾£çææºãå¤ä¹ä¸æ¬¡ï¼',options:[{text:'ç»å¸¸ï¼æéè¦ç¥éæåµ ðï¸',scores:[1,1,3]},{text:'ä»ä¸ï¼æå®å¨ä¿¡ä»»ta ðï¸',scores:[0,0,0]},{text:'å¾å°ï¼é¤éæè§ä¸å¯¹å² ð¤',scores:[1,1,1]}]},
      {zh:'å¨ç±æä¸­ï¼ä½ æå¯è½ï¼',options:[{text:'å®å¨è¿·å¤±å¨å¯¹æ¹èº«ä¸ ð¥',scores:[3,1,3]},{text:'ä¿æèªæåç¬ç«å´è¶£ ð¦',scores:[0,2,0]},{text:'èå¥ä½æä¸­ä¿æææ§ ð',scores:[1,2,2]}]},
      {zh:'å¦æä½ çä¼´ä¾£è·å¾ä»äººçå³æ³¨ï¼ä½ ï¼',options:[{text:'èªè±ªï¼åæ¬¢ç«èta ðª',scores:[2,3,1]},{text:'å®å¨æ æè°ï¼é£æ¯taçäº ð',scores:[0,0,0]},{text:'åå¿æ·±å¤æå°ä¸å®åå¨è ð°',scores:[1,0,3]}]},
      {zh:'ä½ å¨ç±æä¸­æå¤§çææ§æ¯ï¼',options:[{text:'è¢«æå¼æè¢«åä»£ ð',scores:[3,0,3]},{text:'å¤±å»ç¬ç«åèªç± ð¦',scores:[0,2,0]},{text:'åå°ææä¸çä¼¤å®³æèå ð¥',scores:[2,1,1]}]},
      {zh:'ä½ æ³è¢«ææ ·å°ç±ï¼',options:[{text:'ç­çå°ãå¨å¿å¨æå°ãALL IN ð¥',scores:[3,1,2]},{text:'è½»è½»å°ãèªç±å°ãæ²¡æåå ð¬ï¸',scores:[0,2,0]},{text:'ç»å¿å°ãå¿ è¯å°ãå¨èº«å¿çå¥ç® ð',scores:[2,0,3]}]},
    ];
  }

  get personalityTypes() {
    return {
      'burning-lover':{zh:'çç§åæäºº',emoji:'ð¥',desc:'ç±å¯¹ä½ æ¥è¯´å°±æ¯ä¸åºççç«ï¼å¨èº«å¿æå¥ãä½ ç­çå°ç±ï¼ç­æå°è¿½æ±ï¼éè¦å®å¨çå¥ç®ã',personality:'ä½ æ¯é£ä¸ªåæ¨2ç¹å47æ¡æ¶æ¯ãè®¡åæåæè¡ãææç±å½æ24/7ç­æé¡¹ç®çæµªæ¼«ä¸»ä¹èã',gradient:'linear-gradient(135deg,#ef4444,#f97316,#ec4899)',compatible:['devoted-guardian','mysterious-shadow']},
      'devoted-guardian':{zh:'å®æ¤åæäºº',emoji:'ð',desc:'ç­æå´ç¨³å®ï¼ä½ å¼ºçå°ç±ä½æ³è¦ä¿æ¤åææ§ãä¼´ä¾£æ¯ä½ çä¼åçº§åæ§å¿µã',personality:'ä½ æ¯ä¿æ¤æ¬²å¼ºãå¿ è¯ä½æå°éå«å¦çé£ä¸ªãä½ åæ¬¢è®¡åä»ä»¬ççæ´»ãè®°ä½æ¯ä¸ä¸ªç»èãæä¸ºä¸å¯æ¿ä»£çäººã',gradient:'linear-gradient(135deg,#4f46e5,#6366f1,#3b82f6)',compatible:['burning-lover','butterfly-free']},
      'mysterious-shadow':{zh:'ç¥ç§é´å½±',emoji:'ðµï¸ââï¸',desc:'ä½ ç­æå°ç±ä½åæ¬¢ç©æ¸¸æãä½ æèªå·±çèå¥è¿½æ±ï¼è®©å¯¹æ¹çæµä½ ççå®æåã',personality:'ç±æçæç¥å®¶ââä½ åææ¯ä¸æ­¥æ£ãæµè¯ä»ä»¬çæ¿è¯ºãä»ä¸å®å¨æçãè·ç¦»æ¯ä½ çåéã',gradient:'linear-gradient(135deg,#334155,#4f46e5,#ec4899)',compatible:['burning-lover','butterfly-free']},
      'hunter-prey':{zh:'çäººåæäºº',emoji:'ð¦',desc:'å·éä½å¥½èï¼ä½ ä¸»å¨è¿½æ±ä½ä¿æèªç±ãç±æå¯¹ä½ æ¥è¯´æ¯åºæ¸¸æï¼ä½ è¦èµ¢ã',personality:'ä½ åæ¬¢è¿½ççåºæ¿æãä¸æ¦"å¾å°"ä»ä»¬ï¼ä½ å¯è½ä¼å¤±å»å´è¶£ãä½ éè¦æ°é²æãåºæ¿åææ§æã',gradient:'linear-gradient(135deg,#f59e0b,#f97316,#ef4444)',compatible:['butterfly-free','devoted-guardian']},
      'butterfly-free':{zh:'è´è¶èªç±',emoji:'ð¦',desc:'ç±æ¯èªç±ãä½ å¯¹ä¸åé½å¾å·éï¼æèªå·±çèå¥è¿½æ±ï¼éè¦ç©ºé´å¼å¸ãæ²¡æå ææ¬²ã',personality:'å³ç³»èªç±ä¸»ä¹èââä½ è½»è½»å°ç±ãèªç±å°çæ´»ãç¸ä¿¡æ¿è¯ºä¸åºè¯¥åç¢ç¬¼ãä½ æ¯ææäººçæåã',gradient:'linear-gradient(135deg,#4ade80,#22d3ee,#3b82f6)',compatible:['hunter-prey','wind-like']},
      'timid-deer':{zh:'èå°é¹¿',emoji:'ð¦',desc:'å®éèå·éï¼ä½ä½ å¸æè¢«è¿½æ±ãä½ å¾æåï¼å¸ææäººè½åä½ è¯æå¥ç®ã',personality:'æµªæ¼«çæ²è§ä¸»ä¹èââä½ ç¸ä¿¡ç±ä½å¾å®³æãä½ éè¦æç»­çä¿è¯åæ·±å±çãä¸ä¸çç±æ¥æå°å®å¨ã',gradient:'linear-gradient(135deg,#f9a8d4,#a5b4fc,#818cf8)',compatible:['devoted-guardian','mysterious-shadow']},
      'wind-like':{zh:'é£ä¸æ ·çå­å¨',emoji:'ð¬ï¸',desc:'å·éãç¥ç§ãèªç±ãä½ æèªå·±çæ¹å¼ç±ï¼ä¿æè·ç¦»ï¼é¾ä»¥ç¢ç£¨ãæ¿è¯ºï¼ä¹è®¸æ°¸è¿ä¸ä¼ã',personality:'ç»æä¹è°ââæ²¡äººçæ­£ç¥éä½ å¨æ³ä»ä¹ãä½ å¸å¼äººä½ä»ä¸å®å¨æå¥ãç¬ç«æ¯ä¸åã',gradient:'linear-gradient(135deg,#9ca3af,#93c5fd,#5eead4)',compatible:['butterfly-free','hunter-prey']},
      'devoted-obsessive':{zh:'æ§å¿µåæäºº',emoji:'ð',desc:'ä½ å®éå°æ·±ç±ãä½ ä¸æ¯è¿½æ±èï¼ä½ä¸æ¦æ¿è¯ºå°±å®å¨å¥ç®ä¸å æãæ°¸è¿æ¯ä½ çã',personality:'æ²é»çä»°æèåæåå®çä¼´ä¾£ââä½ è§å¯ãåæãä»æå¤ç±ãä½ çå¥ç®å°±æ¯ä½ çèº«ä»½ã',gradient:'linear-gradient(135deg,#f43f5e,#ec4899,#ef4444)',compatible:['burning-lover','devoted-guardian']},
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
        <div class="emoji">ð</div>
        <div class="title">ä½ çæç±äººæ ¼æ¯ä»ä¹ï¼</div>
        <div class="sub">æ­£ç»äººè°åææç±åï¼</div>
        <div class="info">éè¿15éæç±ææ¯é¢ï¼åç°ä½ çæç±äººæ ¼ç±»åãç­çåï¼å®æ¤åï¼è¿æ¯èªç±åï¼æ¥æµæµçå§ï¼</div>
        <button class="start-btn" id="startBtn">å¼å§æµè¯ ð¥</button>
        <button class="back-link" id="backBtn">&larr; è¿å</button>
        <div class="footer">ç»æå¾éåå¨å°çº¢ä¹¦åäº«å¦</div>
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
          <span class="counter">Question ${this.currentQuestion+1}/${this.questions.length} Â· ${Math.round(pct)}%</span>
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
      {name:'ç­çç¨åº¦',emoji:'â¤ï¸âð¥',score:this.scores.passionate,max:15,gradient:'linear-gradient(90deg,#ef4444,#ec4899)'},
      {name:'ä¸»å¨ç¨åº¦',emoji:'ð¦',score:this.scores.hunter,max:15,gradient:'linear-gradient(90deg,#f59e0b,#f97316)'},
      {name:'å æç¨åº¦',emoji:'ð',score:this.scores.possessive,max:15,gradient:'linear-gradient(90deg,#6366f1,#ec4899)'},
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
          <span class="htitle">ä½ çæç±äººæ ¼</span>
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
          <div class="dims-title">ç»´åº¦åæ</div>
          ${dims.map(d => `<div class="dim-row">
            <span class="dim-emoji">${d.emoji}</span>
            <span class="dim-label">${d.name}</span>
            <div class="dim-bar"><div class="dim-fill" style="width:${Math.min(d.score/d.max*100,100)}%;background:${d.gradient}"></div></div>
            <span class="dim-score">${Math.min(d.score,d.max)}/${d.max}</span>
          </div>`).join('')}
        </div>
        ${compatHTML ? `<div class="compat"><div class="compat-title">æä½³å¹éç±»å</div><div class="compat-list">${compatHTML}</div></div>` : ''}
        <div class="actions">
          <button class="btn btn-primary" id="shareBtn">å¤å¶ç»æææ¡</button>
          <button class="btn btn-secondary" id="retryBtn">ð éæ°æµè¯</button>
        </div>
        <div class="footer">å¿«å»å°çº¢ä¹¦åäº«ä½ çç»æå§ï¼ ð¸</div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `æçæç±äººæ ¼æ¯"${t.zh}" ${t.emoji}\nä½ çå¢ï¼æ¥æµè¯ä¸ä¸å§ï¼`;
      if (navigator.clipboard) { navigator.clipboard.writeText(txt); }
      const btn = s.getElementById('shareBtn');
      btn.textContent = 'å·²å¤å¶!';
      setTimeout(() => btn.textContent = 'å¤å¶ç»æææ¡', 2000);
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('love-quiz', LoveQuiz);
