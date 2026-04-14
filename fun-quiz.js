/**
 * Fun Quiz (4D Personality) \u2014 Wix Custom Element
 * Huggy \u7CBE\u795E\u72B6\u6001\u9274\u5B9A - Vanilla JS Web Component
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
      {zh:'\u4F60\u5728\u793E\u4EA4\u573A\u5408\u4E2D\uFF0C\u901A\u5E38\u662F\u4E2A\u4EC0\u4E48\u6837\u7684\u4EBA\uFF1F',options:[{text:'\u5174\u594B\u5F97\u50CF\u53EA\u5C0F\u72D7\uFF0C\u89C1\u4EBA\u5C31\u8981\u548C\u4ED6\u4EEC\u6210\u4E3A\u670B\u53CB',scores:[2,2,0,2]},{text:'\u6BD4\u8F83\u968F\u548C\uFF0C\u770B\u5FC3\u60C5\u548C\u5BF9\u65B9',scores:[1,1,0,1]},{text:'\u51B7\u9759\u89C2\u5BDF\u8005\uFF0C\u5B81\u53EF\u8EB2\u5728\u89D2\u843D\u4E5F\u4E0D\u4E3B\u52A8\u793E\u4EA4',scores:[0,0,0,0]}]},
      {zh:'\u665A\u4E0A11\u70B9\uFF0C\u4F60\u901A\u5E38\u5728\u505A\u4EC0\u4E48\uFF1F',options:[{text:'\u8FD8\u5728\u55E8\uFF0C\u521A\u51C6\u5907\u5F00\u59CB\u591C\u751F\u6D3B',scores:[0,0,2,0]},{text:'\u53EF\u80FD\u8FD8\u9192\u7740\uFF0C\u770B\u770B\u624B\u673A',scores:[0,0,1,0]},{text:'\u65E9\u5C31\u7761\u4E86\uFF0C\u4E3A\u4E86\u660E\u65E9\u4E94\u70B9\u7684\u745C\u4F3D\u8BFE',scores:[0,0,0,0]}]},
      {zh:'\u6709\u4EBA\u8BF4\u4F60\u574F\u8BDD\u4E86\uFF0C\u4F60\u7684\u53CD\u5E94\u662F\uFF1A',options:[{text:'\u5F53\u4F17\u5435\u8D57\u6765\uFF0C\u975E\u8981\u8FA9\u51FA\u4E2A\u8F93\u8D62\u4E0D\u53EF',scores:[2,2,0,0]},{text:'\u6709\u70B9\u751F\u6C14\uFF0C\u4F46\u51B3\u5B9A\u5148\u51B7\u9759\u4E00\u4E0B\u518D\u8BF4',scores:[1,1,0,0]},{text:'\u5475\u5475\uFF0C\u6211\u672C\u6765\u5C31\u8FD9\u6837\uFF0C\u968F\u4FBF\u5427',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u6700\u559C\u6B22\u7684\u5DE5\u4F5C\u73AF\u5883\u662F\u4EC0\u4E48\u6837\u7684\uFF1F',options:[{text:'\u56E2\u961F\u5408\u4F5C\uFF0C\u8D8A\u591A\u4EBA\u4E00\u8D77\u505A\u4E8B\u8D8A\u55E8',scores:[2,0,0,2]},{text:'\u6709\u5408\u4F5C\u4E5F\u6709\u72EC\u7ACB\u7A7A\u95F4',scores:[1,0,0,1]},{text:'\u72EC\u7ACB\u5B8C\u6210\uFF0C\u8D8A\u5C11\u6253\u6270\u8D8A\u597D',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u662F\u90A3\u79CD\u4F1A\u4E3A\u4E86\u5C0F\u4E8B\u751F\u6C14\u597D\u51E0\u5929\u7684\u4EBA\u5417\uFF1F',options:[{text:'\u4F1A\u554A\uFF01\u6211\u5C31\u662F\u4E2A\u5927\u620F\u7CBE\uFF0C\u5C0F\u4E8B\u80FD\u6298\u817E\u4E00\u5468',scores:[0,2,0,0]},{text:'\u6709\u65F6\u5019\u4F1A\uFF0C\u770B\u60C5\u51B5',scores:[0,1,0,0]},{text:'\u4E0D\u4F1A\uFF0C\u6211\u65E9\u5C31\u653E\u4E0B\u4E86',scores:[0,0,0,0]}]},
      {zh:'\u65E9\u4E0A\u8D57\u5E8A\u5BF9\u4F60\u6765\u8BF4\u6709\u591A\u56F0\u96BE\uFF1F',options:[{text:'\u65E9\u8D57\uFF1F\u6839\u672C\u505A\u4E0D\u5230\u3002\u6211\u662F\u591C\u732B\u5B50\uFF0C\u4E03\u70B9\u524D\u53EBu6211\u8D57\u5E8A\u7B49\u4E8E\u8C0B\u6740',scores:[0,0,2,0]},{text:'\u53EF\u4EE5\u63A5\u53D7\uFF0C\u867D\u7136\u6709\u70B9\u56F0',scores:[0,0,1,0]},{text:'\u7231\u6B7B\u4E86\u65E9\u8D57\uFF01\u65B0\u7684\u4E00\u5929\uFF0C\u65B0\u7684\u53EF\u80FD\uFF01',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u5728\u4E00\u6BB5\u611F\u60C5\u4E2D\u901A\u5E38\u662F\u4EC0\u4E48\u89D2\u8272\uFF1F',options:[{text:'\u6211\u9700\u8981\u53E6\u4E00\u534A24\u5C0F\u65F6\u966A\u4F34\u548C\u786E\u8BA4\uFF0C\u5206\u5F00\u4E94\u5206\u949F\u6211\u5C31\u5F00\u59CB\u60F3\u5FF5',scores:[0,0,0,2]},{text:'\u9700\u8981\u4E00\u5B9A\u7684\u966A\u4F34\uFF0C\u4F46\u4E5F\u5C0A\u91CD\u5BF9\u65B9\u7684\u72EC\u7ACB\u7A7A\u95F4',scores:[0,0,0,1]},{text:'\u6211\u5F88\u72EC\u7ACB\uFF0C\u6709\u70B9\u7C98\u4EBA\u7684\u5BF9\u65B9\u4F1A\u8BA9\u6211\u7A92\u606F',scores:[0,0,0,0]}]},
      {zh:'\u5468\u672B\u5B85\u5728\u5BB6\u91CC\uFD0C\u4F60\u4F1A\u505A\u4EC0\u4E48\uFF1F',options:[{text:'\u4E0D\u884C\uFF01\u6211\u8981\u51FA\u95E8\u55E8\uFF0C\u5728\u5BB6\u4F1A\u95F7\u6B7B\uFF01',scores:[2,0,0,0]},{text:'\u53EF\u80FD\u51FA\u95E8\u4E5F\u53EF\u40FD\u5728\u5BB6\uFF0C\u770B\u5FC3\u60C5',scores:[1,0,0,0]},{text:'\u5B8C\u7F8E\uFF01\u5F85\u5728\u5BB6\u91CC\u770B\u5267\u3001\u7761\u89C9\u3001\u517B\u751F',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u662F\u4E2A\u5BB9\u6613\u54ED\u7684\u4EBA\u5417\uFF1F',options:[{text:'\u8D85\u5BB9\u6613\uFF01\u770B\u4E2A\u5E7F\u544A\u90FD\u80FD\u54ED\uFF0C\u6211\u5C31\u662F\u4E2A\u611F\u60C5\u7528\u4E8B\u7684\u4EBA',scores:[0,2,0,0]},{text:'\u6709\u65F6\u5019\uFF0C\u5728\u7279\u5B9A\u7684\u60C5\u51B5\u4E0B',scores:[0,1,0,0]},{text:'\u5F88\u5C11\u54ED\uFF0C\u57FA\u672C\u63A7\u5236\u4F4F\u4E86',scores:[0,0,0,0]}]},
      {zh:'\u5F53\u538B\u529B\u5927\u7684\u65F6\u5019\uFF0C\u4F60\u7684\u8868\u73B0\u662F\uFF1A',options:[{text:'\u5F7B\u5E95\u5D29\u6E83\uFF0C\u5230\u5904\u53D1\u6CC4\u60C5\u7EEA\uFF0C\u9700\u8981\u522B\u4EBA\u6765\u5B89\u6170\u6211',scores:[2,2,0,2]},{text:'\u6709\u70B9\u70E6\u8E81\uFF0C\u4F46\u8BD5\u7740\u81EA\u5DF1\u8C03\u8282',scores:[1,1,0,1]},{text:'\u5B89\u5B9A\u5982\u5E38\uFF0C\u4EC0\u4E48\u80FD\u8BA9\u6211\u52A8\u6447',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u548C\u670B\u53CB\u7684\u6C9F\u901A\u9891\u7387\u662F\uFF1F',options:[{text:'\u6BCF\u5929\u90FD\u4981\u804A\uFF0C\u5982\u679C\u670B\u53CB\u4E0D\u56DE\u6211\u6D88\u606F\u6211\u5C31\u5F00\u59CB\u7126\u8651',scores:[0,0,0,2]},{text:'\u7ECF\u5E38\u804A\uFF0C\u4F46\u4E5F\u4E0D\u4F1A\u592A\u9891\u7E41',scores:[0,0,0,1]},{text:'\u5076\u5C14\u804A\uFF0C\u6211\u4EEC\u90FD\u5F88\u72EC\u7ACB',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u6700\u8BA8\u538C\u4EC0\u4E48\u7C3B\u578B\u7684\u4EBA\uFF1F',options:[{text:'\u65E0\u804A\u7684\u4EBA\uFF01\u6211\u8BA8\u538C\u6CA1\u6709\u70ED\u60C5\u7684\u4EBA',scores:[2,0,0,0]},{text:'\u592A\u8FC7\u5206\u7684\u4EBA\uFF0C\u4E0D\u7BA1\u54EA\u4E2A\u65B9\u5411',scores:[1,0,0,0]},{text:'\u7279\u522B\u7231\u9ECF\u4EBA\u548C\u60C5\u7EEA\u8FC7\u4E8E\u590D\u6742\u7684\u4EBA',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u662F\u4E2A\u591C\u95F4\u5DE5\u4F5C\u6548\u7387\u9AD8\u7684\u4EBA\u5417\uFF1F',options:[{text:'\u5F53\u7136\uFF01\u591C\u665A\u6211\u624D\u662F\u771F\u6B63\u7684\u81EA\u5DF1\uFF0C\u8D8A\u665A\u8D8A\u6709\u7075\u611F',scores:[0,0,2,0]},{text:'\u8FD8\u597D\uFF0C\u65E9\u665A\u90FD\u5DEE\u4E0D\u591A',scores:[0,0,1,0]},{text:'\u4E0D\u662F\uFF0C\u65E9\u4E0A\u6548\u7387\u6700\u9AD8',scores:[0,0,0,0]}]},
      {zh:'\u4E00\u4E2A\u4EBA\u5403\u996D\u5BF9\u4F60\u6765\u8BF4\uFF1A',options:[{text:'\u5F88\u96BE\u53D7\uFF0C\u6211\u9700\u8981\u6709\u4EBA\u5728\u8EAB\u4FB5',scores:[0,0,0,2]},{text:'\u8FD8\u597D\u5427\uFF0C\u5076\u5C14\u4E00\u4E2A\u4EBA\u4E5F\u53EF\u4EE5',scores:[0,0,0,1]},{text:'\u723D\u554A\uFF01\u4E00\u4E2A\u4EBA\u5403\u996D\u6700\u81EA\u7531',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u5BF9\u751F\u6D3B\u4E2D\u7684\u53D8\u5316\u548C\u5192\u9669\u7684\u6001\u5EA6\u662F\uFF1A',options:[{text:'\u8D45\u7EA7\u5174\u594B\uFF01\u6211\u70ED\u7231\u5192\u9669\u548C\u65B0\u7684\u4F53\u9A8C',scores:[2,0,0,0]},{text:'\u6709\u70B9\u7D27\u5F20\uFF0C\u4F46\u613F\u610F\u5C1D\u8BD5',scores:[1,0,0,0]},{text:'\u6211\u559C\u6B22\u7A33\u5B9A\u7684\u751F\u6D3B\uFF0C\u53D8\u5316\u592A\u591A\u4F1A\u8BA9\u6211\u4E0D\u9002\u5E94',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u4F1A\u56E0\u4E3A\u522B\u4EBA\u7684\u60C9\u7EEA\u800C\u5F71\u54CD\u81EA\u5DF1\u7684\u5FC3\u60C5\u5417\uFF1F',options:[{text:'\u4F1A\u554A\uFF01\u6211\u7279\u522B\u5BB9\u6613\u88AB\u5E26\u52A8\uFF0C\u522B\u4EBA\u96BE\u53D7\u6211\u4E5F\u96BE\u53D7',scores:[0,2,0,2]},{text:'\u6709\u70B9\u5F71\u54CD\uFF0C\u4F46\u80FD\u8C03\u8282',scores:[0,1,0,1]},{text:'\u4E0D\u592A\u4F1A\uFF0C\u6211\u80FD\u4FDD\u6301\u7406\u6027',scores:[0,0,0,0]}]},
      {zh:'\u5728\u7231\u597D\u4E0A\uFF0C\u4F60\u662F\u6DF1\u5EA6\u7231\u597D\u8005\u8FD8\u662F\u6D45\u5C1D\u8F84\u6B62\uFF1F',options:[{text:'\u7EDD\u5BF9\u7684\u6DF1\u5EA6\u7231\u597D\u8005\uFF0C\u4E00\u65E6\u559C\u6B22\u5C31\u5E9F\u5BDD\u5FD8\u98DF',scores:[2,2,0,0]},{text:'\u4ECB\u4E8E\u4E24\u8005\u4E4B\u95F4',scores:[1,1,0,0]},{text:'\u6D45\u5C1D\u8F84\u6B62\uFF0C\u6211\u559C\u6B22\u4F53\u9A8C\u5404\u79CD\u4E0D\u540C\u7684\u4E1C\u497F',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u505A\u8FC7\u6700\u51B2\u52A8\u7684\u4E8B\u60C5\u662F\u4EC0\u4E48\uFF1F',options:[{text:'\u5F88\u591A\u554A\uFF01\u6211\u5C31\u662F\u4E2A\u51B2\u52A8\u9B3C\uFF0C\u8BF4\u505A\u5C31\u505A',scores:[2,0,0,0]},{text:'\u6709\u8FC7\uFF0C\u4F46\u901A\u5E38\u6211\u4F1A\u60F3\u6E05\u695A',scores:[1,0,0,0]},{text:'\u5F88\u5C11\uFF0C\u6211\u505A\u4E8B\u5F88\u8C28\u614E',scores:[0,0,0,0]}]},
      {zh:'\u4F60\u5BF9\u5FC3\u7406\u54A8\u8BE2\u7684\u770B\u6CD5\u662F\uFF1A',options:[{text:'\u592A\u597D\u4E86\uFF01\u6211\u9700\u8981\u7ECF\u5E38\u503E\u8BC9\u548C\u88AB\u503E\u542C',scores:[0,0,0,2]},{text:'\u6709\u9700\u8981\u7684\u65F6\u5019\u53EF\u4EE5\u8003\u8651',scores:[0,0,0,1]},{text:'\u6211\u80FD\u81EA\u5DF1\u5904\u7406\uFF0C\u4E0D\u592A\u9700\u8981',scores:[0,0,0,0]}]},
      {zh:'\u6700\u540E\uFF0C\u4F60\u89C9\u5F97\u81EA\u5DF1\u73B0\u5728\u7684\u7CBE\u795E\u72B6\u6001\u662F\uFF1F',options:[{text:'\u6709\u70B9emo\uFF0C\u5BB9\u6613\u7126\u8651\u548C\u4E0D\u5F00\u5FC3',scores:[0,2,2,0]},{text:'\u8FD8\u597D\u5427\uFF0C\u6709\u8D77\u6709\u4F0F',scores:[0,1,1,0]},{text:'\u5F88\u4E0D\u9519\uFF01\u6211\u5F88\u7A33\u5B9A\u548C\u5E73\u9759',scores:[0,0,0,0]}]},
    ];
  }

  get personalityTypes() {
    return {
      'HDNE':{zh:'\u6DF1\u591Cemo\u620F\u7CBE',en:'Night Owl Drama Queen',desc:'\u767D\u5929\u88C5\u6B7B\u665A\u4E0A\u8E66\u8FEA\u7684\u60C5\u7EEA\u8FC7\u5C71\u8F66\u9009\u624B\u3002\u4F60\u7684\u4EBA\u751F\u5C31\u662F\u4E00\u573A\u821E\u53F0\u5267\uFF0C\u9700\u8981\u89C2\u4F17\u548C\u638C\u58F0\u3002\u6DF1\u591C\u624D\u662F\u4F60\u771F\u6B63\u7684\u821E\u53F0\uFF0C\u6B64\u65F6\u4F60\u6700\u6709\u9B45\u529B\u548C\u6D3B\u529B\u3002\u4F46\u4EE3\u4EF7\u662F\u60C5\u7EEA\u6D6E\u52A8\u5F88\u5927\uFF0C\u7279\u522B\u5BB9\u6613\u88AB\u5C0F\u4E8B\u5F71\u54CD\u3002\u4F60\u7684\u670B\u53CB\u9700\u898124\u5C0F\u65F6\u5F85\u547D\u6765\u966A\u4F34\u4F60\u7684\u5404\u79CD\u5927\u559C\u5927\u60B2\u3002'},
      'HDME':{zh:'\u793E\u4EA4\u6838\u5F39',en:'Social Bomb',desc:'\u81EA\u5E26\u80FD\u91CF\u78C1\u573A\u7684\u4EBA\uFF0C\u8D70\u5230\u54EA\u91CC\u90FD\u40FD\u71C3\u8D77\u4E00\u56E2\u706B\u3002\u4F60\u620F\u591A\u3001\u58F0\u97F3\u5927\u3001\u70ED\u60C5\u9AD8\uFF0C\u4F46\u4E5F\u5F88\u5BB9\u6613\u60C5\u7EEA\u5316\u3002\u65E0\u8BBA\u767D\u5929\u9ED1\u591C\uFF0C\u4F60\u90FD\u662F\u751F\u6D3B\u7684\u4E3B\u49D2\u3002\u670B\u53CB\u5708\u91CC\u7684\u4EBA\u90FD\u48AB\u4F60\u7684\u620F\u5267\u6027\u548C\u70ED\u4840\u5438\u5F15\uFF0C\u867D\u7136\u6709\u65F6\u5019\u4F60\u7684\u5F3A\u5EA6\u6709\u70B9"\u6838\u5F39\u7EA7"\u3002'},
      'HDNI':{zh:'\u5348\u591C\u5B64\u72EC\u8005',en:'Midnight Loner',desc:'\u591C\u6DF1\u4EBA\u9759\u65F6\uFF0C\u4F60\u6700\u80FD\u611F\u53D7\u5230\u81EA\u5DF1\u3002\u4F60\u70ED\u60C5\u5374\u5BB9\u6613\u53D7\u4F24\uFF0C\u559C\u6B22\u6DF1\u5EA6\u966A\u4F34\u4F46\u53C8\u60F3\u8981\u72EC\u7ACB\u3002\u8FD9\u79CD\u77DB\u76FE\u8BA9\u4F60\u5728\u5348\u591C\u7279\u522Bemo\u2014\u2014\u65E2\u6E34\u671B\u6709\u4EBA\u966A\uFF0C\u53C8\u5BB3\u6015\u88AB\u9760\u8FD1\u3002\u4F60\u7684\u620F\u5267\u6027\u7ECF\u5E38\u5728\u6DF1\u591C\u7206\u53D1\uFF0C\u7136\u540E\u72EC\u81EA\u6D88\u5316\u3002'},
      'HDMI':{zh:'\u65E9\u8D77\u6311\u6218\u8005',en:'Early Bird Challenger',desc:'\u4F60\u662F\u4E2A\u77DB\u76FE\u4F53\uFF1A\u6E34\u671B\u70ED\u8840\u6CB8\u817E\u7684\u751F\u6D3B\uFF0C\u5374\u53C8\u5728\u65E9\u8D77\u65F6\u7279\u522Bemo\u3002\u4F60\u6709\u65E9\u8D77\u7684\u575A\u6301\u548C\u81EA\u5F8B\uFF0C\u4F46\u5185\u5FC3\u7684\u620F\u7CBE\u4E00\u76F4\u5728\u5435\u95F9\u3002\u7ED3\u679C\u5C31\u662F\u4F60\u767D\u5929\u5F3A\u989C\u6B22\u7B11\uFF0C\u665A\u4E0A\u5C31\u5F00\u59CB\u6389\u773C\u6CEA\u3002'},
      'HSNE':{zh:'\u51B7\u6F20\u6DF1\u591C\u4EBA',en:'Aloof Night Creature',desc:'\u4F60\u662F\u4E2A\u9762\u65E0\u8868\u60C5\u7684\u6DF1\u591C\u7CBE\u602A\u3002\u767D\u5929\u662F\u4E2A\u51B7\u6DE1\u7684\u7075\u9B42\uFF0C\u665A\u4E0A\u4E5F\u4F9D\u7136\u51B7\u6DE1\uFF0C\u4F46\u4F1A\u591A\u51FA\u4E00\u79CD\u4BE1\u5F02\u7684\u9B45\u529B\u3002\u4F60\u9700\u8981\u522B\u4EBA\u7684\u966A\u4F34\u5374\u53C8\u4E0D\u592A\u4F1A\u8868\u8FBE\uFF0C\u5BFC\u81F4\u522B\u4EBA\u5E38\u5E38\u641E\u4E0D\u61C2\u4F60\u7684\u771F\u5B9E\u60F3\u6CD5\u3002'},
      'HSME':{zh:'\u7CBE\u81F4\u65E9\u8D77\u4EBA',en:'Refined Early Riser',desc:'\u4F60\u65E2\u70ED\u7231\u751F\u6D3B\uFF0C\u53C8\u5BF9\u81EA\u5DF1\u8981\u6C42\u6781\u9AD8\u3002\u65E9\u8D77\u505A\u7CBE\u81F4\u7684\u81EA\u5DF1\uFF0C\u767D\u5929\u4FDD\u6301\u51B7\u9759\u4E13\u4E1A\uFF0C\u4F46\u5185\u5FC3\u5176\u5B9E\u5F88\u6709\u60F3\u6CD5\u3002\u4F60\u4E0D\u592A\u4F9D\u8D56\u522B\u4EBA\uFF0C\u559C\u6B22\u72EC\u7ACB\u5B8C\u6210\u4E8B\u60C5\u3002'},
      'HSNI':{zh:'\u72EC\u7ACB\u51B7\u6DE1\u4EBA',en:'Independent Stoic',desc:'\u4F60\u65E2\u70ED\u60C5\u53C8\u51B7\u6DE1\uFF0C\u8FD9\u542C\u8D77\u6765\u5F88\u5947\u602A\uFF0C\u4F46\u4F60\u786E\u5B9E\u5C31\u662F\u8FD9\u6837\u3002\u4F60\u6709\u70ED\u60C5\u53BB\u505A\u4E8B\u60C5\uFF0C\u4F46\u5BF9\u4EBA\u7684\u6001\u5EA6\u5F88\u51B7\u6F20\u3002\u4F60\u60F3\u8981\u81EA\u5DF1\u7684\u7A7A\u95F4\uFF0C\u4E5F\u7ED9\u522B\u4EBA\u7A7A\u95F4\u3002\u8FD9\u79CD\u72EC\u7ACB\u7684\u6C14\u4D28\u4BA9\u4F60\u663E\u5F97\u5F88\u795E\u79D8\u3002'},
      'CDNE':{zh:'\u591C\u732B\u793E\u4EA4\u8FBE\u4EBA',en:'Night Owl Socialite',desc:'\u4F60\u662F\u4E2A\u6709\u70B9\u61D2\u4F46\u5F88\u4F1A\u73A9\u7684\u4EBA\u3002\u767D\u5929\u53EF\u80FD\u6CA1\u4EC0\u4E48\u7CBE\u795E\uFF0C\u4F46\u4E00\u5230\u665A\u4E0A\u5C31\u6D3B\u8FC7\u6765\u4E86\uFF0C\u800C\u4E14\u7279\u522B\u7C98\u4EBA\u3002\u4F60\u7684\u793E\u4EA4\u6B32\u5F88\u5F3A\uFF0C\u7279\u522B\u662F\u5728\u591C\u95F4\u3002'},
      'CDME':{zh:'\u5E73\u8861\u751F\u6D3B\u8005',en:'Life Balancer',desc:'\u4F60\u5C31\u662F\u90A3\u79CD"\u6CA1\u4EC0\u4E48\u7279\u522B\u7684"\u4F46\u5176\u5B9E\u5F88\u8212\u670D\u7684\u4EBA\u3002\u4E0D\u7279\u522B\u4EA2\u594B\u4E5F\u4E0D\u7279\u522B\u51B7\u6F20\uFF0C\u65E9\u665A\u90FD\u5DEE\u4E0D\u591A\uFF0C\u80FD\u63A5\u53D7\u4E00\u5B9A\u7684\u966A\u4F34\u4E5F\u80FD\u63A5\u53D7\u72EC\u5904\u3002\u4F60\u662F\u4E2A\u5F88\u597D\u7684\u670B\u53CB\u2014\u2014\u4E0D\u4F1A\u592A\u7C98\u4E5F\u4E0D\u4F1A\u592A\u51B7\u3002'},
      'CDNI':{zh:'\u61D2\u6563\u72EC\u7ACB\u8005',en:'Lazy Independent',desc:'\u4F60\u662F\u4E2A\u5F88\u61D2\u4F46\u5F88\u72EC\u7ACB\u7684\u4EBA\u3002\u65E2\u4E0D\u4F1A\u4E3A\u4E86\u522B\u4EBA\u6539\u53D8\u4F5C\u606F\uFF0C\u4E5F\u4E0D\u4F1A\u7279\u522B\u7C98\u4EBA\u3002\u4F60\u6709\u81EA\u5DF1\u7684\u8282\u594F\u548C\u7A7A\u95F4\uFF0C\u559C\u6B22\u968F\u610F\u5730\u751F\u6D3B\u3002\u4F60\u7684\u5EA7\u53F3\u94ED\u662F\uFF1A"\u968F\u4FBF\u5427"\u3002'},
      'HSMI':{zh:'\u65E9\u8D77\u61D2\u4EBA',en:'Morning Lazy Person',desc:'\u8FD9\u662F\u4E2A\u6709\u8DA3\u7684\u7EC4\u5408\uFF1A\u4F60\u4E60\u60EF\u65E9\u8D77\uFF0C\u4F46\u5176\u5B9E\u662F\u4E2A\u5FC3\u7406\u4E0A\u5F88\u61D2\u7684\u4EBA\u3002\u4F60\u4E0D\u60F3\u8DDF\u522B\u4EBA\u592A\u7D27\u5BC6\u5730\u8054\u7CFB\uFF0C\u5B81\u53EF\u72EC\u81EA\u4EAB\u53D7\u6E05\u6668\u7684\u5B89\u9759\u3002'},
      'CDMI':{zh:'\u4F5B\u7CFB\u4EBA\u58EB',en:'Buddhist Practitioner',desc:'\u4F60\u662F\u4E2A\u5F7B\u5E95\u7684\u4F5B\u7CFB\u4EBA\u58EB\u3002\u5565\u90FD\u884C\uFF0C\u5565\u90FD\u4E0D\u5728\u4E4E\uFF0C\u8DDF\u7740\u8282\u594F\u8D70\u5C31\u5B8C\u4E8B\u4E86\u3002\u4F60\u4E0D\u4F1A\u4E3A\u5C0F\u4E8B\u751F\u6C14\uFF0C\u4E5F\u4E0D\u4F1A\u7279\u522B\u5174\u594B\u3002\u4F60\u7684\u51FA\u73B0\u5F80\u5F80\u80FD\u8BA9\u5468\u56F4\u7684\u4EBA\u90FD\u51B7\u9759\u4E0B\u6765\u3002'},
      'CSNE':{zh:'\u6DF1\u591Cemo\u4F5B',en:'Night Emo Sage',desc:'\u4F60\u5F88\u77DB\u76FE\uFF1A\u767D\u5929\u5F88\u51B7\u6F20\u4F5B\u7CFB\uFF0C\u5230\u4E86\u6DF1\u591C\u5C31\u53D8\u6210\u4E86emo\u7684\u5C0F\u53EF\u601C\u3002\u4F60\u5F88\u7C98\u4EBA\u5374\u53C8\u4E0D\u60F3\u627F\u8BA4\uFF0C\u7ECF\u5E38\u5728\u534A\u591C\u53D1\u81EA\u62CD\u8BF4"\u6211\u5F88\u597D\u5566"\uFF0C\u7136\u540F\u53C8\u5F00\u59CB\u6389\u773C\u6CEA\u3002'},
      'CSME':{zh:'\u65E9\u8D77\u517B\u751F\u4F5B',en:'Early Bird Wellness Sage',desc:'\u516E\u70B9\u8D77\u5E8A\u6CE1\u67B8\u675E\u7684\u7CBE\u795E\u4001\u5E72\u90E8\u3002\u4F60\u6709\u81EA\u5DF1\u660E\u786E\u7684\u751F\u6D3B\u4BA1\u5212\uFF0C\u65E9\u8D77\u505A\u745C\u4F3D\u3001\u559D\u517B\u751F\u8336\u3002\u4F60\u5F88\u5E73\u9759\u51B7\u6F20\uFF0C\u4F46\u5BF9\u81EA\u5DF1\u5F88\u6709\u8981\u6C42\u3002'},
      'CSNI':{zh:'\u5B64\u72EC\u4FEE\u884C\u8005',en:'Solitary Practitioner',desc:'\u4F60\u662F\u4E2A\u5F7B\u5E95\u7684\u72EC\u884C\u4FA0\u3002\u51B7\u6F20\u3001\u5E73\u9759\u3001\u72EC\u7ACB\uFF0C\u5B8C\u5168\u4E0D\u9700\u8981\u522B\u4EBA\u3002\u4F60\u7684\u60C5\u7EEA\u5F88\u7A33\u5B9A\uFF0C\u56E0\u4E3A\u4F60\u5F88\u5C11\u5BF9\u4EFB\u4F55\u4E8B\u60C5\u4EA7\u751F\u5F3A\u70C8\u7684\u611F\u53D7\u3002'},
      'CSMI':{zh:'\u5B89\u5B9A\u4FEE\u58EB',en:'Serene Monk',desc:'\u4F60\u5DF2\u7ECF\u8FBE\u5230\u4E86"\u4F5B"\u7684\u6700\u9AD8\u5883\u754C\u3002\u65E2\u4E0D\u9700\u8981\u522B\u4EBA\u7684\u966A\u4F34\uFF0C\u4E5F\u4E0D\u9700\u8981\u523A\u6FC0\u7684\u751F\u6D3B\u3002\u4F60\u6709\u89C4\u5F8B\u7684\u4F5C\u606F\uFF0C\u5E73\u9759\u7684\u5FC3\u6001\uFF0C\u5F88\u5C11\u88AB\u5916\u754C\u6253\u6270\u3002\u4F60\u6D3B\u5F97\u6700\u81EA\u5728\u3002'},
    };
  }

  get dimLabels() {
    return [
      {left:'H (Hot)',leftEmoji:'\uD83D\uDD25',right:'C (Cold)',rightEmoji:'\u2744\uFE0F',name:'\u80FD\u91CF\u6C34\u5E73'},
      {left:'D (Drama)',leftEmoji:'\uD83C\uDFAD',right:'S (Stoic)',rightEmoji:'\uD83E\uDDCA',name:'\u60C5\u7EEA\u8868\u8FBE'},
      {left:'N (Night)',leftEmoji:'\uD83C\uDF19',right:'M (Morning)',rightEmoji:'\u2600\uFE0F',name:'\u751F\u6D3B\u4282\u594F'},
      {left:'E (Emotional)',leftEmoji:'\uD83E\uDEC2',right:'I (Independent)',rightEmoji:'\uD83D\uDDE1\uFE0F',name:'\u4F9D\u8D56\u7A0B\u5EA6'},
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
        <div class="emoji">\u2728</div>
        <div class="title">Huggy \u7CBE\u795E\u72B6\u6001\u9274\u5B9A</div>
        <div class="sub">\u6B63\u7ECF\u4EBA\u8C01\u505AMBTI\u554A\uFF1F</div>
        <div class="dims">
          ${this.dimLabels.map(d => `<div class="dim-card">${d.leftEmoji} <span class="dim-vs">${d.left}</span> vs ${d.rightEmoji} ${d.right}</div>`).join('')}
        </div>
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
          <span class="htitle">\u4F60\u7684\u7C7B\u578B</span>
          <div></div>
        </div>
        <div class="result-card">
          <div class="rcode">${this.resultCode}</div>
          <div class="rname">${t.zh}</div>
          <div class="rdesc">${t.desc}</div>
        </div>
        <div class="dims-section">
          <div class="dims-title">\u56DB\u7EF4\u5206\u6790</div>
          ${dimBars}
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="shareBtn">\u5206\u4EAB\u7ED3\u679C</button>
          <button class="btn btn-secondary" id="retryBtn">\u91CD\u65B0\u6D4B\u8BD5</button>
        </div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `\u6211\u662FHuggy\u7CBE\u795E\u72B6\u6001\u9274\u5B9A\u4E2D\u7684${t.zh}\uFF08${this.resultCode}\uFF09\uFF01`;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      if (navigator.share) navigator.share({title:'Huggy\u7CBE\u795E\u72B6\u6001\u9274\u5B9A',text:txt});
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('fun-quiz', FunQuiz);
