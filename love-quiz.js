/**
 * Love Quiz \u2014 Wix Custom Element
 * \u604B\u7231\u4EBA\u683C\u6D4B\u8BD5 - Vanilla JS Web Component
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
      {zh:'\u4F60\u6697\u604B\u7684\u4EBA\u7A81\u7136\u7ED9\u4F60\u53D1\u4E86\u4E00\u6761\u6D88\u606F\uFF0C\u6253\u7834\u4E863\u5929\u7684\u6C89\u9ED8\u3002\u4F60\u7684\u7B2C\u4E00\u53CD\u5E94\uFF1F',options:[{text:'\u5FC3\u8DF3\u52A0\u901F\uFF01\u7ACB\u523B\u6EE1\u8154\u70ED\u60C5\u5730\u56DE\u590D \uD83D\uDD25',scores:[3,3,2]},{text:'\u51B7\u9759\u5730\u8FC7\u4E00\u4F1A\u513F\u518D\u56DE\uFF0C\u4FDD\u6301\u9AD8\u51B7 \uD83E\uDDCA',scores:[0,1,0]},{text:'\u8BD5\u63A2\u4E00\u4E0B\uFF1A\u7B49\u66F4\u4E45\u770Bta\u662F\u5426\u5728\u4E4E \uD83C\uDFAF',scores:[1,0,3]}]},
      {zh:'\u5728\u604B\u7231\u4E2D\uFF0C\u4F60\u7406\u60F3\u7684\u76F8\u5904\u6A21\u5F0F\u662F\uFF1F',options:[{text:'\u6211\u4E3B\u5BFC\uFF0Cta\u8DDF\u7740\u6211\u7684\u8282\u594F\u8D70 \uD83D\uDC51',scores:[2,3,2]},{text:'\u6211\u4EEC\u662F\u5E73\u7B49\u7684\uFF0C\u5404\u81EA\u81EA\u7531 \uD83E\uDD8B',scores:[1,0,0]},{text:'ta\u8FFD\u6211\uFF0C\u6211\u4EAB\u53D7\u88AB\u9700\u8981\u7684\u611F\u89C9 \uD83D\uDCAB',scores:[2,0,1]}]},
      {zh:'\u4F60\u770B\u5230\u4F34\u4FA3\u7684\u524D\u4EFB\u7ED9\u4ED6\u4EEC\u7684\u52A8\u6001\u70B9\u8D5E\u4E86\u3002\u4F60\uFF1F',options:[{text:'\u7ACB\u523B\u95EE\u6E05\u695A\u600E\u4E48\u56DE\u4E8B\uFF0C\u6211\u9700\u8981\u89E3\u91CA\uFF01 \uD83D\uDD25',scores:[3,1,3]},{text:'\u6CA1\u5173\u7CFB\uFF0C\u6211\u4E0D\u592A\u5728\u610F \uD83D\uDE0C',scores:[0,0,0]},{text:'\u968F\u53E3\u63D0\u4E00\u4E0B\uFF0C\u6697\u793A\u6211\u7684\u5B58\u5728 \uD83D\uDE0F',scores:[1,2,2]}]},
      {zh:'\u5F53\u4F60\u559C\u6B22\u4E00\u4E2A\u4EBA\u65F6\uFF0C\u4F60\u4F1A\uFF1F',options:[{text:'\u76F4\u63A5\u544A\u767D\uFF0C\u7EDD\u5BF9\u5766\u8BDA \uD83C\uDFAF',scores:[3,3,1]},{text:'\u7B49\u5BF9\u65B9\u5148\u8868\u767D \uD83C\uDF19',scores:[0,0,1]},{text:'\u653E\u6697\u53F7\u89C2\u5BDF\u5BF9\u65B9\u53CDLu5E94 \uD83D\uDD75\uFE0F',scores:[1,1,2]}]},
      {zh:'\u4F34\u4FA3\u60F3\u8981\u548C\u670B\u53CB\u4E00\u8D77\u51FA\u53BB\uFF0C\u6CA1\u6709\u4F60\u3002\u4F60\u7684\u611F\u53D7\uFF1F',options:[{text:'\u6211\u4F1A\u60F3ta\uFF0C\u4F1A\u4E0D\u505C\u53D1\u6D88\u606F \uD83D\uDCF1',scores:[3,0,3]},{text:'\u592A\u597D\u4E86\uFF01\u6211\u4E5F\u6709\u81EA\u5DF1\u7684\u8BA1\u5212 \uD83E\uDD85',scores:[0,2,0]},{text:'\u6709\u70B9\u4E0D\u5B89\uFF0C\u4F46\u6211\u4FE1\u4EFBta \uD83D\uDCAD',scores:[1,0,1]}]},
      {zh:'\u5435\u67B6\u540E\uFF0C\u4F60\u4F1A\u600E\u4E48\u505A\uFF1F',options:[{text:'\u8981\u6C42\u7ACB\u523B\u8C08\u6E05\u695A \uD83D\uDD25',scores:[3,2,2]},{text:'\u7ED9\u5F7C\u6B64\u7A7A\u95F4\uFF0C\u7B49ta\u6765\u627E\u6211 \uD83D\uDC51',scores:[0,0,0]},{text:'\u53CD\u590D\u5206\u6790\u54EA\u91CC\u51FA\u4E86\u95EE\u9898 \uD83E\uDDE0',scores:[2,1,3]}]},
      {zh:'\u5F53\u4F60\u6B63\u5728\u7EA6\u4F1A\u65F6\uFF0C\u6709\u4EBA\u5BF9\u4F60\u8868\u793A\u5174\u8DA3\u3002\u4F60\uFF1F',options:[{text:'\u7ACB\u523B\u62D2\u7EDD\uFF0C\u6211\u5F88\u5FE0\u8BDA \uD83D\uDCAA',scores:[2,0,2]},{text:'\u4EAB\u53D7\u88AB\u5173\u6CE8\u4F46\u4FDD\u6301\u8DDD\u79BB \uD83D\uDE0F',scores:[0,2,0]},{text:'\u6709\u70B9\u53D7\u5BA0\u82E5\u60CA\uFF0C\u53EF\u80FE\u4F7B\u5FAE\u56DE\u5E94 \uD83C\uDF38',scores:[1,1,0]}]},
      {zh:'\u4F60\u7684\u7231\u7684\u8BED\u8A00\u662F\uFF1F',options:[{text:'\u80A2\u4F53\u63A5\u89E6\u548C\u6301\u7EED\u7684\u4EB2\u5BC6 \uD83E\uDD17',scores:[3,2,3]},{text:'\u4E00\u8D77\u505A\u5404\u81EA\u7684\u4E8B\u7684\u9AD8\u8D28\u91CF\u65F6\u5149 \uD83C\uDFE1',scores:[0,1,0]},{text:'\u751C\u8A01\u871C\u8BED\u548C\u6696\u5FC3\u7684\u5C0F\u4E3E\u52A8 \uD83D\uDC8C',scores:[2,2,1]}]},
      {zh:'\u5F53\u4F60\u548C\u591A\u4E2A\u4EBA\u7EA6\u4F1A\u65F6\uFF0C\u591A\u4E45\u540E\u624D\u4F1A\u8981\u6C42\u72EC\u5360\uFF1F',options:[{text:'\u7ACB\u523B\uFF01\u6211\u9700\u8981\u786E\u5B9A\u5173\u7CFB \uD83D\uDD25',scores:[3,0,3]},{text:'\u4E0D\u6025\uFF0C\u6211\u559C\u6B22\u4FDD\u7559\u9009\u62E9 \uD83E\uDD8B',scores:[0,2,0]},{text:'\u987A\u5176\u81EA\u7136\uFF0C\u53EF\u80FD2-3\u4E2A\u6708 \uD83D\uDCC5',scores:[1,1,1]}]},
      {zh:'\u4F60\u7406\u60F3\u7684\u7EA6\u4F1A\u662F\uFF1F',options:[{text:'\u5145\u6EE1\u60CA\u559C\u7684\u5192\u9669 \uD83C\uDFA2',scores:[3,3,0]},{text:'\u968F\u610F\u7684\u76F8\u5904\uFF0C\u548C\u8C01\u90FD\u884C \uD83D\uDE0C',scores:[0,0,0]},{text:'\u6D6A\u6F2B\u665A\u9910\uFF0C\u8BA9\u6211\u89C9\u5F97\u88AB\u9009\u4E2D \uD83D\uDC8E',scores:[2,0,2]}]},
      {zh:'\u4F60\u4F1A\u67E5\u770B\u4F34\u4FA3\u7684\u624B\u673A\u3002\u591A\u4E45\u4E00\u6B21\uFF1F',options:[{text:'\u7ECF\u5E38\uFF0C\u6211\u9700\u8981\u77E5\u9053\u60C5\u51B5 \uD83D\uDC41\uFE0F',scores:[1,1,3]},{text:'\u4ECE\u4E0D\uFF0C\u6211\u5B8C\u5168\u4FE1\u4EFBta \uD83D\uDD4A\uFE0F',scores:[0,0,0]},{text:'\u5F88\u5C11\uFF0C\u9664\u975E\u611F\u89C9\u4E0D\u5BF9\u52B2 \uD83E\uDD14',scores:[1,1,1]}]},
      {zh:'\u5728\u7231\u60C5\u4E2D\uFF0C\u4F60\u6700\u53EF\u80FD\uFF1F',options:[{text:'\u5B8C\u5168\u8FF7\u5931\u5728\u5BF9\u65B9\u8EAB\u4E0A \uD83D\uDD25',scores:[3,1,3]},{text:'\u4FDD\u6301\u81EA\u6211\u548C\u72EC\u7ACB\u5174\u8DA3 \uD83E\uDD85',scores:[0,2,0]},{text:'\u878D\u5165\u4F46\u6697\u4E2D\u4FDD\u6301\u638C\u63A7 \uD83D\uDC51',scores:[1,2,2]}]},
      {zh:'\u5982\u679C\u4F60\u7684\u4F34\u4FA3\u83B7\u5F97\u4ED6\u4EBA\u7684\u5173\u6CE8\uFF0C\u4F60\uFF1F',options:[{text:'\u81EA\u8C6A\uFF0C\u559C\u6B22\u70AB\u8000ta \uD83D\uDCAA',scores:[2,3,1]},{text:'\u5B8C\u5168\u65E0\u6240\u8C13\uFF0C\u90A3\u662Fta\u7684\u4E8B \uD83D\uDE0C',scores:[0,0,0]},{text:'\u5185\u5FC3\u6DF1\u5904\u611F\u5230\u4E0D\u5B89\u548C\u5A01\u80C1 \uD83D\uDE30',scores:[1,0,3]}]},
      {zh:'\u4F60\u5728\u7231\u60C5\u4E2D\u6700\u5927\u7684\u6050\u60E7\u662F\uFF1F',options:[{text:'\u88AB\u629B\u5F03\u6216\u88AB\u53D6\u4EE3 \uD83D\uDC94',scores:[3,0,3]},{text:'\u5931\u53BB\u72EC\u7ACB\u548C\u81EA\u7531 \uD83E\uDD8B',scores:[0,2,0]},{text:'\u53D7\u5230\u60C5\u611F\u4E0A\u7684\u4F24\u5BB3\u6216\u80CC\u53DB \uD83E\uDD40',scores:[2,1,1]}]},
      {zh:'\u4F60\u60F3\u88AB\u600E\u6837\u5730\u7231\uFF1F',options:[{text:'\u70ED\u70C8\u5730\u3001\u5168\u5FC3\u5168\u610F\u5730\u3001ALL IN \uD83D\uDD25',scores:[3,1,2]},{text:'\u8F7B\u8F7B\u5730\u3001\u81EA\u7531\u5730\u3001\u6CA1\u6709\u538B\u529B \uD83C\uDF2C\uFE0F',scores:[0,2,0]},{text:'\u7EC6\u5FC3\u5730\u3001\u5FE0\u8BDA\u5730\u3001\u5168\u8EAB\u5FC3\u7684\u5949\u732E \uD83D\uDC9D',scores:[2,0,3]}]},
    ];
  }

  get personalityTypes() {
    return {
      'burning-lover':{zh:'\u71C3\u70E7\u578B\u604B\u4EBA',emoji:'\uD83D\uDD25',desc:'\u7231\u5BF9\u4F60\u6765\u8BF4\u5C31\u662F\u4E00\u573A\u718A\u718A\u70C8\u706B\uFF0C\u5168\u8EAB\u5FC3\u6295\u5165\u3002\u4F60\u70ED\u70C8\u5730\u7231\uFF0C\u70ED\u60C5\u5730\u8FFD\u6C42\uFF0C\u9700\u8981\u5B8C\u5168\u7684\u5949\u732E\u3002',personality:'\u4F60\u662F\u90A3\u4E2A\u51CC\u66682\u70B9\u53D147\u6761\u6D88\u606F\u3001\u8BA1\u5212\u60CA\u559C\u65C5\u884C\u3001\u628A\u604B\u7231\u5F53\u621024/7\u70ED\u60C5\u9879\u76EE\u7684\u6D6A\u6F2B\u4E3B\u4E49\u8005\u3002',gradient:'linear-gradient(135deg,#ef4444,#f97316,#ec4899)',compatible:['devoted-guardian','mysterious-shadow']},
      'devoted-guardian':{zh:'\u5B89\u62A4\u578B\u604B\u4EBA',emoji:'\uD83D\uDC51',desc:'\u70ED\u60C5\u5374\u7A33\u5B9A\uFF0C\u4F60\u5F3A\u70C8\u5730\u7231\u4F46\u60F3\u8981\u4FDD\u62A4\u548C\u638C\u63A7\u3002\u4F34\u4FA3\u662F\u4F60\u7684\u4F18\u5148\u7EA7\u548C\u6267\u5FF5\u3002',personality:'\u4F60\u662F\u4FDD\u62A4\u6B32\u5F3A\u3001\u5FE0\u8BDA\u4F46\u6697\u5730\u91CC\u5AC9\u5992\u7684\u90A3\u4E2A\u3002\u4F60\u559C\u6B22\u8BA1\u5212\u4ED6\u4EEC\u7684\u751F\u6D3B\u3001\u8BB0\u4F4F\u6BCF\u4E00\u4E2A\u7EC6\u8282\u3001\u6210\u4E3A\u4E0D\u53EF\u66FF\u4EE3\u7684\u4EBA\u3002',gradient:'linear-gradient(135deg,#4f46e5,#6366f1,#3b82f6)',compatible:['burning-lover','butterfly-free']},
      'mysterious-shadow':{zh:'\u795E\u79D8\u9634\u5F71',emoji:'\uD83D\uDD75\uFE0F\u200D\u2640\uFE0F',desc:'\u4F60\u70ED\u60C5\u5730\u7231\u4F46\u559C\u6B22\u73A9\u6E38\u620F\u3002\u4F60\u6309\u81EA\u5DF1\u7684\u8282\u594F\u8FFD\u6C42\uFF0C\u8BA9\u5BF9\u65B9\u731C\u6D4B\u4F60\u7684\u771F\u5B9E\u611F\u53D7\u3002',personality:'\u7231\u60C5\u7684\u6218\u7565\u5BB6\u2014\u2014\u4F60\u5206\u6790\u6BCF\u4E00\u6B65\u68CB\u3001\u6D4B\u8BD5\u4ED6\u4EEC\u7684\u627F\u8BFA\u3001\u4ECE\u4E0D\u5B8C\u5168\u644A\u724C\u3002\u8DDD\u79BB\u662F\u4F60\u7684\u529B\u91CF\u3002',gradient:'linear-gradient(135deg,#334155,#4f46e5,#ec4899)',compatible:['burning-lover','butterfly-free']},
      'hunter-prey':{zh:'\u730E\u4EBA\u578B\u604B\u4EBA',emoji:'\uD83E\uDD8A',desc:'\u51B7\u9759\u4F46\u597D\u80DC\uFF0C\u4F60\u4E3B\u52A8\u8FFD\u6C42\u4F46\u4FDD\u6301\u81EA\u7531\u3002\u7231\u60C5\u5BF9\u4F60\u6765\u8BF4\u662F\u573A\u6E38\u620F\uFF0C\u4F60\u8981\u8D62\u3002',personality:'\u4F60\u559C\u6B22\u8FFD\u730E\u7684\u523A\u6FC0\u611F\u3002\u4E00\u65E6"\u5F97\u5230"\u4ED6\u4EEC\uFF0C\u4F60\u53EF\u80FD\u4F1A\u5931\u53BB\u5174\u8DA3\u3002\u4F60\u9700\u8981\u65B0\u9C9C\u611F\u3001\u523A\u6FC0\u548C\u638C\u63A7\u6743\u3002',gradient:'linear-gradient(135deg,#f59e0b,#f97316,#ef4444)',compatible:['butterfly-free','devoted-guardian']},
      'butterfly-free':{zh:'\u8774\u8776\u81EA\u7531',emoji:'\uD83E\uDD8B',desc:'\u7231\u662F\u81EA\u7531\u3002\u4F60\u5BF9\u4E00\u5207\u90FD\u5F88\u51B7\u9759\uFF0C\u6309\u81EA\u5DF1\u7684\u8282\u594F\u4FFD\u6C42\uFF0C\u9700\u8981\u7A7A\u95F4\u547C\u5438\u3002\u6CA1\u6709\u5360\u6709\u6B32\u3002',personality:'\u5173\u7CFB\u81EA\u7531\u4E3B\u4E49\u8005\u2014\u2014\u4F60\u8F7B\u8F7B\u5730\u7231\u3001\u81EA\u7531\u5730\u751F\u6D3B\u3001\u76F8\u4FE1\u627F\u8BFA\u4E0D\u5E94\u8BE5\u50CF\u7262\u7B3C\u3002\u4F60\u662F\u6240\u6709\u4EBA\u7684\u670B\u53CB\u3002',gradient:'linear-gradient(135deg,#4ade80,#22d3ee,#3b82f6)',compatible:['hunter-prey','wind-like']},
      'timid-deer':{zh:'\u80C6\u5C0F\u9E7F',emoji:'\uD83E\uDD8C',desc:'\u5B89\u9759\u800C\u51B7\u9759\uFF0C\u4F46\u4F60\u5E0C\u671B\u88AB\u8FFD\u6C42\u3002\u4F60\u5F88\u6311\u5254\uFF0C\u5E0C\u671B\u6709\u4EBA\u80FD\u5411\u4F60\u8BC1\u660E\u5949\u732E\u3002',personality:'\u6D6A\u6F2B\u7684\u60B2\u89C2\u4E3B\u4E49\u8005\u2014\u2014\u4F60\u76F8\u4FE1\u7231\u4F46\u5F88\u5BB3\u6015\u3002\u4F60\u9700\u8981\u6301\u7EED\u7684\u4FDD\u8BC1\u548C\u6DF1\u5C42\u7684\u3001\u4E13\u4E00\u7684\u7231\u6765\u611F\u5230\u5B89\u5168\u3002',gradient:'linear-gradient(135deg,#f9a8d4,#a5b4fc,#818cf8)',compatible:['devoted-guardian','mysterious-shadow']},
      'wind-like':{zh:'\u98CE\u4E00\u6837\u7684\u5B58\u5728',emoji:'\uD83C\uDF2C\uFE0F',desc:'\u51B7\u9759\u3001\u795E\u79D8\u3001\u81EA\u7531\u3002\u4F60\u6309\u81EA\u5DF1\u7684\u65B9\u5F0F\u7231\uFF0C\u4FDD\u6301\u8DDD\u79BB\uFF0C\u96BE\u4EE5\u7422\u78E8\u3002\u627F\u8BFA\uFF1F\u4E5F\u8BB8\u6C38\u8FDc\u4E0D\u4F1A\u3002',personality:'\u7EC8\u6781\u4E4B\u8C1C\u2014\u2014\u6CA1\u4EBA\u771F\u6B63\u77E5\u9053\u4F60\u5728\u60F3\u4EC0\u4E48\u3002\u4F60\u5438\u5F15\u4EBA\u4F46\u4ECE\u4E0D\u5B8C\u5168\u6295\u5165\u3002\u72EC\u7ACB\u662F\u4E00\u5207\u3002',gradient:'linear-gradient(135deg,#9ca3af,#93c5fd,#5eead4)',compatible:['butterfly-free','hunter-prey']},
      'devoted-obsessive':{zh:'\u6267\u5FF5\u578B\u604B\u4EBA',emoji:'\uD83D\uDC9D',desc:'\u4F60\u5B89\u9759\u5730\u6DF1\u7231\u3002\u4F60\u4E0D\u662F\u8FFD\u6C42\u8005\uFF0C\u4F46\u4E00\u65E6\u627F\u8BFA\u5C31\u5B8C\u5168\u5949\u732E\u4E14\u5360\u6709\u3002\u6C38\u8FDC\u662F\u4F60\u7684\u3002',personality:'\u6C89\u9ED8\u7684\u4EF0\u6155\u8005\u53D8\u6210\u575A\u5B9A\u7684\u4F34\u4FA3\u2014\u2014\u4F60\u89C2\u5BDF\u3001\u5206\u6790\u3001\u4ECE\u6697\u5904\u7231\u3002\u4F60\u7684\u5949\u732E\u5C31\u662F\u4F60\u7684\u8EAB\u4EFD\u3002',gradient:'linear-gradient(135deg,#f43f5e,#ec4899,#ef4444)',compatible:['burning-lover','devoted-guardian']},
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
        <div class="emoji">\uD83D\uDC95</div>
        <div class="title">\u4F60\u7684\u604B\u7231\u4EBA\u683C\u662F\u4EC0\u4E48\uFF1F</div>
        <div class="sub">\u6B63\u7ECF\u4EBA\u8C01\u5206\u6790\u604B\u7231\u554A\uFF1F</div>
        <div class="info">\u901A\u8FC715\u9053\u604B\u7231\u60C5\u666F\u9898\uFF0C\u53D1\u73B0\u4F60\u7684\u604B\u7231\u4EBA\u683C\u7C7B\u578B\u3002\u70ED\u70C8\u578B\uFF1F\u5B89\u62A4\u578B\uFF1F\u8FD8\u662F\u81EA\u7531\u578B\uFF1F\u6765\u6D4B\u6D4B\u770B\u5427\uFF01</div>
        <button class="start-btn" id="startBtn">\u5F00\u59CB\u6D4B\u8BD5 \uD83D\uDD25</button>
        <button class="back-link" id="backBtn">&larr; \u8FD4\u56DE</button>
        <div class="footer">\u7ED3\u679C\u5F88\u9002\u5408\u5728\u5C0F\u7EA2\u4E66\u5206\u4EAB\u54E6</div>
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
          <span class="counter">Question ${this.currentQuestion+1}/${this.questions.length} \u00B7 ${Math.round(pct)}%</span>
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
      {name:'\u70ED\u70C8\u7A0B\u5EA6',emoji:'\u2764\uFE0F\u200D\uD83D\uDD25',score:this.scores.passionate,max:15,gradient:'linear-gradient(90deg,#ef4444,#ec4899)'},
      {name:'\u4E3B\u52A8\u7A0B\u5EA6',emoji:'\uD83E\uDD8A',score:this.scores.hunter,max:15,gradient:'linear-gradient(90deg,#f59e0b,#f97316)'},
      {name:'\u5360\u6709\u7A0B\u5EA6',emoji:'\uD83D\uDD12',score:this.scores.possessive,max:15,gradient:'linear-gradient(90deg,#6366f1,#ec4899)'},
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
          <span class="htitle">\u4F60\u7684\u604B\u7231\u4EBA\u683C</span>
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
          <div class="dims-title">\u7EF4\u5EA6\u5206\u6790</div>
          ${dims.map(d => `<div class="dim-row">
            <span class="dim-emoji">${d.emoji}</span>
            <span class="dim-label">${d.name}</span>
            <div class="dim-bar"><div class="dim-fill" style="width:${Math.min(d.score/d.max*100,100)}%;background:${d.gradient}"></div></div>
            <span class="dim-score">${Math.min(d.score,d.max)}/${d.max}</span>
          </div>`).join('')}
        </div>
        ${compatHTML ? `<div class="compat"><div class="compat-title">\u6700\u4F73\u5339\u914D\u7C7B\u578B</div><div class="compat-list">${compatHTML}</div></div>` : ''}
        <div class="actions">
          <button class="btn btn-primary" id="shareBtn">\u590D\u5236\u7ED3\u679C\u6587\u6848</button>
          <button class="btn btn-secondary" id="retryBtn">\uD83D\uDD04 \u91CD\u65B0\u6D4B\u8BD5</button>
        </div>
        <div class="footer">\u5FEB\u53BB\u5C0F\u7EA2\u4E66\u5206\u4EAB\u4F60\u7684\u7ED3\u679C\u5427\uFF01 \uD83D\uDCF8</div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `\u6211\u7684\u604B\u7231\u4EBA\u683C\u662F"${t.zh}" ${t.emoji}\n\u4F60\u7684\u5462\uFF1F\u6765\u6D4B\u8BD5\u4E00\u4E0B\u5427\uFF01`;
      if (navigator.clipboard) { navigator.clipboard.writeText(txt); }
      const btn = s.getElementById('shareBtn');
      btn.textContent = '\u5DF2\u590E\u5236!';
      setTimeout(() => btn.textContent = '\u590D\u5236\u7ED3\u679C\u6587\u6848', 2000);
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('love-quiz', LoveQuiz);
