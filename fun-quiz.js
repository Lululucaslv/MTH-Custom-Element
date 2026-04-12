/**
 * Fun Quiz (4D Personality) — Wix Custom Element
 * Huggy 精神状态鉴定 - Vanilla JS Web Component
 */
class FunQuiz extends HTMLElement {
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
    this.scores = [0,0,0,0]; // [H/C, D/S, N/M, E/I]
    this.resultCode = '';
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
      {zh:'你在社交场合中，通常是个什么样的人？',options:[{text:'兴奋得像只小狗，见人就要和他们成为朋友',scores:[2,2,0,2]},{text:'比较随和，看心情和对方',scores:[1,1,0,1]},{text:'冷静观察者，宁可躲在角落也不主动社交',scores:[0,0,0,0]}]},
      {zh:'晚上11点，你通常在做什么？',options:[{text:'还在嗨，刚准备开始夜生活',scores:[0,0,2,0]},{text:'可能还醒着，看看手机',scores:[0,0,1,0]},{text:'早就睡了，为了明早五点的瑜伽课',scores:[0,0,0,0]}]},
      {zh:'有人说你坏话了，你的反应是：',options:[{text:'当众吵起来，非要辩出个输赢不可',scores:[2,2,0,0]},{text:'有点生气，但决定先冷静一下再说',scores:[1,1,0,0]},{text:'呵呵，我本来就这样，随便吧',scores:[0,0,0,0]}]},
      {zh:'你最喜欢的工作环境是什么样的？',options:[{text:'团队合作，越多人一起做事越嗨',scores:[2,0,0,2]},{text:'有合作也有独立空间',scores:[1,0,0,1]},{text:'独立完成，越少打扰越好',scores:[0,0,0,0]}]},
      {zh:'你是那种会为了小事生气好几天的人吗？',options:[{text:'会啊！我就是个大戏精，小事能折腾一周',scores:[0,2,0,0]},{text:'有时候会，看情况',scores:[0,1,0,0]},{text:'不会，我早就放下了',scores:[0,0,0,0]}]},
      {zh:'早上起床对你来说有多困难？',options:[{text:'早起？根本做不到。我是夜猫子，七点前叫我起床等于谋杀',scores:[0,0,2,0]},{text:'可以接受，虽然有点困',scores:[0,0,1,0]},{text:'爱死了早起！新的一天，新的可能！',scores:[0,0,0,0]}]},
      {zh:'你在一段感情中通常是什么角色？',options:[{text:'我需要另一半24小时陪伴和确认，分开五分钟我就开始想念',scores:[0,0,0,2]},{text:'需要一定的陪伴，但也尊重对方的独立空间',scores:[0,0,0,1]},{text:'我很独立，有点粘人的对方会让我窒息',scores:[0,0,0,0]}]},
      {zh:'周末宅在家里，你会做什么？',options:[{text:'不行！我要出门嗨，在家会闷死！',scores:[2,0,0,0]},{text:'可能出门也可能在家，看心情',scores:[1,0,0,0]},{text:'完美！待在家里看剧、睡觉、养生',scores:[0,0,0,0]}]},
      {zh:'你是个容易哭的人吗？',options:[{text:'超容易！看个广告都能哭，我就是个感情用事的人',scores:[0,2,0,0]},{text:'有时候，在特定的情况下',scores:[0,1,0,0]},{text:'很少哭，基本控制住了',scores:[0,0,0,0]}]},
      {zh:'当压力大的时候，你的表现是：',options:[{text:'彻底崩溃，到处发泄情绪，需要别人来安慰我',scores:[2,2,0,2]},{text:'有点烦躁，但试着自己调节',scores:[1,1,0,1]},{text:'安定如常，什么能让我动摇',scores:[0,0,0,0]}]},
      {zh:'你和朋友的沟通频率是？',options:[{text:'每天都要聊，如果朋友不回我消息我就开始焦虑',scores:[0,0,0,2]},{text:'经常聊，但也不会太频繁',scores:[0,0,0,1]},{text:'偶尔聊，我们都很独立',scores:[0,0,0,0]}]},
      {zh:'你最讨厌什么类型的人？',options:[{text:'无聊的人！我讨厌没有热情的人',scores:[2,0,0,0]},{text:'太过分的人，不管哪个方向',scores:[1,0,0,0]},{text:'特别爱黏人和情绪过于复杂的人',scores:[0,0,0,0]}]},
      {zh:'你是个夜间工作效率高的人吗？',options:[{text:'当然！夜晚我才是真正的自己，越晚越有灵感',scores:[0,0,2,0]},{text:'还好，早晚都差不多',scores:[0,0,1,0]},{text:'不是，早上效率最高',scores:[0,0,0,0]}]},
      {zh:'一个人吃饭对你来说：',options:[{text:'很难受，我需要有人在身边',scores:[0,0,0,2]},{text:'还好吧，偶尔一个人也可䷥',scores:[0,0,0,1]},{text:'爽啊！一个人吃饭最自由',scores:[0,0,0,0]}]},
      {zh:'你对生活中的变化和冒险的态度是：',options:[{text:'超级兴奋！我热爱冒险和新的体验',scores:[2,0,0,0]},{text:'有点紧张，但愿意尝试',scores:[1,0,0,0]},{text:'我喜欢稳定的生活，变化太多会让我不适应',scores:[0,0,0,0]}]},
      {zh:'你会因为别人的情绪而影响自己的心情吗？',options:[{text:'会啊！我特别容易被带动，别人难受我也难受',scores:[0,2,0,2]},{text:'有点影响，但能调节',scores:[0,1,0,1]},{text:'不太会，我能保持理性',scores:[0,0,0,0]}]},
      {zh:'在爱好上，你是深度爱好者还是浅尝辄止？',options:[{text:'绝对的深度爱好者，一旦喜欢就废寝忘食',scores:[2,2,0,0]},{text:'介于两者之间',scores:[1,1,0,0]},{text:'浅尝辄止，我喜欢体验各种不同的东西',scores:[0,0,0,0]}]},
      {zh:'你做过最冲动的事情是什么？',options:[{text:'很多啊！我就是个冲动鬼，说做就做',scores:[2,0,0,0]},{text:'有过，但通常我会想清楚',scores:[1,0,0,0]},{text:'很少，我做事很谨慎',scores:[0,0,0,0]}]},
      {zh:'你对心理咨询的看法是：',options:[{text:'太好了！我需要经常倾诉和被倾听',scores:[0,0,0,2]},{text:'有需要的时候可以考虑',scores:[0,0,0,1]},{text:'我能自己处理，不太需要',scores:[0,0,0,0]}]},
      {zh:'最后，你觉得自己现在的精神状态是？',options:[{text:'有点emo，容易焦虑和不开心',scores:[0,2,2,0]},{text:'还好吧，有起有伏',scores:[0,1,1,0]},{text:'很不错！我很稳定和平静',scores:[0,0,0,0]}]},
    ];
  }

  get personalityTypes() {
    return {
      'HDNE':{zh:'深夜emo戏精',en:'Night Owl Drama Queen',desc:'白天装死晚上蹦迪的情绪过山车选手。你的人生就是一场舞台剧，需要观众和掌声。深夜才是你真正的舞台，此时你最有魅力和活力。但代价是情绪浮动很大，特别容易被小事影响。你的朋友需要24小时待命来陪伴你的各种大喜大悲。'},
      'HDME':{zh:'社交核弹',en:'Social Bomb',desc:'自带能量磁场的人，走到哪里都能燃起一团火。你戏多、声音大、热情高，但也很容易情绪化。无论白天黑夜，你都是生活的主角。朋友圈里的人都被你的戏剧性和热血吸引，虽然有时候你的强度有点"核弹级"。'},
      'HDNI':{zh:'午夜孤独者',en:'Midnight Loner',desc:'夜深人静时，你最能感受到自己。你热惉却容易受伤，喜欢深度陪伴但又想要独立。这种矛盾让你在午夜特别emo——既渴望有人陪，又害怕被靠近。你的戏剧性经常在深夜爆发，然后独自消化。'},
      'HDMI':{zh:'早起挑战者',en:'Early Bird Challenger',desc:'你是个矛盾体：渴望热血沸腾的生活，却又在早起时特别emo。你有早起的坚持和自律，但内心的戏精一直在吵闹。结果就是你白天强颜欢笑，晚上就开始掉眼泪。'},
      'HSNE':{zh:'冷漠深夜人',en:'Aloof Night Creature',desc:'你是个面无表情的深夜精怪。白天是个冷淡的灵魂，晚上也依然冷淡，但会多出一种诡异的魅力。你需要别人的陪伴却又不太会表达，导致别人常常搞不懂你的真实想法。'},
      'HSME':{zh:'精致早起人',en:'Refined Early Riser',desc:'你既热爱生活，又对自己要求极高。早起做精致的自己，白天保持冷静专业，但内心其实很有想法。你不太依赖别人，喜欢独立完成事情。'},
      'HSNI':{zh:'独立冷淡人',en:'Independent Stoic',desc:'你既热情又冷淡，这听起来很奇怪，但你确实就是这样。你有热情去做事情，但对人的态度很冷漠。你想要自己的空间，也给别人空间。这种独立的气质让你显得很神秘。'},
      'CDNE':{zh:'夜猫社交达人',en:'Night Owl Socialite',desc:'你是个有点懒但很会玩的人。白天可能没什么精神，但一到晚上就活过来了，而且特别粘人。你的社交欲很强，特别是在夜间。'},
      'CDME':{zh:'平衡生活者',en:'Life Balancer',desc:'你就是那种"没什么特别的"但其实很舒服的人。不特别亢奋也不特别冷漠，早晚都差不多，能接受一定的陪伴也能接受独处。你是个很好的朋友——不会太粘也不会太冷。'},
      'CDNI':{zh:'懒散独立者',en:'Lazy Independent',desc:'你是个很懒但很独立的人。既不会为了别人改变作息，也不会特别粘人。你有自己的节奏和空间，喜欢随意地生活。你的座右铭是："随便吧"。'},
      'HSMI':{zh:'早起懒人',en:'Morning Lazy Person',desc:'这是个有趣的组合：你习惯早起，但其実是个心理上很懒的人。你不想跟别人太紧密地联系，宁可独自享受清晨的安静。'},
      'CDMI':{zh:'佛系人士',en:'Buddhist Practitioner',desc:'你是个彻底的佛系人士。啥都行，啥都不在乎，跟着节奏走就完事了。你不会为小事生气，也不会特别兴奋。你的出现往往能让周围的人都冷静下来。'},
      'CSNE':{zh:'深夜emo佛',en:'Night Emo Sage',desc:'你很矛盾：白天很冷漠佛系，到了深夜就变成了emo的小可怜。你很粘人却又不想承认，经常在半夜发自拍说"我很好啦"，然后又开始掉眼泪。'},
      'CSME':{zh:'早起养生佛',en:'Early Bird Wellness Sage',desc:'六点起床泡枸杞的精神老干部。你有自己明确的生活计划，早起做瑜伽、喝养生茶。你很平静冷漠，但对自己很有要求。'},
      'CSNI':{zh:'孤独修行者',en:'Solitary Practitioner',desc:'你是个彻底的独行侠。冷漠、平静、独立，完全不需要别人。你的情绪很稳定，因为你很少对任何事情产生强烈的感受。'},
      'CSMI':{zh:'安定修士',en:'Serene Monk',desc:'你已经达到了"佛"的最高境界。既不需要别人的陪伴，也不需要刺激的生活。你有规律的作息，平静的心态，很少被外界打扰。你活得最自在。'},
    };
  }

  get dimLabels() {
    return [
      {left:'H (Hot)',leftEmoji:'🔥',right:'C (Cold)',rightEmoji:'❄️',name:'能量水平'},
      {left:'D (Drama)',leftEmoji:'🎭',right:'S (Stoic)',rightEmoji:'🧊',name:'情绪表达'},
      {left:'N (Night)',leftEmoji:'🌙',right:'M (Morning)',rightEmoji:'☀️',name:'生活节奏'},
      {left:'E (Emotional)',leftEmoji:'🫂',right:'I (Independent)',rightEmoji:'🗡️',name:'依赖程度'},
    ];
  }

  startQuiz() {
    this.scores = [0,0,0,0];
    this.currentQuestion = 0;
    this.screen = 'quiz';
    this.render();
  }

  handleAnswer(optIdx) {
    const q = this.questions[this.currentQuestion];
    const s = q.options[optIdx].scores;
    for (let i = 0; i < 4; i++) this.scores[i] += s[i];
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.render();
    } else {
      this.calculateResult();
    }
  }

  calculateResult() {
    const code =
      (this.scores[0] > 10 ? 'H' : 'C') +
      (this.scores[1] > 10 ? 'D' : 'S') +
      (this.scores[2] > 10 ? 'N' : 'M') +
      (this.scores[3] > 10 ? 'E' : 'I');
    this.resultCode = code;
    this.screen = 'result';
    this.render();
    this.dispatchEvent(new CustomEvent('quizComplete', {
      detail: { type: code, scores: [...this.scores] }, bubbles: true
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
        .wrap{min-height:100vh;background:linear-gradient(135deg,#eef2ff 0%,#eef2ff 50%,#fdf2f8 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;}
        .emoji{font-size:3rem;margin-bottom:16px;}
        .title{font-size:2.25rem;font-weight:800;background:linear-gradient(135deg,#6366f1,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;}
        .sub{font-size:1.125rem;color:#64748b;margin-bottom:32px;}
        .dims{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:400px;margin-bottom:32px;}
        .dim-card{background:#fff;border-radius:12px;padding:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);font-size:0.9rem;color:#475569;}
        .dim-vs{font-weight:700;color:#6366f1;}
        .start-btn{background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;font-weight:700;font-size:1rem;padding:14px 36px;border:none;border-radius:12px;cursor:pointer;transition:transform .2s;}
        .start-btn:hover{transform:scale(1.05);}
        .back-link{margin-top:16px;color:#94a3b8;font-size:0.875rem;cursor:pointer;border:none;background:none;}
      </style>
      <div class="wrap">
        <div class="emoji">✨</div>
        <div class="title">Huggy 精神状态鉴定</div>
        <div class="sub">正经人谁做MBTI啊？</div>
        <div class="dims">
          ${this.dimLabels.map(d => `<div class="dim-card">${d.leftEmoji} <span class="dim-vs">${d.left}</span> vs ${d.rightEmoji} ${d.right}</div>`).join('')}
        </div>
        <button class="start-btn" id="startBtn">开始测试</button>
        <button class="back-link" id="backBtn">&larr; 返回</button>
      </div>`;
    s.getElementById('startBtn').onclick = () => this.startQuiz();
    s.getElementById('backBtn').onclick = () => this.dispatchEvent(new CustomEvent('goBack',{bubbles:true}));
  }

  renderQuiz(s) {
    const q = this.questions[this.currentQuestion];
    const pct = (this.currentQuestion / this.questions.length) * 100;
    s.innerHTML = `
      <style>${this.baseCSS()}
        .wrap{min-height:100vh;background:linear-gradient(135deg,#eef2ff 0%,#eef2ff 50%,#fdf2f8 100%);display:flex;flex-direction:column;}
        .header{position:sticky;top:0;background:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);z-index:10;}
        .back{background:none;border:none;cursor:pointer;color:#6366f1;font-size:1.2rem;}
        .counter{font-size:0.85rem;color:#64748b;}
        .pbar{flex:1;height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden;}
        .pfill{height:100%;background:linear-gradient(90deg,#6366f1,#ec4899);border-radius:99px;transition:width 0.4s;}
        .body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px;max-width:640px;margin:0 auto;width:100%;}
        .qnum{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;font-weight:800;font-size:1.1rem;margin-bottom:20px;}
        .qtxt{font-size:1.25rem;font-weight:700;color:#1e293b;text-align:center;margin-bottom:32px;line-height:1.6;}
        .opts{display:flex;flex-direction:column;gap:12px;width:100%;}
        .opt{display:flex;align-items:center;gap:12px;width:100%;padding:16px;background:#fff;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;text-align:left;font-size:0.95rem;color:#1e293b;transition:all .2s;}
        .opt:hover{border-color:#818cf8;background:#eef2ff;transform:scale(1.02);}
        .opt-label{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;}
      </style>
      <div class="wrap">
        <div class="header">
          <button class="back" id="qBack">&larr;</button>
          <span class="counter">${this.currentQuestion+1} / ${this.questions.length}</span>
          <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
        </div>
        <div class="body">
          <div class="qnum">Q${this.currentQuestion+1}</div>
          <div class="qtxt">${q.zh}</div>
          <div class="opts">
            ${q.options.map((o,i) => `<button class="opt" data-idx="${i}"><span class="opt-label">${String.fromCharCode(65+i)}</span>${o.text}</button>`).join('')}
          </div>
        </div>
      </div>`;
    s.getElementById('qBack').onclick = () => { this.screen='start'; this.render(); };
    s.querySelectorAll('.opt').forEach(btn => {
      btn.onclick = () => this.handleAnswer(parseInt(btn.dataset.idx));
    });
  }

  renderResult(s) {
    const t = this.personalityTypes[this.resultCode] || this.personalityTypes['CDME'];
    const maxScore = 40;
    const dimBars = this.dimLabels.map((d,i) => {
      const pct = Math.round((this.scores[i] / maxScore) * 100);
      return `<div class="dim-row">
        <div class="dim-name">${d.name}</div>
        <div class="dim-bar-wrap">
          <span class="dim-side">${d.leftEmoji} ${d.left}</span>
          <div class="dim-bar"><div class="dim-fill-l" style="width:${pct}%"></div></div>
          <div class="dim-bar"><div class="dim-fill-r" style="width:${100-pct}%"></div></div>
          <span class="dim-side">${d.rightEmoji} ${d.right}</span>
        </div>
      </div>`;
    }).join('');

    s.innerHTML = `
      <style>${this.baseCSS()}
        .wrap{min-height:100vh;background:linear-gradient(135deg,#eef2ff 0%,#eef2ff 50%,#fdf2f8 100%);padding:24px;}
        .header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
        .back{background:none;border:none;cursor:pointer;color:#6366f1;font-size:1.2rem;}
        .htitle{font-weight:600;color:#1e293b;}
        .result-card{background:linear-gradient(135deg,#6366f1,#ec4899);border-radius:24px;padding:32px;text-align:center;color:#fff;margin-bottom:24px;box-shadow:0 8px 32px rgba(99,102,241,0.3);}
        .rcode{font-size:3rem;font-weight:900;letter-spacing:4px;margin-bottom:4px;}
        .rname{font-size:1.5rem;font-weight:700;margin-bottom:16px;}
        .rdesc{background:rgba(255,255,255,0.15);border-radius:12px;padding:16px;font-size:0.9rem;line-height:1.7;text-align:left;}
        .dims-section{background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:24px;}
        .dims-title{font-weight:700;color:#1e293b;margin-bottom:16px;font-size:1.1rem;}
        .dim-row{margin-bottom:16px;}
        .dim-name{font-size:0.85rem;color:#64748b;margin-bottom:6px;font-weight:600;}
        .dim-bar-wrap{display:flex;align-items:center;gap:8px;}
        .dim-side{font-size:0.7rem;color:#94a3b8;white-space:nowrap;min-width:80px;}
        .dim-side:last-child{text-align:right;}
        .dim-bar{flex:1;height:12px;background:#e2e8f0;border-radius:99px;overflow:hidden;}
        .dim-fill-l{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);border-radius:99px;}
        .dim-fill-r{height:100%;background:linear-gradient(90deg,#f472b6,#ec4899);border-radius:99px;float:right;}
        .actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .btn{padding:12px 24px;border-radius:12px;font-weight:600;font-size:0.9rem;cursor:pointer;border:none;transition:transform .2s;}
        .btn:hover{transform:scale(1.05);}
        .btn-primary{background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;}
        .btn-secondary{background:#fff;color:#6366f1;border:2px solid #6366f1;}
      </style>
      <div class="wrap">
        <div class="header">
          <button class="back" id="rBack">&larr;</button>
          <span class="htitle">你的类型</span>
          <div></div>
        </div>
        <div class="result-card">
          <div class="rcode">${this.resultCode}</div>
          <div class="rname">${t.zh}</div>
          <div class="rdesc">${t.desc}</div>
        </div>
        <div class="dims-section">
          <div class="dims-title">四维分析</div>
          ${dimBars}
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="shareBtn">分享结果</button>
          <button class="btn btn-secondary" id="retryBtn">重新测试</button>
        </div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `我是Huggy精神状态鉴定中的${t.zh}（${this.resultCode}）！`;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      if (navigator.share) navigator.share({title:'Huggy精神状态鉴定',text:txt});
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('fun-quiz', FunQuiz);
