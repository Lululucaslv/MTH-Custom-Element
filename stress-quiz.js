/**
 * Stress Quiz \u2014 Wix Custom Element
 * \u538B\u529B\u602A\u517D\u6D4B\u8BD5 - Vanilla JS Web Component
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
      {zh:'\u4F60\u7684deadline\u8FD8\u67093\u5C0F\u65F6\u4F46\u4F60\u521A\u6253\u5F00\u6587\u6863...',options:[{text:'\u614C\u5F20\u5730\u8D76\u5FEB\u505A',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'\u5148\u4F11\u606F\u4E00\u4E0B\u51B7\u9759\u4E0B\u6765',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'\u7ACB\u523B\u5236\u5B9A\u8BA1\u5212\u9AD8\u6548\u5B8C\u6210',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'\u5BA4\u53CB\u505A\u4E86\u8BA9\u4F60\u5F88\u4E0D\u723D\u7684\u4E8B...',options:[{text:'\u76F4\u63A5\u548C\u4ED6\u4EEC\u5BF9\u8D28',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'\u4FDD\u6301\u6C89\u9ED8\u5E76\u8EB2\u907F\u4ED6\u4EEC',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'\u4E4B\u540E\u5E73\u9759\u5730\u8C08\u8BBA',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'\u4F60\u5728\u5DE5\u4F5C\u4E2D\u72AF\u4E86\u4E2A\u9519\u8BEF\uFF0C\u8001\u677F\u6CE8\u610F\u5230\u4E86...',options:[{text:'\u7ACB\u523B\u89E3\u91CA\u5E76\u6539\u6B63',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'\u611F\u5230\u7F9E\u8FB1\u5E76\u9000\u7F29',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'\u5F88\u6CAE\u4E27\u4F46\u9690\u85CF\u8D77\u6765',scores:{stressResponse:0,energyDirection:0,copingStructure:1}}]},
      {zh:'\u670B\u53CB\u5728\u6700\u540E\u4E00\u523B\u53D6\u6D88\u4E86\u8BA1\u5212...',options:[{text:'\u611F\u5230\u53D7\u4F24\u5E76\u53D1\u6D88\u606F\u7ED9\u4ED6\u4EEC',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'\u60C5\u7EEA\u5173\u95ED',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'\u7ACB\u523B\u5236\u5B9A\u66FF\u4EE3\u8BA1\u5212',scores:{stressResponse:1,energyDirection:1,copingStructure:0}}]},
      {zh:'\u4F60\u5728\u62E5\u6324\u6DF7\u4E71\u7684\u60C5\u51B5\u4E0B\u611F\u5230\u538B\u529B...',options:[{text:'\u575A\u6301\u5E76\u5B8C\u6210\u4EFB\u52A1',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'\u627E\u4E2A\u5B89\u9759\u7684\u5730\u65B9\u9003\u79BB',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'\u6709\u70B9\u5931\u63A7',scores:{stressResponse:0,energyDirection:1,copingStructure:1}}]},
      {zh:'\u6709\u4EBA\u5728\u516C\u4F17\u9762\u524D\u6279\u8BC4\u4F60...',options:[{text:'\u7ACB\u5373\u53CD\u51FB',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'\u611F\u5230\u53D7\u4F24\u4F46\u4EC0\u4E48\u90FD\u4E0D\u8BF4',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'\u4E4B\u540E\u6709\u7B56\u7565\u5730\u56DE\u5E94',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'\u4F60\u6709\u591A\u4E2A\u4EFB\u52A1\u8981\u540C\u65F6\u5B8C\u6210...',options:[{text:'\u5F88\u614C\u5F20\u5730\u5230\u5904\u8DF3',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'\u62D6\u5EF6\u5E76\u5E0C\u671B\u4E00\u5207\u987A\u5229',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'\u4F18\u5148\u7EA7\u6392\u5E8F\u5E76\u6709\u6761\u4E0D\u7D0A\u5730\u6267\u884C',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'\u4F60\u5728\u4E00\u4E2A\u95EE\u9898\u4E0A\u5361\u4E86\u597D\u51E0\u4E2A\u5C0F\u65F6...',options:[{text:'\u7EE7\u7EED\u6FC0\u8FDB\u5730\u5F3A\u884C\u49E3\u51B3',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'\u653E\u5F03\u5E76\u6D88\u5931',scores:{stressResponse:1,energyDirection:0,copingStructure:0}},{text:'\u51B7\u9759\u5730\u540E\u9000\u5E76\u91CD\u65B0\u7B56\u5212',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'\u4F60\u610F\u8BC6\u5230\u5FD8\u8BB0\u4E86\u91CD\u8981\u7684\u4E8B...',options:[{text:'\u9677\u5165\u8D1F\u9762\u87BA\u65CB\u5E76\u4E25\u5389\u81EA\u8D23',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'\u5F88\u70E6\u8E81\u4F46\u5F88\u5FEB\u7EE7\u7EED',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'\u521B\u5EFA\u7CFB\u7EDF\u4EE5\u9632\u6B62\u518D\u6B21\u53D1\u751F',scores:{stressResponse:0,energyDirection:1,copingStructure:0}}]},
      {zh:'\u4F60\u4FE1\u4EFB\u7684\u4EBA\u8BA9\u4F60\u5931\u671B\u4E86...',options:[{text:'\u6124\u6012\u5730\u7206\u53D1',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'\u7AD6\u8D57\u9632\u5899\u5E76\u5B64\u7ACB\u81EA\u5DF1',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'\u51B7\u9759\u5730\u5206\u6790\u54EA\u91CC\u51FA\u9519\u4E86',scores:{stressResponse:1,energyDirection:0,copingStructure:0}}]},
      {zh:'\u4F60\u88AB\u671F\u671B\u5728\u81EA\u5DF1\u4E0D\u64C5\u957F\u7684\u4E8B\u4E0A\u5B8C\u7F8E...',options:[{text:'\u52AA\u529B\u8BC1\u660E\u81EA\u5DF1',scores:{stressResponse:0,energyDirection:1,copingStructure:0}},{text:'\u5728\u5F00\u59CB\u524D\u5C31\u611F\u5230\u5931\u8D25',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'\u8FDB\u5165\u8D85\u901F\u6A21\u5F0F',scores:{stressResponse:0,energyDirection:1,copingStructure:1}}]},
      {zh:'\u6240\u6709\u4E8B\u60C5\u90FD\u540C\u65F6\u51FA\u9519...',options:[{text:'\u5931\u63A7\u5E76\u5927\u53EB',scores:{stressResponse:0,energyDirection:1,copingStructure:1}},{text:'\u5B8C\u5168\u5173\u95ED',scores:{stressResponse:1,energyDirection:0,copingStructure:1}},{text:'\u540E\u9000\u4E00\u6B65\u5E76\u547C\u5438',scores:{stressResponse:1,energyDirection:0,copingStructure:0}}]},
    ];
  }

  get monsterTypes() {
    return {
      'rampaging-dragon':{zh:'\uD83D\uDD25 \u66B4\u8D70\u9F99',emoji:'\uD83D\uDD25',gradient:'linear-gradient(135deg,#dc2626,#ea580c)',desc:'\u538B\u529B\u4E00\u6765\u76F4\u63A5\u539F\u5730\u7206\u70B8\u7684\u72E0\u89D2\u8272\u3002\u65E0\u6240\u754F\u60E7\uFF0C\u5B8C\u5168\u6DF7\u4E71\u3002',skills:['\u7206\u70B8\u6027\u80FD\u91CF\u91CA\u653E','\u901A\u8FC7\u6DF7\u4E71\u7ACB\u5373\u89E3\u51B3\u95EE\u9898','\u96F6\u7126\u8651\u79EF\u7D2F'],tips:['\u5C06\u80FD\u91CF\u5F15\u5BFC\u5230\u8EAB\u4F53\u6D3B\u52A8\uFF08\u8DD1\u6B65\u3001\u62F3\u51FB\u3001\u8DF3\u821E\uFF09','\u5728\u53CD\u5E94\u524D\u7EC3\u4E605\u79D2\u949F\u7684\u6682\u505C','\u4F7F\u7528\u5F3A\u70C8\u7684\u6709\u6C27\u8FD0\u52A8\u6765\u6D88\u8017\u8FC7\u91CF\u7684\u80BE\u4E0A\u817A\u7D20']},
      'shell-turtle':{zh:'\uD83D\uDC22 \u7F29\u58F3\u9F9F',emoji:'\uD83D\uDC22',gradient:'linear-gradient(135deg,#15803d,#0f766e)',desc:'\u9ED8\u9ED8\u628A\u81EA\u5DF1\u5173\u8D77\u6765\u6D88\u5316\u4E00\u5207\u7684\u9690\u5FCD\u738B\u3002\u6C89\u9ED8\u3001\u575A\u97E7\u3001\u795E\u79D8\u3002',skills:['\u5B8C\u7F8E\u7684\u60C5\u7EEA\u7BA1\u7406','\u6DF1\u5C42\u5185\u90E8\u5904\u7406','\u96F6\u620F\u5267\u6027'],tips:['\u6709\u610F\u8BC6\u5730\u4E0E\u4FE1\u4EFB\u7684\u4EBA\u5206\u4EAB\u4F60\u7684\u611F\u53D7','\u6BCF\u5929\u5199\u65E5\u8BB0\u4EE5\u5916\u5316\u5185\u90E8\u60F3\u6CD5','\u8BBE\u5B9A\u5B9A\u671F\u7684\u81EA\u68C0\u65F6\u95F4\u4EE5\u5927\u58F0\u5904\u7406\u60C5\u7EEA']},
      'silent-volcano':{zh:'\uD83C\uDF0B \u6C89\u9ED8\u706B\u5C71',emoji:'\uD83C\uDF0B',gradient:'linear-gradient(135deg,#334155,#7f1d1d)',desc:'\u8868\u9762\u98CE\u5E73\u6D6A\u9759\uFF0C\u5185\u5FC3\u5CA9\u6D46\u7FFB\u6D8C\u3002\u4F60\u628A\u4E00\u5207\u538B\u6291\u5230\u7206\u53D1\u3002',skills:['\u65E0\u5F62\u538B\u529B\u79EF\u7D2F','\u7A81\u7136\u610F\u5916\u91CA\u653E','\u5370\u8C61\u6DF1\u523A\u7684\u5BB9\u5FCD\u5EA6'],tips:['\u901A\u8FC7\u51A5\u60F3\u6216\u547C\u5438\u7EC3\u4E60\u5B9A\u671F\u91CA\u653E\u538B\u529B','\u5C3D\u65E9\u8BC6\u522B\u538B\u529B\u8B66\u544A\u4FE1\u53F7\u5E76\u89E3\u51B3','\u5728\u5C0F\u6CAE\u4E27\u53D8\u6210\u5927\u6CAE\u4E27\u4E4B\u524D\u8BA8\u8BBA\u5B83\u4EEC']},
      'escape-eagle':{zh:'\uD83E\uDD85 \u9003\u8DD1\u9E70',emoji:'\uD83E\uDD85',gradient:'linear-gradient(135deg,#2563eb,#0891b2)',desc:'\u8DD1\u5F97\u5FEB\u8FD8\u8DD1\u5F97\u6709\u8BA1\u5212\u7684\u6218\u7565\u64A4\u9000\u4E13\u5BB6\u3002\u6709\u98CE\u5EA6\u5730\u9003\u79BB\u3002',skills:['\u6218\u7565\u6027\u9003\u79BB\u8BA1\u5212','\u5BFB\u627E\u66FF\u4EE3\u8DEF\u7EBF','\u4F18\u96C5\u7684\u907F\u514D'],tips:['\u7EC3\u4E60\u76F4\u9762\u5C0F\u95EE\u9898\u800C\u4E0D\u662F\u56DE\u907F','\u6784\u5EFA"\u95EE\u9898\u89E3\u51B3\u5DE5\u5177\u5305"\u4F7F\u5BF9\u6297\u611F\u89C9\u4E0D\u90A3\u4E48\u53EF\u6015','\u5B89\u6392\u5B9A\u671F\u53CD\u601D\u65F6\u95F4\uFF0C\u601D\u8003\u4F60\u5728\u907F\u514D\u4EC0\u4E48']},
      'iron-warrior':{zh:'\u2694\uFE0F \u94C1\u8840\u6218\u58EB',emoji:'\u2694\uFE0F',gradient:'linear-gradient(135deg,#374151,#0f172a)',desc:'\u6709\u6761\u7406\u5730\u66B4\u8D70\u7684\u6548\u7387\u578B\u9009\u624B\u3002\u7528\u51B7\u8840\u7684\u6548\u7387\u5BF9\u4ED8\u538B\u529B\u3002',skills:['\u538B\u529B\u4E0B\u7684\u6709\u6761\u4E0D\u7D0A\u7684\u6267\u884C','\u6218\u7565\u6027\u4FB5\u7565','\u96F6\u6D6A\u8D39\u7684\u52A8\u4F5C'],tips:['\u8BB0\u4F4F\u4E0D\u662F\u6240\u6709\u4E1C\u897F\u90FD\u9700\u8981\u6218\u6597\u6A21\u5F0F','\u5728\u6CA1\u6709\u538B\u529B\u65F6\u7EC3\u4E60\u653E\u677E\u6280\u5DE7','\u50CF\u5BF9\u5F85\u5DE5\u4F5C\u4E00\u6837\u8BA4\u771F\u5730\u5C06\u4F11\u606F\u65F6\u95F4\u7EB3\u5165\u65E5\u7A0B']},
      'melting-slime':{zh:'\uD83E\uDEE0 \u878D\u5316\u53F2\u83B1\u59C6',emoji:'\uD83E\uDEE0',gradient:'linear-gradient(135deg,#ec4899,#4f46e5)',desc:'\u538B\u529B\u6765\u4E86\u76F4\u63A5\u53D8\u6210\u4E00\u6EE9\u3002\u4F60\u5931\u53BB\u4E86\u5F62\u72B6\uFF0C\u53EA\u80FD\u878D\u5316\u3002',skills:['\u6700\u5927\u9002\u5E94\u6027','\u60C5\u611F\u6D41\u52A8\u6027','\u96F6\u5BF9\u53D8\u5316\u7684\u62B5\u6297\u529C'],tips:['\u521B\u5EFA\u7ED3\u6784\uFF1A\u5217\u8868\u3001\u65E5\u5E38\u548C\u65E5\u7A0B\u5E2E\u52A9\u4F60\u51DD\u805A','\u7EC3\u4E60\u63A5\u5730\u7EC3\u4E60\uFF085-4-3-2-1\u611F\u5B98\u6280\u5DE7\uFF09','\u5C06\u95EE\u9898\u5206\u89E3\u6210\u5C0F\u7684\u3001\u53EF\u7BA1\u7406\u7684\u90E8\u5206']},
      'iceberg-assassin':{zh:'\uD83E\uDDCA \u51B0\u5C71\u523A\u5BA2',emoji:'\uD83E\uDDCA',gradient:'linear-gradient(135deg,#60a5fa,#6366f1)',desc:'\u51B7\u9759\u7CBE\u51C6\u5730\u89E3\u51B3\u95EE\u9898\u4F46\u5185\u5FC3\u5DF2\u7ECF\u70B8\u4E86\u3002\u51B0\u96EA\u5973\u738B\u6C14\u8D28\u3002',skills:['\u624B\u672F\u5F0F\u95EE\u9898\u89E3\u51B3','\u65E0\u5F62\u7684\u75DB\u82E6','\u538B\u529B\u4E0B\u7684\u81F4\u547D\u7CBE\u51C6'],tips:['\u5141\u8BB8\u81EA\u5DF1\u611F\u53D7\u60C5\u7EEA\u800C\u4E0D\u5224\u65AD\u5B83\u4EEC','\u627E\u5230\u4E00\u4E2A\u5B89\u5168\u7684\u5730\u65B9\u5B9A\u671F\u8868\u8FBE\u4F60\u7684\u5185\u90E8\u6DF7\u4E71','\u8BB0\u4F4F\uFF1A\u80FD\u529B\u2260\u65E0\u654C\u3002\u4F60\u53EF\u4EE5\u5BFB\u6C42\u5E2E\u52A9\u3002']},
      'chaos-tornado':{zh:'\uD83C\uDF2A\uFE0F \u6DF7\u4E71\u9F99\u5377\u98CE',emoji:'\uD83C\uDF2A\uFE0F',gradient:'linear-gradient(135deg,#facc15,#f97316)',desc:'\u8FB9\u9003\u8FB9\u70B8\u7684\u884C\u4E3A\u827A\u672F\u5BB6\u3002\u56DB\u5904\u5954\u9003\u540C\u65F6\u7206\u70B8\u3002',skills:['\u591A\u5411\u80FD\u91CF\u8F93\u51FA','\u81EA\u53D1\u9002\u5E94','\u6700\u9AD8\u4E0D\u53EF\u9884\u6D4B\u6027'],tips:['\u538B\u529B\u65F6\u4E00\u6B21\u53EA\u5173\u6CE8\u4E00\u4EF6\u4E8B','\u5728\u884C\u52A8\u524D\u4F7F\u7528"\u505C\u6B62\u3001\u547C\u5438\u3001\u4F18\u5148\u7EA7"\u5492\u8BED','\u521B\u5EFA\u4E00\u4E2A\u53EF\u4EE5\u5E2E\u52A9\u4F60\u96C6\u4E2D\u6CE8\u610F\u529B\u7684\u95EE\u8D23\u4F19\u4F34']},
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
        <div class="emojis">\uD83D\uDD25 \uD83D\uDC22 \uD83C\uDF0B \u2694\uFE0F</div>
        <div class="title">\u4F60\u4F53\u5185\u4F4F\u7740\u4EC0\u4E48\u5C0F\u602A\u517D\uFF1F</div>
        <div class="sub">\u53D1\u73B0\u4F60\u7684\u538B\u529B\u751F\u7269</div>
        <div class="info">\u6BCF\u4E2A\u4EBA\u9762\u5BF9\u538B\u529B\u90FD\u6709\u4E0D\u540C\u7684\u53CD\u5E94\u65B9\u5F0F\u3002\u901A\u8FC712\u9053\u60C5\u666F\u9898\uFF0C\u53D1\u73B0\u4F60\u5185\u5FC3\u7684\u538B\u529B\u602A\u517D\u662F\u4EC0\u4E48\u7C7B\u578B\uFF01</div>
        <div class="meta">12\u9898 \u00B7 2-3\u5206\u949F \u00B7 \u6709\u8DA3\u4E14\u51C6\u5F97\u79BB\u8C31</div>
        <button class="start-btn" id="startBtn">\u5F00\u59CB\u6D4B\u8BD5</button>
        <button class="back-link" id="backBtn">&larr; \u8FD4\u56DE</button>
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
      {name:'\u538B\u529B\u53CD\u5E94',left:'Fight',right:'Flight',pct:Math.round((1-this.scores.stressResponse/total)*100)},
      {name:'\u80FD\u91CF\u65B9\u5411',left:'Implode',right:'Explode',pct:Math.round(this.scores.energyDirection/total*100)},
      {name:'\u5E94\u5BF9\u7ED3\u6784',left:'Chaos',right:'Order',pct:Math.round(this.scores.copingStructure/total*100)},
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
        .skills-list li::before{content:'\u2726';}
        .tips-list li::before{content:'\u2192';}
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
          <span class="htitle">\u4F60\u7684\u538B\u529B\u602A\u517D</span>
          <div></div>
        </div>
        <div class="monster-card" style="background:${m.gradient}">
          <div class="memoji">${m.emoji}</div>
          <div class="mname">${m.zh}</div>
          <div class="mdesc">${m.desc}</div>
        </div>
        <div class="details">
          <div class="detail-card">
            <div class="detail-title">\u26A1 \u602A\u517D\u6280\u80FD</div>
            <ul class="detail-list skills-list">${m.skills.map(sk => `<li>${sk}</li>`).join('')}</ul>
          </div>
          <div class="detail-card">
            <div class="detail-title">\uD83C\uDFAF \u9A6F\u670D\u6307\u5357</div>
            <ul class="detail-list tips-list">${m.tips.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="dims-section">
          <div class="dims-title">\u4E09\u7EF4\u5206\u6790</div>
          ${dims.map(d => `<div class="dim-row">
            <div class="dim-label"><span>${d.left}</span><span>${d.name}</span><span>${d.right}</span></div>
            <div class="dim-bar"><div class="dim-fill" style="width:${d.pct}%"></div></div>
          </div>`).join('')}
        </div>
        <div class="actions">
          <button class="btn btn-share" id="shareBtn">\u5206\u4EAB\u7ED3\u679C</button>
          <button class="btn btn-retry" id="retryBtn">\u518D\u8BD5\u4E00\u6B21</button>
        </div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `\u6211\u7684\u538B\u529B\u602A\u517D\u662F${m.zh}\uFF01\u4F60\u7684\u5462\uFF1F`;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      if (navigator.share) navigator.share({title:'\u538B\u529B\u602A\u517D\u6D4B\u8BD5',text:txt});
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('stress-quiz', StressQuiz);
