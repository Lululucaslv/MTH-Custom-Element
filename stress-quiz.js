/**
 * Stress Quiz â Wix Custom Element
 * ååæªå½æµè¯ - Vanilla JS Web Component
 */
class StressQuiz extends HTMLElement {
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
    this.scores = {stressResponse:0, energyDirection:0, copingStructure:0};
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
      {zh:'ä½ çdeadlineè¿æ3å°æ¶ä½ä½ åæå¼ææ¡£...',options:[{text:'æå¼ å°èµ·å¿«å',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'åä¼æ¯ä¸ä¸å·éä¸æ¥',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'ç«å»å¶å®è®¡åé«æå®æ',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'å®¤ååäºè®©ä½ å¾ä¸ç½çäº...',options:[{text:'ç´æ¥åä»ä»¬å¯´è´¨',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'ä¿ææ²é»å¹¶èº«é¿ä»ä»¬',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'ä¹åå¹³éå°è°è®º',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'ä½ å¨å·¥ä½ä¸­ç¯äºä¸ªéè¯¯ï¼èæ¿æ³¨æå°äº...',options:[{text:'ç«å»è§£éå¹¶æ¹æ­£',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'æå°ç¾è¾±å¹¶éç¼©',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'å¾æ²®ä¸§ä½éèèµ·æ¥',scores:{stressResponse:0,energyDirection:0,copingStructure:1}}]},
      {zh:'æåå¨æåä¸å»åæ¶äºè®¡å...',options:[{text:'æå°åä¼¤å¹¶åæ¶æ¯ç»ä»ä»¬',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'æç»ªå³é­',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'ç«å»å¶å®æ¿ä»£è®¡å',scores:{stressResponse:1,energyDirection:1,copingStructure:0}}]},
      {zh:'ä½ å¨æ¥æ¤æ··ä¹±çæåµä¸æå°åå...',options:[{text:'åæå¹¶å®æä»»å¡',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'æ¾ä¸ªå®éçå°æ¹éç¦»',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'æç¹å¤±æ§',scores:{stressResponse:0,energyDirection:1,copingStructure:1}}]},
      {zh:'æäººå¨å¬ä¼é¢åæ¹è¯ä½ ...',options:[{text:'ç«å³åå»',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'æå°åä¼¤ä½ä»ä¹é½ä¸è¯´',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'ä¹åæç­ç¥å°ååº',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'ä½ æå¤ä¸ªä»»å¡è¦åæ¶å®æ...',options:[{text:'å¾æå¼ å°å°å¤è·³',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'æå»¶å¹¶å¸æä¸åé¡ºå©',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'ä¼åçº§æåºå¹¶ææ¡ä¸ç´å°æ§è¡',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'ä½ å¨ä¸ä¸ªé®é¢ä¸å¡äºå¥½å ä¸ªå°æ¶...',options:[{text:'ç»§ç»­æ¿è¿å°å¼ºè¡è§£å³',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'æ¾å¼å¹¶æ¶å¤±',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'å·éå°åéå¹¶éæ°ç­å',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'ä½ æè¯å°å¿è®°äºéè¦çäº...',options:[{text:'é·å¥è´é¢èºæå¹¶ä¸¥åèªè´£',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'å¾ç¦èºä½å¾å¿«ç»§ç»­',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'åå»ºç³»ç»ä»¥é²æ­¢åæ¬¡åç',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'ä½ ä¿¡ä»»çäººè®©ä½ å¤±æäº...',options:[{text:'æ¤æå°çå',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'ç«èµ·é²å¢å¹¶å­¤ç«èªå·±',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'å·éå°åæåªéåºéäº',scores:{stressResponse:1,energyDirection:0,copingStructure:0}}]},
      {zh:'ä½ è¢«ææå¨èªå·±ä¸æé¿çäºä¸å®ç¾...',options:[{text:'åªåè¯æèªå·±',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'å¨å¼å§åå°±æå°å¤±è´¥',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'è¿å¥è¶éæ¨¡å¼',scores:{stressResponse:0,energyDirection:1,copingStructure:1}}]},
      {zh:'ææäºæé½åæ¶åºé...',options:[{text:'å¤±æ§å¹¶å¤§å«',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'å®å¨å³é­',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'åéä¸æ­¥å¹¶å¼å¸',scores:{stressResponse:1,energyDirection:0,copingStructure:0}}]},
    ];
  }

  get monsterTypes() {
    return {
      'rampaging-dragon':{zh:'ð¥ æ´èµ°é¾',emoji:'ð¥',gradient:'linear-gradient(135deg,#dc2626,#ea580c)',desc:'ååä¸æ¥ç´æ¥åå°çåçç è§è²ãæ æçæ§ï¼å®å¨æ··ä¹±ã',skills:['çç¸æ§è½ééæ¾','éè¿æ··ä¹±ç«å³è§£å³é®é¢','é¶ç¦è±ç§¯ç´¯'],tips:['å°è½éå¼å¯¼å°èº«ä½æ´»å¨ï¼è·æ­¥ãæ³å»ãè·³èï¼','å¨ååºåç»ä¹ 5ç§éçæå','ä½¿ç¨å¼ºççææ°§è¿å¨æ¥æ¶èè¿éçè¾ä¸è¹ç´ ']},
      'shell-turtle':{zh:'ð¢ ç¼©å£³é¾',emoji:'ð¢',gradient:'linear-gradient(135deg,#15803d,#0f766e)',desc:'é»é»æèªå·±å³èµ·æ¥æ¶åä¸åçéå¿çãæ²é»ãåé§ãç¥ç§ã',skills:['å®ç¾çæç»ªç®¡ç','æ·±å±åé¨å¤ç','é¶æå§æ§'],tips:['ææè¯å°ä¸ä¿¡ä»»çäººåäº«ä½ çæå','æ¯å¤©åæ¥è®°ä»¥å¤ååé¨æ³æ³','è®¾å®å®æçèªæ£æ¶é´ä»¥å¤§å£°å¤çæç»ª']},
      'silent-volcano':{zh:'ð æ²é»ç«å±±',emoji:'ð',gradient:'linear-gradient(135deg,#334155,#7f1d1d)',desc:'è¡¨é¢é£å¹³æµªéï¼åå¿å²©æµç¿»æ¶ãä½ æä¸ååæå°çåã',skills:['æ å½¢ååç§¯ç´¯','çªç¶æå¤éæ¾','å°è±¡æ·±å»çå®¹å¿åº¦'],tips:['éè¿å¥æ³æå¼å¸ç»ä¹ å®æéæ¾åå','å°½æ«è¯å«ååè­¦åä¿¡å·å¹¶è§£å³','å¨å°æ²®ä¸ªåæå¤§æ²®ä¸ªä¹åè®¨è®ºå®ä»¬']},
      'escape-eagle':{zh:'ð¦ éè·é¹°',emoji:'ð¦',gradient:'linear-gradient(135deg,#2563eb,#0891b2)',desc:'è·å¾å¿«è¿è·å¾æè®¡åçæç¥æ¤éä¸å®¶ãæé£åº¦å°éç¦»ã',skills:['æç¥æ§éç¦»è®¡å','å¯»æ¾æ¿ä»£è·¯çº¿','ä¼éçé¿å'],tips:['ç»ä¹ ç´é¢å°é®é¢èä¸æ¯åé¿','æå»º"é®é¢è§£å³å·¥å·å"ä½¿å¯¹ææè§ä¸é£ä¹å¯æ','å®æå®æåææ¶é´ï¼æèä½ å¨é¿åä»ä¹']},
      'iron-warrior':{zh:'âï¸ éè¡æå£«',emoji:'âï¸',gradient:'linear-gradient(135deg,#374151,#0f172a)',desc:'ææ¡çå°æ´èµ°çæçåéæãç¨å·è¡çæçå¯¹ä»ååã',skills:['ååä¸çææ¡ä¸ç´çæ§è¡','æç¥æ§ä¾µç¥','é¶æµè´¹çå¨ä½'],tips:['è®°ä½ä¸æ¯ææä¸è¥¿é½éè¦æææ¨¡å¼','å¨æ²¡æååæ¶ç»ä¹ æ¾æ¾æå·§','åå¯¹å¾å·¥ä½ä¸æ ·è®¤çå°å°ä¼æ¯æ¶é´çº³å¥æ¥ç¨']},
      'melting-slime':{zh:'ð«  èåå²è±å§',emoji:'ð« ',gradient:'linear-gradient(135deg,#ec4899,#4f46e5)',desc:'ååæ¥äºç´æ¥åæä¸æ»©ãä½ å¤±å»äºå½¢ç¶ï¼åªè½èåã',skills:['æå¤§éåºæ§','æææµå¨æ§','é¶å¯¹ååçæµæå'],tips:['åå»ºç»æï¼åè¡¨ãæ¥å¸¸åæ¥ç¨å¸®å©ä½ åè','ç»ä¹ æ¥å°ç»ä¹ ï¼5-4-3-2-1æå®æå·§ï¼','å°é®é¢åè§£æå°çãå¯ç®¡ççé¨å']},
      'iceberg-assassin':{zh:'ð§ å°å±±åºå®¢',emoji:'ð§',gradient:'linear-gradient(135deg,#60a5fa,#6366f1)',desc:'å·éç²¾åå°è§£å³é®é¢ä½åå¿å·²ç»ç¸äºãå°éªå¥³çæ°è´¨ã',skills:['ææ¯å¼é®é¢è§£å³','æ å½¢ççè¦','ååä¸çè´å½ç²¾å'],tips:['åè®¸èªå·±æåæç»ªèä¸å¤æ­å®ä»¬','æ¾å°ä¸ä¸ªå®å¨çå°æ¹å®æè¡¨è¾¾ä½ çåé¨æ··ä¹±','è®°ä½ï¼è½åâ æ æãä½ å¯ä»¥å¯»æ±å¸®å©ã']},
      'chaos-tornado':{zh:'ðªï¸ æ··ä¹±é¾å·é£',emoji:'ðªï¸',gradient:'linear-gradient(135deg,#facc15,#f97316)',desc:'è¾¹éè¾¹ç¸çè¡ä¸ºèºæ¯å®¶ãåå¤å¥éåæ¶çåã',skills:['å¤åè½éè¾åº','èªåéåº','æé«ä¸å¯é¢æµæ§'],tips:['ååæ¶ä¸æ¬¡åªå³æ³¨ä¸ä»¶äº','å¨è¡å¨åä½¿ç¨"åæ­¢ãå¼å¸ãä¼åçº§"åè¯­','åå»ºä¸ä¸ªå¯ä»¥å¸®å©ä½ éä¸­æ³¨æåçé­è´£ä¼ä¼´']},
    };
  }

  startQuiz() {
    this.scores = {stressResponse:0, energyDirection:0, copingStructure:0};
    this.currentQuestion = 0;
    this.screen = 'quiz';
    this.render();
  }

  handleAnswer(idx) {
    const q = this.questions[this.currentQuestion];
    const sc = q.options[idx].scores;
    this.scores.stressResponse += sc.stressResponse;
    this.scores.energyDirection += sc.energyDirection;
    this.scores.copingStructure += sc.copingStructure;
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.render();
    } else {
      this.calculateResult();
    }
  }

  calculateResult() {
    const sr = this.scores.stressResponse;
    const ed = this.scores.energyDirection;
    const cs = this.scores.copingStructure;
    const total = this.questions.length;
    const fight = sr < total/2;
    const explode = ed >= total/2;
    const order = cs >= total/2;

    let id;
    if (fight && explode && !order) id = 'rampaging-dragon';
    else if (!fight && !explode && order) id = 'shell-turtle';
    else if (fight && !explode && !order) id = 'silent-volcano';
    else if (!fight && explode && order) id = 'escape-eagle';
    else if (fight && explode && order) id = 'iron-warrior';
    else if (!fight && !explode && !order) id = 'melting-slime';
    else if (fight && !explode && order) id = 'iceberg-assassin';
    else if (!fight && explode && !order) id = 'chaos-tornado';
    else id = 'rampaging-dragon';

    this.resultId = id;
    this.screen = 'result';
    this.render();
    this.dispatchEvent(new CustomEvent('quizComplete', {
      detail: { type: id, scores: {...this.scores} }, bubbles: true
    }));
  }

  render() {
    const s = this.shadowRoot;
    if (this.screen === 'start') this.renderStart(s);
    else if (this.screen === 'quiz') this.renderQuiz(s);
    else this.renderResult(s);
  }

  renderStart(s) {
    s.innerHTML = `
      <style>${this.baseCSS()}
        .wrap{min-height:100vh;background:linear-gradient(180deg,#0f172a,#312e81,#0f172a);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;color:#fff;}
        .emojis{font-size:2.5rem;margin-bottom:20px;display:flex;gap:12px;justify-content:center;}
        .title{font-size:2.25rem;font-weight:800;margin-bottom:8px;}
        .sub{font-size:1.1rem;color:#c7d2fe;margin-bottom:32px;}
        .info{background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:20px;max-width:480px;color:#c7d2fe;font-size:0.9rem;line-height:1.7;margin-bottom:12px;}
        .meta{font-size:0.8rem;color:#818cf8;margin-bottom:32px;}
        .start-btn{background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;font-weight:700;font-size:1rem;padding:14px 36px;border:none;border-radius:12px;cursor:pointer;transition:transform .2s;}
        .start-btn:hover{transform:scale(1.05);}
        .back-link{margin-top:16px;color:#818cf8;font-size:0.875rem;cursor:pointer;border:none;background:none;}
      </style>
      <div class="wrap">
        <div class="emojis">ð¥ ð¢ ð âï¸</div>
        <div class="title">ä½ ä½åä½çä»ä¹å°æªå½ï¼</div>
        <div class="sub">åç°ä½ çååçç©</div>
        <div class="info">æ¯ä¸ªäººé¢å¯¹ååé½æä¸åçååºæ¹å¼ãéè¿12éææ¯é¢ï¼åç°ä½ åå¿çååæªå½æ¯ä»ä¹ç±»åï¼</div>
        <div class="meta">12é¢ Â· 2-3åé Â· æè¶£ä¸åå¾ç¦»è°±</div>
        <button class="start-btn" id="startBtn">å¼å§æµè¯</button>
        <button class="back-link" id="backBtn">&larr; è¿å</button>
      </div>`;
    s.getElementById('startBtn').onclick = () => this.startQuiz();
    s.getElementById('backBtn').onclick = () => this.dispatchEvent(new CustomEvent('goBack',{bubbles:true}));
  }

  renderQuiz(s) {
    const q = this.questions[this.currentQuestion];
    const pct = (this.currentQuestion / this.questions.length) * 100;
    s.innerHTML = `
      <style>${this.baseCSS()}
        .wrap{min-height:100vh;background:linear-gradient(180deg,#0f172a,#312e81,#0f172a);display:flex;flex-direction:column;color:#fff;}
        .header{position:sticky;top:0;background:rgba(15,23,42,0.95);backdrop-filter:blur(8px);padding:16px 20px;display:flex;align-items:center;gap:12px;z-index:10;}
        .back{background:none;border:none;cursor:pointer;color:#818cf8;font-size:1.2rem;}
        .counter{font-size:0.85rem;color:#a5b4fc;}
        .pbar{flex:1;height:8px;background:rgba(99,102,241,0.2);border-radius:99px;overflow:hidden;}
        .pfill{height:100%;background:linear-gradient(90deg,#6366f1,#ec4899);border-radius:99px;transition:width .4s;}
        .body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px;max-width:640px;margin:0 auto;width:100%;}
        .qtxt{font-size:1.25rem;font-weight:700;text-align:center;margin-bottom:32px;line-height:1.6;color:#e0e7ff;}
        .opts{display:flex;flex-direction:column;gap:12px;width:100%;}
        .opt{display:flex;align-items:center;gap:12px;width:100%;padding:16px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;cursor:pointer;text-align:left;font-size:0.95rem;color:#e0e7ff;transition:all .2s;}
        .opt:hover{background:rgba(99,102,241,0.25);border-color:rgba(236,72,153,0.5);transform:scale(1.02);}
        .opt-letter{width:28px;height:28px;border-radius:50%;background:rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;color:#a5b4fc;}
      </style>
      <div class="wrap">
        <div class="header">
          <button class="back" id="qBack">&larr;</button>
          <span class="counter">${this.currentQuestion+1}/${this.questions.length}</span>
          <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
        </div>
        <div class="body">
          <div class="qtxt">${q.zh}</div>
          <div class="opts">
            ${q.options.map((o,i) => `<button class="opt" data-idx="${i}"><span class="opt-letter">${String.fromCharCode(65+i)}</span>${o.text}</button>`).join('')}
          </div>
        </div>
      </div>`;
    s.getElementById('qBack').onclick = () => { this.screen='start'; this.render(); };
    s.querySelectorAll('.opt').forEach(btn => {
      btn.onclick = () => this.handleAnswer(parseInt(btn.dataset.idx));
    });
  }

  renderResult(s) {
    const m = this.monsterTypes[this.resultId];
    const total = this.questions.length;
    const dims = [
      {name:'ååååº',left:'Fight',right:'Flight',pct:Math.round((1-this.scores.stressResponse/total)*100)},
      {name:'è½éæ¹å',left:'Implode',right:'Explode',pct:Math.round(this.scores.energyDirection/total*100)},
      {name:'åºå¯¹ç»æ',left:'Chaos',right:'Order',pct:Math.round(this.scores.copingStructure/total*100)},
    ];

    s.innerHTML = `
      <style>${this.baseCSS()}
        .wrap{min-height:100vh;background:linear-gradient(180deg,#0f172a,#312e81,#0f172a);padding:24px;color:#fff;}
        .header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
        .back{background:none;border:none;cursor:pointer;color:#a5b4fc;font-size:1.2rem;}
        .htitle{color:#e0e7ff;font-weight:600;}
        .monster-card{border-radius:24px;padding:32px;text-align:center;color:#fff;margin-bottom:24px;box-shadow:0 8px 32px rgba(0,0,0,0.3);position:relative;overflow:hidden;}
        .memoji{font-size:5rem;margin-bottom:12px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3));}
        .mname{font-size:1.75rem;font-weight:800;margin-bottom:8px;}
        .mdesc{font-size:0.95rem;line-height:1.7;opacity:0.95;}
        .details{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;}
        @media(max-width:500px){.details{grid-template-columns:1fr;}}
        .detail-card{background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:20px;}
        .detail-title{font-weight:700;font-size:0.95rem;margin-bottom:12px;display:flex;align-items:center;gap:6px;}
        .detail-list{list-style:none;padding:0;}
        .detail-list li{font-size:0.85rem;color:#c7d2fe;padding:4px 0;line-height:1.5;}
        .detail-list li::before{content:'';margin-right:8px;}
        .skills-list li::before{content:'â¦';}
        .tips-list li::before{content:'â';}
        .dims-section{background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:20px;margin-bottom:24px;}
        .dims-title{font-weight:700;margin-bottom:16px;}
        .dim-row{margin-bottom:14px;}
        .dim-label{display:flex;justify-content:space-between;font-size:0.8rem;color:#a5b4fc;margin-bottom:4px;}
        .dim-bar{height:10px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;}
        .dim-fill{height:100%;background:linear-gradient(90deg,#6366f1,#ec4899);border-radius:99px;transition:width .6s;}
        .actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .btn{padding:12px 24px;border-radius:12px;font-weight:600;font-size:0.9rem;cursor:pointer;border:none;transition:transform .2s;}
        .btn:hover{transform:scale(1.05);}
        .btn-share{background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;}
        .btn-retry{background:linear-gradient(135deg,#ec4899,#f43f5e);color:#fff;}
      </style>
      <div class="wrap">
        <div class="header">
          <button class="back" id="rBack">&larr;</button>
          <span class="htitle">ä½ çååæªå½</span>
          <div></div>
        </div>
        <div class="monster-card" style="background:${m.gradient}">
          <div class="memoji">${m.emoji}</div>
          <div class="mname">${m.zh}</div>
          <div class="mdesc">${m.desc}</div>
        </div>
        <div class="details">
          <div class="detail-card">
            <div class="detail-title">â¡ æªå½æè½</div>
            <ul class="detail-list skills-list">${m.skills.map(sk => `<li>${sk}</li>`).join('')}</ul>
          </div>
          <div class="detail-card">
            <div class="detail-title">ð¯ é©¯ææå</div>
            <ul class="detail-list tips-list">${m.tips.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="dims-section">
          <div class="dims-title">ä¸ç»´åæ</div>
          ${dims.map(d => `<div class="dim-row">
            <div class="dim-label"><span>${d.left}</span><span>${d.name}</span><span>${d.right}</span></div>
            <div class="dim-bar"><div class="dim-fill" style="width:${d.pct}%"></div></div>
          </div>`).join('')}
        </div>
        <div class="actions">
          <button class="btn btn-share" id="shareBtn">åäº«ç»æ</button>
          <button class="btn btn-retry" id="retryBtn">åè¯ä¸æ¬¡</button>
        </div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `æçååæªå½æ¯${m.zh}ï¼ä½ çå¢ï¼`;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      if (navigator.share) navigator.share({title:'ååæªå½æµè¯',text:txt});
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('stress-quiz', StressQuiz);
