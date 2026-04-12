/**
 * Stress Quiz — Wix Custom Element
 * 压力怪兽测试 - Vanilla JS Web Component
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
      {zh:'你的deadline还有3小时但你刚打开文档...',options:[{text:'慌张地赶快做',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'先休息一下冷静下来',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'立刻制定计划高效完成',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'室友做了让你很不爽的事...',options:[{text:'直接和他们对质',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'保持沉默并躲避他们',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'之后平静地谈论',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'你在工作中犯了个错误，老板注意到了...',options:[{text:'立刻解释并改正',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'感到羞辱并退缩',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'很沮丧但隐藏起来',scores:{stressResponse:0,energyDirection:0,copingStructure:1}}]},
      {zh:'朋友在最后一刻取消了计划...',options:[{text:'感到受伤并发消息给他们',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'情绪关闭',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'立刻制定替代b��皋',scores:{stressResponse:1,energyDirection:1,copingStructure:0}}]},
      {zh:'你在拥挤混乱的情况下感到压力...',options:[{text:'坚持并完成任务',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'找个安静的地方逃离',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'有点失控',scores:{stressResponse:0,energyDirection:1,copingStructure:1}}]},
      {zh:'有人在公众面前批评你...',options:[{text:'立即反击',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'感到受伤但什么都不说',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'之后有策略地回应',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'你有多个任务要同时完成...',options:[{text:'很慌张地到处跳',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'拖延并希望一切顺利',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'优先级排序并有条不紊地执行',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'你在一个问题上卡了好几个小时...',options:[{text:'继续激进地强行解决',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'放弃并消失',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'冷静地后退并重新策划',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'你意识到忘记了重要的事...',options:[{text:'陷入负面螺旋并严厉自责',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'很烦躁但很快继续',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'创建瞮统以防止再次发生',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'你信任的人让你失望了...',options:[{text:'愤怒地爆发',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'站起防墙并孤立自己',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'冷静地分析哪里出错了',scores:{stressResponse:1,energyDirection:0,copingStructure:0}}]},
      {zh:'你被期望在自己不擅长的事上完美...',options:[{text:'努力证明自己',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'在开始前就感到失败',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'进入超速模式',scores:{stressResponse:0,energyDirection:1,copingStructure:1}}]},
      {zh:'所有事情都同时出错...',options:[{text:'失控并大叫',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'完全关闭',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'后退一步并呼吸',scores:{stressResponse:1,energyDirection:0,copingStructure:0}}]},
    ];
  }

  get monsterTypes() {
    return {
      'rampaging-dragon':{zh:'🔥 暴走龙',emoji:'🔥',gradient:'linear-gradient(135deg,#dc2626,#ea580c)',desc:'压力一来直接原地爆炸的狠角色。无所畏惧，完全混乱。',skills:['爆炸性能量释放','通过混乱立即解决问题','零焦虪秉累'],tips:['将能量引导到身体活动（跑步、拳击、跳舞）','在反应前练习5秒钟的暂停','使用强烈的有氧运动来消耗过量的肾上腺素']},
      'shell-turtle':{zh:'🐢 缩壳龟',emoji:'🐢',gradient:'linear-gradient(135deg,#15803d,#0f766e)',desc:'默默把自己关起来消化一切的隐忍王。沉默、坚韧、神秘。',skills:['完美的情绪管理','深层内部处理','零戏剧性'],tips:['有意识地与信任的人分享你的感受','每天写日记以外化内部想法','设定定期的自检时间以大声处理情绪']},
      'silent-volcano':{zh:'🌋 沉默火山',emoji:'🌋',gradient:'linear-gradient(135deg,#334155,#7f1d1d)',desc:'表面风平浪静，内心岩浇叠涌。你把一切压抑到爆发。',skills:['无形压力积累','突然意外释放','印象深刻的容忍座'],tips:['通过冥想或呼吸练习定期释放压力','尽早识别压力警告信号并解决','在小沮个变成大沮个之前讨论它们']},
      'escape-eagle':{zh:'🦅 逃跑鹰',emoji:'🦅',gradient:'linear-gradient(135deg,#2563eb,#0891b2)',desc:'跑得快还跑得有计划的战略撤退专家。有风度地逃离。',skills:['战略性逃离计划','寻找替代路线','优雅的避免'],tips:['练习直面小问题而不是回避','构建"问题解决工具包"使对抗感觉不那么可怕','安排定期反思时间，思考你在避免什么']},
      'iron-warrior':{zh:'⚔️ 铁血战士',emoji:'⚔️',gradient:'linear-gradient(135deg,#374151,#0f172a)',desc:'有条理地暴走的效率型选手。用冷血的效率对付压力。',skills:['压力下的有条不紊的执行','战略性侵略','零�r费的动作'],tips:['记住不是所有东西都需要战斗模式','在没有压力时练习放松技巧','像对塅工作一样认真地将休息时间纳入日程']},
      'melting-slime':{zh:'🫠 融化史莱姆',emoji:'🫠',gradient:'linear-gradient(135deg,#ec4899,#4f46e5)',desc:'压力来了直接变成一滩。你失去了形状，只能融化。',skills:['最大适应性','情感流动性','零对变化的抵抗力'],tips:['创建结构：列表、日常和日程帮助你凝聚','练习接地练习（5-4-3-2-1感官技巧）','将问题分解成小的、可管理的部分']},
      'iceberg-assassin':{zh:'🧊 冰山刺客',emoji:'🧊',gradient:'linear-gradient(135deg,#60a5fa,#6366f1)',desc:'冷静精准地解决问题但内心已经炸了。冰雪女王气质。',skills:['手术式问题解决','无形的痛苦','压力下的致命精准'],tips:['允许自己感受情绪而不判断它们','找到一个安全的地方定期表达你的内部混乱','记住：能力≠无敌。你可以寻求帮助。']},
      'chaos-tornado':{zh:'🌪️ 混乱龙卷风',emoji:'🌪️',gradient:'linear-gradient(135deg,#facc15,#f97316)',desc:'边逃边炸的行为艺术家。四处奔逃同时爆炸。',skills:['多向能量输出','自发适应','最高不可预测性'],tips:['压力时一次只关注一件事','在行动前使用"停止、呼吸、优先级"咒语','创建一个可以帮助你集中注意力的问责伙伴']},
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
        <div class="emojis">🔥 🐢 🌋 ⚔️</div>
        <div class="title">你体内住着什么小怪兽？</div>
        <div class="sub">发现你的压力生物</div>
        <div class="info">每个人面对压力都有不同的反应方式。通过12道情景题，发现你内心的压力怪兽是什么类型！</div>
        <div class="meta">12题 · 2-3分钟 · 有趣且准得离谱</div>
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
      {name:'压力反应',left:'Fight',right:'Flight',pct:Math.round((1-this.scores.stressResponse/total)*100)},
      {name:'能量方向',left:'Implode',right:'Explode',pct:Math.round(this.scores.energyDirection/total*100)},
      {name:'应对结构',left:'Chaos',right:'Order',pct:Math.round(this.scores.copingStructure/total*100)},
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
        .skills-list li::before{content:'✦';}
        .tips-list li::before{content:'→';}
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
          <span class="htitle">你的压力怪兽</span>
          <div></div>
        </div>
        <div class="monster-card" style="background:${m.gradient}">
          <div class="memoji">${m.emoji}</div>
          <div class="mname">${m.zh}</div>
          <div class="mdesc">${m.desc}</div>
        </div>
        <div class="details">
          <div class="detail-card">
            <div class="detail-title">⚡ 怪兽技能</div>
            <ul class="detail-list skills-list">${m.skills.map(sk => `<li>${sk}</li>`).join('')}</ul>
          </div>
          <div class="detail-card">
            <div class="detail-title">🎯 驯服指南</div>
            <ul class="detail-list tips-list">${m.tips.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="dims-section">
          <div class="dims-title">三维分析</div>
          ${dims.map(d => `<div class="dim-row">
            <div class="dim-label"><span>${d.left}</span><span>${d.name}</span><span>${d.right}</span></div>
            <div class="dim-bar"><div class="dim-fill" style="width:${d.pct}%"></div></div>
          </div>`).join('')}
        </div>
        <div class="actions">
          <button class="btn btn-share" id="shareBtn">分享结果</button>
          <button class="btn btn-retry" id="retryBtn">再试一次</button>
        </div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `我的压力怪兽是${m.zh}！你的呢？`;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      if (navigator.share) navigator.share({title:'压力怪兽测试',text:txt});
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('stress-quiz', StressQuiz);
