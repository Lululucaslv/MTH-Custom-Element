/**
 * Fun Quiz (4D Personality) â Wix Custom Element
 * Huggy ç²¾ç¥ç¶æé´å® - Vanilla JS Web Component
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
      {zh:'ä½ å¨ç¤¾äº¤åºåä¸­ï¼éå¸¸æ¯ä¸ªä»ä¹æ ·çäººï¼',options:[{text:'å´å¥å¾ååªå°çï¼è§äººå°±è¦åä»ä»¬æä¸ºæå',scores:[2,2,0,2]},{text:'æ¯è¾éåï¼çå¿æåå¯¹æ¹',scores:[1,1,0,1]},{text:'å·éè§å¯èï¼å®å¯èº²å¨è§è½ä¹ä¸ä¸»å¨ç¤¾äº¤',scores:[0,0,0,0]}]},
      {zh:'æä¸11ç¹ï¼ä½ éå¸¸å¨åä»ä¹ï¼',options:[{text:'è¿å¨å¨ï¼ååå¤å¼å§å¤çæ´»',scores:[0,0,2,0]},{text:'å¯è½è¿éçï¼ççææº',scores:[0,0,1,0]},{text:'æ©å°±ç¡äºï¼ä¸ºäºææ©äºç¹ççä¼è¯¾',scores:[0,0,0,0]}]},
      {zh:'æäººè¯´ä½ åè¯äºï¼ä½ çååºæ¯ï¼',options:[{text:'å½ä¼åµèµ·æ¥ï¼éè¦è¾©åºä¸ªè¾èµ¢ä¸å¯',scores:[2,2,0,0]},{text:'æç¹çæ°ï¼ä½å³å®åå·éä¸ä¸åè¯´',scores:[1,1,0,0]},{text:'åµåµï¼ææ¬æ¥å°±è¿æ ·ï¼éä¾¿å§',scores:[0,0,0,0]}]},
      {zh:'ä½ æåæ¬¢çå·¥ä½ç¯å¢æ¯ä»ä¹æ ·çï¼',options:[{text:'å¢éåä½ï¼è¶å¤äººä¸èµ·åäºè¶å¨',scores:[2,0,0,2]},{text:'æåä½ä¹æç¬ç«ç©ºé´',scores:[1,0,0,1]},{text:'ç¬ç«å®æï¼è¶å°ææ°è¶å¥½',scores:[0,0,0,0]}]},
      {zh:'ä½ æ¯é£ç§ä¼ä¸ºäºå°äºçæ°å¥½å å¤©çäººåï¼',options:[{text:'ä¼åï¼æå°±æ¯ä¸ªå¤§æç²¾ï¼å°äºè½æè¾ä¸å¨',scores:[0,2,0,0]},{text:'ææ¶åä¼ï¼çæåµ',scores:[0,1,0,0]},{text:'ä¸ä¼ï¼ææ©å°±æ¾ä¸äº',scores:[0,0,0,0]}]},
      {zh:'æ©ä¸èµ·åºå¯¹ä½ æ¥è¯´æå¤å°é¾ï¼',options:[{text:'æ©èµ·ï¼æ ¹æ¬åä¸å°ãææ¯å¤ç«å­ï¼ä¸ç¹åå«æèµ·åºç­äºè°æ',scores:[0,0,2,0]},{text:'å¯ä»¥æ¥åï¼è½ç¶æç¹å°',scores:[0,0,1,0]},{text:'ç±æ­»äºæ©èµ·ï¼æ°çä¸å¤©ï¼æ°çå¯è½ï¼',scores:[0,0,0,0]}]},
      {zh:'ä½ å¨ä¸æ®µææä¸­éå¸¸æ¯ä»ä¹è§è²ï¼',options:[{text:'æéè¦å¦ä¸å24å°æ¶éªä¼´åç¡®è®¤ï¼åå¼äºåéæå°±å¼å§æ³å¿µ',scores:[0,0,0,2]},{text:'éè¦ä¸å®çéªä¼´ï¼ä½ä¹å°éå¯¹æ¹çç¬ç«ç©ºé´',scores:[0,0,0,1]},{text:'æå¾ç¬ç«ï¼æç¹ç²äººçå¯¹æ¹ä¼è®©æçªæ¯',scores:[0,0,0,0]}]},
      {zh:'å¨æ«å®å¨å®¶éï¼ä½ ä¼åä»ä¹ï¼',options:[{text:'ä¸è¡ï¼æè¦åºé¨å¨ï¼å¨å®¶ä¼é·æ­»ï¼',scores:[2,0,0,0]},{text:'å¯è½åºé¨ä¹å¯è½å¨å®¶ï¼çå¿æ',scores:[1,0,0,0]},{text:'å®ç¾ï¼å¾å¨å®¶éçå§ãç¡è§ãå»ç',scores:[0,0,0,0]}]},
      {zh:'ä½ æ¯ä¸ªå®¹æå­çäººåï¼',options:[{text:'è¶å®¹æï¼çä¸ªå¹¿åé½è½å­ï¼æå°±æ¯ä¸ªææç¨äºçäºº',scores:[0,2,0,0]},{text:'ææ¶åï¼å¨ç¹å®çæåµä¸',scores:[0,1,0,0]},{text:'å¾å°å­ï¼åºæ¬æ§å¶ä½äº',scores:[0,0,0,0]}]},
      {zh:'å½ååå¤§çæ¶åï¼ä½ çè¡¨ç°æ¯ï¼',options:[{text:'å½»åºå´©æºï¼å°å¤åæ³æç»ªï¼éè¦å«äººæ¥å®æ°æ',scores:[2,2,0,2]},{text:'æç¹ç§èºï¼ä½è¯çèªå·±è°è',scores:[1,1,0,1]},{text:'å®å®å¦å¸¸ï¼ä»ä¹è½è®©æå¨æ',scores:[0,0,0,0]}]},
      {zh:'ä½ åæåçæ²éé¢çæ¯ï¼',options:[{text:'æ¯å¤©é½è¦èï¼å¦ææåä¸åææ¶æ¯æå°±å¼å§ç¦è',scores:[0,0,0,2]},{text:'ç»å¸¸èï¼ä½ä¹ä¸ä¼å¤ªé¢ç¹',scores:[0,0,0,1]},{text:'å¶å°èï¼æä»¬é½å¾ç¬ç«',scores:[0,0,0,0]}]},
      {zh:'ä½ æè®¨åä»ä¹ç±»åçäººï¼',options:[{text:'æ èçäººï¼æè®¨åæ²¡æç­æçäºº',scores:[2,0,0,0]},{text:'å¤ªè¿åçäººï¼ä¸ç®¡åªä¸ªæ¹å',scores:[1,0,0,0]},{text:'ç¹å«ç±é»äººåæç»²è¿äºå¤æçäºº',scores:[0,0,0,0]}]},
      {zh:'ä½ æ¯ä¸ªå¤é´å·¥ä½æçé«çäººåï¼',options:[{text:'å½ç¶ï¼å¤ææææ¯çæ­£çèªå·±ï¼è¶æè¶æçµæ',scores:[0,0,2,0]},{text:'è¿å¥½ï¼æ©æé½å·®ä¸å¤',scores:[0,0,1,0]},{text:'ä¸æ¯ï¼æ©ä¸æçæé«',scores:[0,0,0,0]}]},
      {zh:'ä¸ä¸ªäººåé¥­å¯¹ä½ æ¥è¯´ï¼',options:[{text:'å¾é¾åï¼æéè¦æäººå¨èº«è¾¹',scores:[0,0,0,2]},{text:'è¿å¥½å§ï¼å¶å°ä¸ä¸ªäººä¹å¯ä»¥',scores:[0,0,0,1]},{text:'ç½åï¼ä¸ä¸ªäººåé¥­æèªç±',scores:[0,0,0,0]}]},
      {zh:'ä½ å¯¹çæ´»ä¸­çååååé©çæåº¦æ¯ï¼',options:[{text:'è¶çº§å´å¥ï¼æç­ç±åé©åæ°çä½éª',scores:[2,0,0,0]},{text:'æç¹ç´§å¼ ï¼ä½æ¿æå°è¯',scores:[1,0,0,0]},{text:'æåæ¬¢ç¨³å®ççæ´»ï¼ååå¤ªå¤ä¼è®©æä¸éåº',scores:[0,0,0,0]}]},
      {zh:'ä½ ä¼å ä¸ºå«äººçæç»ªèå½±åèªå·±çå¿æåï¼',options:[{text:'ä¼åï¼æç¹å«å®¹æè¢«å¸¦å¨ï¼å«äººé¾åæä¹é¾å',scores:[0,2,0,2]},{text:'æç¹å½±åï¼ä½è½è°è',scores:[0,1,0,1]},{text:'ä¸å¤ªä¼ï¼æè½ä¿æçæ§',scores:[0,0,0,0]}]},
      {zh:'å¨ç±å¥½ä¸ï¼ä½ æ¯æ·±åº¦ç±å¥½èè¿æ¯æµå°è¾æ­¢ï¼',options:[{text:'ç»å¯¹çæ·±åº¦ç±å¥½èï¼ä¸æ¦åæ¬¢å°±åºå¯å¿é£',scores:[2,2,0,0]},{text:'ä»äºä¸¤èä¹é´',scores:[1,1,0,0]},{text:'æµå°è¾æ­¢ï¼æåæ¬¢ä½éªåç§ä¸åçä¸è¥¿',scores:[0,0,0,0]}]},
      {zh:'ä½ åè¿æå²å¨çäºææ¯ä»ä¹ï¼',options:[{text:'å¾å¤åï¼æå°±æ¯ä¸ªå²å¨é¬¼ï¼è¯´åå°±å',scores:[2,0,0,0]},{text:'æè¿ï¼ä½éå¸¸æä¼æ³æ¸æ¥',scores:[1,0,0,0]},{text:'å¾å°ï¼æåäºå¾è°¨æ',scores:[0,0,0,0]}]},
      {zh:'ä½ å¯¹å¿çå¨è¯¢ççæ³æ¯ï¼',options:[{text:'å¤ªå¥½äºï¼æéè¦ç»å¸¸å¾è¯åè¢«å¾å«',scores:[0,0,0,2]},{text:'æéè¦çæ¶åå¯ä»¥èè',scores:[0,0,0,1]},{text:'æè½èªå·±å¤çï¼ä¸å¤ªéè¦',scores:[0,0,0,0]}]},
      {zh:'æåï¼ä½ è§å¾èªå·±ç°å¨çç²¾ç¥ç¶ææ¯ï¼',options:[{text:'æç¹emoï¼å®¹æç¦èåä¸å¼å¿',scores:[0,2,2,0]},{text:'è¿å¥½å§ï¼æèµ·æä¼',scores:[0,1,1,0]},{text:'å¾ä¸éï¼æå¾ç¨³å®åå¹³é',scores:[0,0,0,0]}]},
    ];
  }

  get personalityTypes() {
    return {
      'HDNE':{zh:'æ·±å¤emoæç²¾',en:'Night Owl Drama Queen',desc:'ç½å¤©è£æ­»æä¸è¹¦è¿©çæç»ªè¿å±±è½¦éæãä½ çäººçå°±æ¯ä¸åºèå°å§ï¼éè¦è§ä¼åæ¬å£°ãæ·±å¤ææ¯ä½ çæ­£çèå°ï¼æ­¤æ¶ä½ ææé­ååæ´»åãä½ä»£ä»·æ¯æç»ªæµ®å¨å¾å¤§ï¼ç¹å«å®¹æè¢«å°äºå½±å¿ãä½ çæåéè¦24å°æ¶å¾å½æ¥éªä¼´ä½ çåç§å¤§åå¤§æ²ã'},
      'HDME':{zh:'ç¤¾äº¤æ ¸å¼¹',en:'Social Bomb',desc:'èªå¸¦è½éç£åºçäººï¼èµ°å°åªéé½è½çèµ·ä¸å¢ç«ãä½ æå¤ãå£°é³å¤§ãç­æé«ï¼ä½ä¹å¾å®¹ææç»ªåãæ è®ºç½å¤©é»å¤ï¼ä½ é½æ¯çæ´»çä¸»è§ãæååéçäººé½è¢«ä½ çæå§æ§åç­è¡å¸å¼ï¼è½ç¶ææ¶åä½ çå¼ºåº¦æç¹"æ ¸å¼¹çº§"ã'},
      'HDNI':{zh:'åå¤å­¤ç¬è',en:'Midnight Loner',desc:'å¤æ·±äººéæ¶ï¼ä½ æè½æåå°èªå·±ãä½ ç­æå´å®¹æåä¼¤ï¼åæ¬¢æ²·åº¦éªä¼´ä½åæ³è¦ç¬ç«ãè¿ç§çç¾è®©ä½ å¨åå¤ç¹å«emoââæ¢æ¸´ææäººéªï¼åå®³æè¢«é è¿ãä½ çæå§æ§ç»å¸¸å¨æ·±å¤çåï¼ç¶åç¬èªæ¶åã'},
      'HDMI':{zh:'æ©èµ·ææè',en:'Early Bird Challenger',desc:'ä½ æ¯ä¸ªçç¾ä½ï¼æ¸´æç­è¡æ²¸è¾ççæ´»ï¼å´åå¨æ©èµ·æ¶ç¹å«emoãä½ ææ©èµ·çåæåèªå¾ï¼ä½åå¿çæç²¾ä¸ç´å¨åµé¹ãç»æå°±æ¯ä½ ç½å¤©å¼ºé¢æ¬ ç¬ï¼æä¸å°±å¼å§æç¼æ³ªã'},
      'HSNE':{zh:'å·æ¼ æ·±å¤äºº',en:'Aloof Night Creature',desc:'ä½ æ¯ä¸ªé¢æ è¡¨æçæ·±å¤ç²¾æªãç½å¤©æ¯ä¸ªå·æ·¡ççµé­ï¼æä¸ä¹ä¾ç¶å·æ·¡ï¼ä½ä¼å¤åºä¸ç§è¯¡å¼çé­åãä½ éè¦å«äººçéªä¼´å´åä¸å¤ªä¼è¡¨è¾¾ï¼å¯¼è´å«äººå¸¸å¸¸æä¸æä½ ççå®æ³æ³ã'},
      'HSME':{zh:'ç²¾è´æ©èµ·äºº',en:'Refined Early Riser',desc:'ä½ æ¢ç­ç±çæ´»ï¼åå¯¹èªå·±è¦æ±æé«ãæ©èµ·åç²¾è´çèªå·±ï¼ç½å¤©ä¿æå·éä¸ä¸ï¼ä½åå¿å¶å®å¾ææ³æ³ãä½ ä¸å¤ªä¾èµå«äººï¼åæ¬¢ç¬ç«å®æäºæã'},
      'HSNI':{zh:'ç¬ç«å·æ·¡äºº',en:'Independent Stoic',desc:'ä½ æ¢ç­æåå·æ·¡ï¼è¿å¬èµ·æ¥å¾å¥æªï¼ä½ä½ ç¡®å®å°±æ¯è¿æ ·ãä½ æç­æå»åäºæï¼ä½å¯¹äººçæåº¦å¾å·æ¼ ãä½ æ³è¦èªå·±çç©ºé´ï¼ä¹ç»å«äººç©ºé´ãè¿ç§ç¬ç«çæ°è´¨è®©ä½ æ¾å¾å¾ç¥ç§ã'},
      'CDNE':{zh:'å¤ç«ç¤¾äº¤è¾¾äºº',en:'Night Owl Socialite',desc:'ä½ æ¯ä¸ªæç¹æä½å¾ä¼ç©çäººãç½å¤©å¯è½æ²¡ä»ä¹ç²¾ç¥ï¼ä½ä¸å°æä¸å°±æ´»è¿æ¥äºï¼èä¸ç¹å«ç²äººãä½ çç¤¾äº¤æ¬²å¾å¼ºï¼ç¹å«æ¯å¨å¤é´ã'},
      'CDME':{zh:'å¹³è¡¡çæ´»è',en:'Life Balancer',desc:'ä½ å°±æ¯é£ç§"æ²¡ä»ä¹ç¹å«ç"ä½å¶å®å¾èæçäººãä¸ç¹å«äº¢å¥ä¹ä¸ç¹å«å·æ¼ ï¼æ©æé½å·®ä¸å¤ï¼è½æ¥åä¸å®çéªä¼´ä¹è½æ¥åç¬å¤ãä½ æ¯ä¸ªå¾å¥½çæåââä¸ä¼å¤ªç²ä¹ä¸ä¼å¤ªå·ã'},
      'CDNI':{zh:'ææ£ç¬ç«è',en:'Lazy Independent',desc:'ä½ æ¯ä¸ªå¾æä½å¾ç¬ç«çäººãæ¢ä¸ä¼ä¸ºäºå«äººæ¹åä½æ¯ï¼ä¹ä¸ä¼ç¹å«ç²äººãä½ æèªå·±çèå¥åç©ºé´ï¼åæ¬¢éæå°çæ´»ãä½ çåº§å³é½æ¯ï¼"éä¾¿å§"ã'},
      'HSMI':{zh:'æ©èµ·æäºº',en:'Morning Lazy Person',desc:'è¿æ¯ä¸ªæè¶£çç»åï¼ä½ ä¹ æ¯æ©èµ·ï¼ä½å¶å®æ¯ä¸ªå¿çä¸å¾æçäººãä½ ä¸æ³è·å«äººå¤ªç´§å¯å°èç³»ï¼å®å¯ç¬èªäº«åæ¸æ¨çå®éã'},
      'CDMI':{zh:'ä½ç³»äººå£«',en:'Buddhist Practitioner',desc:'ä½ æ¯ä¸ªå½»åºçä½ç³»äººå£«ãå¥é½è¡ï¼å¥é½ä¸å¨ä¹ï¼è·çèå¥èµ°å°±å®äºäºãä½ ä¸ä¼ä¸ºå°äºçæ°ï¼ä¹ä¸ä¼ç¹å«å´å¥ãä½ çåºç°å¾å¾è½è®©å¨å´çäººé½å·éä¸æ¥ã'},
      'CSNE':{zh:'æ·±å¤emoä½',en:'Night Emo Sage',desc:'ä½ å¾çç¾ï¼ç½å¤©å¾å·æ¼ ä½ç³»ï¼å°äºæ·±å¤å°±åæäºemoçå°å¯æãä½ å¾ç²äººå´åä¸æ³æ¿è®¤ï¼ç»å¸¸å¨åå¤åèªæè¯´"æå¾å¥½å¦"ï¼ç¶ååå¼å§æç¼æ³ªã'},
      'CSME':{zh:'æ©èµ·å»çä½',en:'Early Bird Wellness Sage',desc:'å­ç¹èµ·åºæ³¡æ¸æçç²¾ç¥èå¹²é¨ãä½ æèªå·±æç¡®ççæ´»è®¡åï¼æ©èµ·åçä¼½ãåå»çè¶ãä½ å¾å¹³éå·æ¼ ï¼ä½å¯¹èªå·±å¾æè¦æ±ã'},
      'CSNI':{zh:'å­¤ç¬ä¿®è¡è',en:'Solitary Practitioner',desc:'ä½ æ¯ä¸ªå½»åºçç¬è¡ä¾ ãå·æ¼ ãå¹³éãç¬ç«ï¼å®å¨ä¸éè¦å«äººãä½ çæç»ªå¾ç¨³å®ï¼å ä¸ºä½ å¾å°å¯¹ä»»ä½äºæäº§çå¼ºççæåã'},
      'CSMI':{zh:'å®å®ä¿®å£«',en:'Serene Monk',desc:'ä½ å·²ç»è¾¾å°äº"ä½"çæé«å¢çãæ¢ä¸éè¦å«äººçéªä¼´ï¼ä¹ä¸éè¦åºæ¿ççæ´»ãä½ æè§å¾çä½æ¯ï¼å¹³éçå¿æï¼å¾å°è¢«å¤çææ°ãä½ æ´»å¾æèªå¨ã'},
    };
  }

  get dimLabels() {
    return [
      {left:'H (Hot)',leftEmoji:'ð¥',right:'C (Cold)',rightEmoji:'âï¸',name:'è½éæ°´å¹³'},
      {left:'D (Drama)',leftEmoji:'ð­',right:'S (Stoic)',rightEmoji:'ð§',name:'æç»ªè¡¨è¾¾'},
      {left:'N (Night)',leftEmoji:'ð',right:'M (Morning)',rightEmoji:'âï¸',name:'çæ´»èå¥'},
      {left:'E (Emotional)',leftEmoji:'ð«',right:'I (Independent)',rightEmoji:'ð¡ï¸',name:'ä¾èµç¨åº¦'},
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
        <div class="emoji">â¨</div>
        <div class="title">Huggy ç²¾ç¥ç¶æé´å®</div>
        <div class="sub">æ­£ç»äººè°åMBTIåï¼</div>
        <div class="dims">
          ${this.dimLabels.map(d => `<div class="dim-card">${d.leftEmoji} <span class="dim-vs">${d.left}</span> vs ${d.rightEmoji} ${d.right}</div>`).join('')}
        </div>
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
          <span class="htitle">ä½ çç±»å</span>
          <div></div>
        </div>
        <div class="result-card">
          <div class="rcode">${this.resultCode}</div>
          <div class="rname">${t.zh}</div>
          <div class="rdesc">${t.desc}</div>
        </div>
        <div class="dims-section">
          <div class="dims-title">åç»´åæ</div>
          ${dimBars}
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="shareBtn">åäº«ç»æ</button>
          <button class="btn btn-secondary" id="retryBtn">éæ°æµè¯</button>
        </div>
      </div>`;
    s.getElementById('rBack').onclick = () => { this.screen='start'; this.render(); };
    s.getElementById('retryBtn').onclick = () => this.startQuiz();
    s.getElementById('shareBtn').onclick = () => {
      const txt = `ææ¯Huggyç²¾ç¥ç¶æé´å®ä¸­ç${t.zh}${this.resultCode}ï¼`;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      if (navigator.share) navigator.share({title:'Huggyç²¾ç¥ç¶æé´å®',text:txt});
    };
  }

  baseCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box;}:host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;}`;
  }
}

customElements.define('fun-quiz', FunQuiz);
