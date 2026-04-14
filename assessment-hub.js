/**
 * Assessment Hub — Full Interface (Wix Custom Element)
 * Huggy 心理测评中心 - Complete UI with Sidebar
 * Matches huggys-ai.vercel.app/test
 */
class AssessmentHub extends HTMLElement {
  static get observedAttributes() { return ['lang','api-key']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.lang = 'zh';
    this.apiKey = '';
    this.activeNav = 'assessment';
    this.activeTest = null;
    this.testMessages = [];
    this.isThinking = false;
  }

  connectedCallback() { this.render(); }

  attributeChangedCallback(n,_,v) {
    if (n==='lang') this.lang=v||'zh';
    if (n==='api-key') this.apiKey=v||'';
  }

  get t() {
    if (this.lang === 'en') return {
      brand: 'Huggys', role: 'Quick Access',
      home: 'Home', chat: 'AI Chat', booking: 'Book Session',
      journal: 'Journal', assessment: 'Assessments', growth: 'Growth', settings: 'Settings',
      login: 'Log In',
      title: 'Soul Exploration', subtitle: 'Discover the unknown you.',
      funTitle: 'Fun Quizzes', hot: 'HOT',
      proTitle: 'Professional Assessments',
      mentalTitle: 'Mental State ID', mentalDesc: '20 questions \u00b7 4 dimensions \u00b7 16 types',
      loveTitle: 'Love Personality', loveDesc: '15 questions \u00b7 8 love types',
      stressTitle: 'Stress Monster', stressDesc: '12 questions \u00b7 8 monster types',
      sbtiTitle: 'SB-TI Personality', sbtiDesc: '30 questions \u00b7 15 dimensions \u00b7 25+ types',
      humanTitle: 'HUMAN 3.0 Comprehensive Personality Assessment',
      humanDesc: 'A deep dialogue about existence, meaning, and who you truly are.',
      startExplore: 'Start Exploring',
      mbti: 'MBTI Personality', mbtiDesc: 'Personality archetypes',
      phq9: 'PHQ-9 Depression Screen', phq9Desc: 'Depression scale assessment',
      gad7: 'GAD-7 Anxiety Screen', gad7Desc: 'Anxiety level self-assessment',
      holland: 'Holland Career Test', hollandDesc: 'Career interest exploration',
      deepDialog: 'Deep Dialogue Mode', inputPlaceholder: 'Type your answer...',
      errorMsg: 'Connection failed. Please try again.', noApi: 'AI service is not configured.',
    };
    return {
      brand: 'Huggys', role: '\u6E38\u5BA2\u8BBF\u95EE',
      home: '\u4E3B\u9875', chat: 'AI \u54A8\u8BE2', booking: '\u54A8\u8BE2\u5E08\u9884\u7EA6',
      journal: '\u60C5\u7EEA\u65E5\u8BB0', assessment: '\u5FC3\u7406\u6D4B\u8BC4', growth: '\u6210\u957F\u8DB3\u8FF9', settings: '\u8BBE\u7F6E',
      login: '\u767B\u5F55',
      title: '\u5FC3\u7075\u63A2\u7D22\u9986', subtitle: '\u5411\u5185\u63A2\u7D22\uFF0C\u53D1\u73B0\u771F\u5B9E\u7684\u81EA\u5DF1',
      funTitle: '\uD83D\uDD25 \u8DA3\u5473\u6D4B\u8BD5', hot: 'HOT',
      proTitle: '\uD83D\uDCCB \u4E13\u4E1A\u91CF\u8868',
      mentalTitle: '\u7CBE\u795E\u72B6\u6001\u9274\u5B9A', mentalDesc: '20\u9898 \u00b7 4\u7EF4\u5EA6 \u00b7 16\u79CD\u4EBA\u683C',
      loveTitle: '\u604B\u7231\u4EBA\u683C\u9274\u5B9A', loveDesc: '15\u9898 \u00b7 8\u79CD\u604B\u7231\u4EBA\u683C',
      stressTitle: '\u4F60\u7684\u538B\u529B\u602A\u517D', stressDesc: '12\u9898 \u00b7 8\u79CD\u602A\u517D\u5F62\u6001',
      sbtiTitle: 'SB-TI \u4EBA\u683C\u6D4B\u8BD5', sbtiDesc: '30\u9898 \u00b7 15\u7EF4\u5EA6 \u00b7 25+\u4EBA\u683C',
      humanTitle: 'HUMAN 3.0 \u7EFC\u5408\u4EBA\u683C\u8BC4\u4F30',
      humanDesc: '\u4E00\u573A\u5173\u4E8E\u5B58\u5728\u4E0E\u610F\u4E49\u7684\u6DF1\u5EA6\u5BF9\u8BDD\u3002',
      startExplore: '\u5F00\u59CB\u63A2\u7D22',
      mbti: 'MBTI \u4EBA\u683C\u6D4B\u8BD5', mbtiDesc: '\u63A2\u7D22\u4F60\u7684\u6027\u683C\u539F\u578B',
      phq9: 'PHQ-9 \u6291\u90C1\u7B5B\u67E5', phq9Desc: '\u6291\u90C1\u7A0B\u5EA6\u81EA\u8BC4',
      gad7: 'GAD-7 \u7126\u8651\u81EA\u6D4B', gad7Desc: '\u7126\u8651\u6C34\u5E73\u81EA\u8BC4',
      holland: '\u970D\u5170\u5FB7\u804C\u4E1A\u6D4B\u8BD5', hollandDesc: '\u804C\u4E1A\u5174\u8DA3\u63A2\u7D22',
      deepDialog: '\u6DF1\u5EA6\u5BF9\u8BDD\u6A21\u5F0F', inputPlaceholder: '\u8F93\u5165\u56DE\u7B54...',
      errorMsg: '\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002', noApi: 'AI \u670D\u52A1\u5C1A\u672A\u914D\u7F6E\u3002',
    };
  }

  icon(name, size=20) {
    const s = size;
    const icons = {
      home: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
      chat: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      booking: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      journal: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M12 13l-1-1-3 3"/></svg>`,
      assessment: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>`,
      growth: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      settings: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      globe: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      login: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
      clipboard: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>`,
      sparkles: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
      fingerprint: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2"/></svg>`,
      arrowRight: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
      chevronLeft: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
      user: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      activity: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
      zap: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      help: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      bot: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
      send: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
      paperclip: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
      mic: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    };
    return icons[name] || '';
  }

  escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  handleNavClick(id) {
    this.activeNav = id;
    this.dispatchEvent(new CustomEvent('navigate', { detail: { view: id }, bubbles: true, composed: true }));
    const navBtns = this.shadowRoot.querySelectorAll('.nav-item');
    navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.id === id));
    const mobBtns = this.shadowRoot.querySelectorAll('.mob-nav-btn');
    mobBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.id === id));
  }

  /* Map of fun-quiz IDs to their standalone Web Component info */
  get quizComponents() {
    return {
      mental: { tag: 'fun-quiz', file: 'fun-quiz.js' },
      love:   { tag: 'love-quiz', file: 'love-quiz.js' },
      stress: { tag: 'stress-quiz', file: 'stress-quiz.js' },
      sbti:   { tag: 'sbti-quiz', file: 'sbti-quiz.js' },
    };
  }

  async startTest(testId) {
    /* If it's a standalone quiz (non-HUMAN, non-professional), load its Web Component */
    const quizInfo = this.quizComponents[testId];
    if (quizInfo) {
      this.activeTest = testId;
      this.renderStandaloneQuiz(testId, quizInfo);
      return;
    }

    /* Otherwise use the original chat-based dialog for HUMAN & professional tests */
    this.activeTest = testId;
    this.testMessages = [];
    this.isThinking = true;
    this.renderTestView();

    const isEn = this.lang === 'en';
    const testNames = { 'MBTI': isEn ? 'MBTI' : 'MBTI \u4EBA\u683C\u7C7B\u578B', 'PHQ-9': isEn ? 'PHQ-9' : 'PHQ-9 \u6291\u90C1\u7B5B\u67E5', 'GAD-7': isEn ? 'GAD-7' : 'GAD-7 \u7126\u8651\u8BC4\u4F30', 'Holland': isEn ? 'Holland' : '\u970D\u5170\u5FB7\u804C\u4E1A\u6D4B\u8BD5', 'human': isEn ? 'HUMAN 3.0' : 'HUMAN 3.0 \u7EFC\u5408\u4EBA\u683C\u8BC4\u4F30'};
    const testName = testNames[testId] || testId;

    const systemPrompt = isEn
      ? `You are a warm, professional psychological assessor conducting the ${testName} assessment. Respond in ENGLISH. Ask ONE question at a time conversationally. After 8-10 questions, provide a thoughtful interpretation.`
      : `\u4F60\u662F\u4E00\u4F4D\u6E29\u6696\u4E14\u4E13\u4E1A\u7684\u5FC3\u7406\u8BC4\u4F30\u5E08\uFF0C\u6B63\u5728\u4E3A\u7528\u6237\u8FDB\u884C\u300C${testName}\u300D\u8BC4\u4F30\u3002\u8BF7\u5168\u7A0B\u4F7F\u7528\u4E2D\u6587\u56DE\u590D\u3002\u6BCF\u6B21\u53EA\u95EE\u4E00\u4E2A\u95EE\u9898\uFF0C\u8BED\u6C14\u4EB2\u5207\u81EA\u7136\u30028-10\u4E2A\u95EE\u9898\u540E\uFF0C\u7ED9\u51FA\u6E29\u6696\u4E14\u6709\u6D1E\u5BDF\u529B\u7684\u89E3\u8BFB\u3002`;

    this._currentSystemPrompt = systemPrompt;
    const userTrigger = isEn ? `Start ${testId}` : `\u5F00\u59CB ${testId} \u8BC4\u4F30`;

    try {
      const response = await this.callGemini(userTrigger, systemPrompt);
      this.testMessages = [{ sender: 'ai', text: response, time: new Date() }];
    } catch(e) {
      this.testMessages = [{ sender: 'ai', text: this.t.errorMsg, time: new Date() }];
    }
    this.isThinking = false;
    this.renderTestMessages();
  }

  async renderStandaloneQuiz(testId, quizInfo) {
    const container = this.shadowRoot.getElementById('mainContent');
    if (!container) return;

    /* Resolve the JS file URL - same base as the loader default source */
    const baseUrl = 'https://lululucaslv.github.io/MTH-Custom-Element/';
    const scriptUrl = baseUrl + quizInfo.file;

    /* Load the quiz component script if its tag is not registered yet */
    if (!customElements.get(quizInfo.tag)) {
      try {
        /* Fetch quiz file, decode with Latin-1 for lossless byte mapping, then re-decode as UTF-8.
           This fixes double-UTF8-encoded files from GitHub Pages without data loss. */
        const resp = await fetch(scriptUrl);
        const buf = await resp.arrayBuffer();
        const raw = new TextDecoder('iso-8859-1').decode(new Uint8Array(buf));
        /* Convert Latin-1 chars back to bytes, then decode as UTF-8 */
        let bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
        let text = new TextDecoder('utf-8').decode(bytes);
        /* If chars in 0x80-0xFF remain, file was double-encoded; decode one more layer */
        if (/[\u0080-\u00ff]/.test(text)) {
          const b2 = new Uint8Array(text.length);
          for (let i = 0; i < text.length; i++) b2[i] = text.charCodeAt(i);
          text = new TextDecoder('utf-8').decode(b2);
        }
        const blob = new Blob([text], {type:'application/javascript;charset=utf-8'});
        const blobUrl = URL.createObjectURL(blob);
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = blobUrl;
          s.onload = () => { URL.revokeObjectURL(blobUrl); resolve(); };
          s.onerror = reject;
          document.head.appendChild(s);
        });
        await customElements.whenDefined(quizInfo.tag);
      } catch (e) {
        console.error('Failed to load quiz component: ' + quizInfo.file, e);
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#ef4444;">Failed to load quiz. Please try again.</div>';
        return;
      }
    }

    /* Clear container and insert the quiz element with full sizing */
    container.innerHTML = '';
    const quizEl = document.createElement(quizInfo.tag);
    quizEl.style.cssText = 'display:block;width:100%;height:100%;';
    /* Pass through any relevant attributes */
    const userId = this.getAttribute('user-id');
    const userEmail = this.getAttribute('user-email');
    const userName = this.getAttribute('user-name');
    if (userId) quizEl.setAttribute('user-id', userId);
    if (userEmail) quizEl.setAttribute('user-email', userEmail);
    if (userName) quizEl.setAttribute('user-name', userName);
    container.appendChild(quizEl);

    /* Listen for goBack event to return to the hub */
    quizEl.addEventListener('goBack', () => {
      this.activeTest = null;
      this.renderHub();
    });

    /* Also listen for quizComplete event */
    quizEl.addEventListener('quizComplete', (e) => {
      console.log('Quiz completed:', testId, e.detail);
    });
  }

  async handleTestReply(text) {
    if (!text.trim() || this.isThinking) return;
    this.testMessages.push({ sender: 'user', text: text.trim(), time: new Date() });
    this.isThinking = true;
    this.renderTestMessages();
    this.scrollTestToBottom();

    try {
      const history = this.testMessages.map(m => `${m.sender === 'user' ? 'User' : 'Assessor'}: ${m.text}`).join('\n');
      const fullPrompt = `${history}\nAssessor (You):`;
      const response = await this.callGemini(fullPrompt, this._currentSystemPrompt);
      this.testMessages.push({ sender: 'ai', text: response, time: new Date() });
    } catch(e) {
      this.testMessages.push({ sender: 'ai', text: this.t.errorMsg, time: new Date() });
    }
    this.isThinking = false;
    this.renderTestMessages();
    this.scrollTestToBottom();
  }

  async callGemini(prompt, systemPrompt) {
    if (!this.apiKey) return this.t.noApi;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.8, maxOutputTokens: 800, topP: 0.9 }
    };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
  }

  scrollTestToBottom() {
    requestAnimationFrame(() => {
      const list = this.shadowRoot.getElementById('testMsgList');
      if (list) list.scrollTop = list.scrollHeight;
    });
  }

  renderTestMessages() {
    const list = this.shadowRoot.getElementById('testMsgList');
    if (!list) return;

    let html = this.testMessages.map(m => {
      const time = m.time ? new Date(m.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
      if (m.sender === 'user') {
        return `<div class="msg msg-user"><div class="msg-content"><div class="bubble bubble-user">${this.escapeHtml(m.text)}</div>${time ? `<span class="msg-time msg-time-right">${time}</span>` : ''}</div></div>`;
      }
      return `<div class="msg msg-ai"><div class="avatar-sm">${this.icon('bot', 18)}</div><div class="msg-content"><div class="bubble bubble-ai">${this.escapeHtml(m.text)}</div>${time ? `<span class="msg-time">${time}</span>` : ''}</div></div>`;
    }).join('');

    if (this.isThinking) {
      html += `<div class="msg msg-ai"><div class="avatar-sm">${this.icon('bot', 18)}</div><div class="msg-content"><div class="bubble bubble-ai thinking"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div></div>`;
    }
    list.innerHTML = html;
  }

  renderTestView() {
    const container = this.shadowRoot.getElementById('mainContent');
    if (!container) return;
    const t = this.t;
    const testLabel = this.activeTest === 'human' ? 'HUMAN 3.0' : this.activeTest;

    container.innerHTML = `
      <div class="test-dialog">
        <div class="test-header">
          <div class="test-header-left">
            <button class="back-btn" id="backBtn">${this.icon('chevronLeft', 22)}</button>
            <div>
              <h2 class="test-header-title">${testLabel}</h2>
              <span class="test-header-sub">${t.deepDialog}</span>
            </div>
          </div>
          <div style="width:32px;"></div>
        </div>
        <div class="msg-list" id="testMsgList"></div>
        <div class="input-area">
          <div class="input-row">
            <button class="clip-btn">${this.icon('paperclip', 20)}</button>
            <div class="input-wrap">
              <textarea class="input-field" id="testInput" rows="1" placeholder="${t.inputPlaceholder}"></textarea>
            </div>
            <button class="send-btn send-btn-mic" id="testSendBtn">${this.icon('mic', 20)}</button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('backBtn').addEventListener('click', () => {
      this.activeTest = null;
      this.renderHub();
    });

    const input = this.shadowRoot.getElementById('testInput');
    const sendBtn = this.shadowRoot.getElementById('testSendBtn');

    const updateBtn = () => {
      if (input.value.trim()) {
        sendBtn.className = 'send-btn send-btn-active';
        sendBtn.innerHTML = this.icon('send', 20);
      } else {
        sendBtn.className = 'send-btn send-btn-mic';
        sendBtn.innerHTML = this.icon('mic', 20);
      }
    };

    sendBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        this.handleTestReply(input.value);
        input.value = '';
        input.style.height = 'auto';
        updateBtn();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendBtn.click(); }
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 128) + 'px';
      updateBtn();
    });

    this.renderTestMessages();
  }

  renderHub() {
    const container = this.shadowRoot.getElementById('mainContent');
    if (!container) return;
    const t = this.t;

    container.innerHTML = `
      <div class="hub-scroll">
        <div class="hub-inner">
          <div class="hub-header">
            <div class="hub-header-icon">${this.icon('clipboard', 28)}</div>
            <div>
              <h1 class="hub-title">${t.title}</h1>
              <p class="hub-subtitle">${t.subtitle}</p>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">
              ${this.icon('sparkles', 18)}
              ${t.funTitle}
              <span class="hot-badge">${t.hot}</span>
            </h2>
            <div class="fun-grid">
              <div class="fun-card fun-mental" data-quiz="mental">
                <div class="fun-emoji">\uD83E\uDDE0</div>
                <h3 class="fun-name">${t.mentalTitle}</h3>
                <p class="fun-desc">${t.mentalDesc}</p>
              </div>
              <div class="fun-card fun-love" data-quiz="love">
                <div class="fun-emoji">\uD83D\uDC98</div>
                <h3 class="fun-name">${t.loveTitle}</h3>
                <p class="fun-desc">${t.loveDesc}</p>
              </div>
              <div class="fun-card fun-stress" data-quiz="stress">
                <div class="fun-emoji">\uD83D\uDC7E</div>
                <h3 class="fun-name">${t.stressTitle}</h3>
                <p class="fun-desc">${t.stressDesc}</p>
              </div>
              <div class="fun-card fun-sbti" data-quiz="sbti">
                <div class="fun-emoji">\uD83D\uDD2E</div>
                <h3 class="fun-name">${t.sbtiTitle}</h3>
                <p class="fun-desc">${t.sbtiDesc}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">
              ${this.icon('clipboard', 18)}
              ${t.proTitle}
            </h2>

            <div class="human-banner" id="humanBtn">
              <div class="human-bg">${this.icon('fingerprint', 240)}</div>
              <div class="human-content">
                <div class="human-badge">${this.icon('sparkles', 12)} HUMAN 3.0</div>
                <h3 class="human-title">${t.humanTitle}</h3>
                <p class="human-desc">${t.humanDesc}</p>
                <button class="human-cta">${t.startExplore} ${this.icon('arrowRight', 16)}</button>
              </div>
            </div>

            <div class="pro-grid">
              <div class="pro-card" data-test="MBTI">
                <div class="pro-icon pro-indigo">${this.icon('user', 24)}</div>
                <h3 class="pro-name">${t.mbti}</h3>
                <p class="pro-desc">${t.mbtiDesc}</p>
              </div>
              <div class="pro-card" data-test="PHQ-9">
                <div class="pro-icon pro-sky">${this.icon('activity', 24)}</div>
                <h3 class="pro-name">${t.phq9}</h3>
                <p class="pro-desc">${t.phq9Desc}</p>
              </div>
              <div class="pro-card" data-test="GAD-7">
                <div class="pro-icon pro-orange">${this.icon('zap', 24)}</div>
                <h3 class="pro-name">${t.gad7}</h3>
                <p class="pro-desc">${t.gad7Desc}</p>
              </div>
              <div class="pro-card" data-test="Holland">
                <div class="pro-icon pro-teal">${this.icon('help', 24)}</div>
                <h3 class="pro-name">${t.holland}</h3>
                <p class="pro-desc">${t.hollandDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.fun-card').forEach(card => {
      card.addEventListener('click', () => this.startTest(card.dataset.quiz));
    });

    container.querySelectorAll('.pro-card').forEach(card => {
      card.addEventListener('click', () => this.startTest(card.dataset.test));
    });

    this.shadowRoot.getElementById('humanBtn').addEventListener('click', () => this.startTest('human'));
  }

  render() {
    const s = this.shadowRoot;
    const t = this.t;
    const navItems = [
      { id: 'home', label: t.home, icon: 'home' },
      { id: 'chat', label: t.chat, icon: 'chat' },
      { id: 'booking', label: t.booking, icon: 'booking' },
      { id: 'journal', label: t.journal, icon: 'journal' },
      { id: 'assessment', label: t.assessment, icon: 'assessment' },
      { id: 'growth', label: t.growth, icon: 'growth' },
      { id: 'settings', label: t.settings, icon: 'settings' },
    ];

    s.innerHTML = `
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        :host{display:block;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei",sans-serif;-webkit-font-smoothing:antialiased;}

        .app-shell{display:flex;width:100%;height:100%;background:#faf9fe;overflow:hidden;}

        /* ===== SIDEBAR ===== */
        .sidebar{
          display:none;width:256px;flex-shrink:0;flex-direction:column;
          background:rgba(255,255,255,0.4);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border-right:1px solid rgba(255,255,255,0.5);
          position:sticky;top:0;height:100%;z-index:20;
        }
        @media(min-width:768px){.sidebar{display:none;}}

        .sidebar-brand{padding:28px 24px 16px;display:flex;align-items:center;gap:12px;}
        .sidebar-logo{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:#fff;font-weight:bold;}
        .sidebar-brand-name{font-weight:700;font-size:1.2rem;color:#1e293b;letter-spacing:-0.02em;}

        .sidebar-profile{margin:0 16px 20px;background:rgba(255,255,255,0.4);padding:12px;border-radius:20px;display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,0.5);box-shadow:0 1px 3px rgba(0,0,0,0.04);}
        .sidebar-profile:hover{background:rgba(255,255,255,0.7);}
        .sidebar-avatar{width:40px;height:40px;border-radius:50%;background:#e0e7ff;border:2px solid rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;font-size:0.9rem;color:#6366f1;font-weight:600;}
        .sidebar-user-info{min-width:0;flex:1;}
        .sidebar-user-name{font-size:0.875rem;font-weight:700;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .sidebar-user-role{font-size:0.75rem;color:#94a3b8;}

        .sidebar-nav{flex:1;padding:0 12px;overflow-y:auto;}
        .sidebar-nav::-webkit-scrollbar{display:none;}
        .nav-item{
          width:100%;display:flex;align-items:center;gap:12px;
          padding:14px 16px;border-radius:20px;border:none;
          background:transparent;cursor:pointer;
          font-size:0.875rem;font-weight:700;color:#94a3b8;
          transition:all 0.3s ease;text-align:left;margin-bottom:4px;
        }
        .nav-item:hover{background:rgba(255,255,255,0.4);color:#1e293b;}
        .nav-item.active{
          background:rgba(255,255,255,0.9);color:#312e81;
          box-shadow:0 1px 3px rgba(0,0,0,0.06);
          transform:scale(1.02);border:1px solid rgba(99,102,241,0.15);
        }
        .nav-item.active .nav-icon{color:#6366f1;}
        .nav-icon{color:rgba(148,163,184,0.7);display:flex;align-items:center;transition:color 0.3s;}

        .sidebar-bottom{padding:16px 20px;margin-top:auto;border-top:1px solid rgba(15,23,42,0.05);display:flex;align-items:center;justify-content:space-between;}
        .sidebar-btn{display:flex;align-items:center;gap:6px;font-size:0.75rem;font-weight:700;color:#94a3b8;background:none;border:none;cursor:pointer;transition:color 0.2s;}
        .sidebar-btn:hover{color:#6366f1;}

        /* ===== MAIN ===== */
        .main-area{flex:1;display:flex;flex-direction:column;height:100%;overflow:hidden;}
        @media(min-width:768px){.main-area{padding:24px 24px 24px 0;}}

        .content-container{flex:1;display:flex;flex-direction:column;height:100%;overflow:hidden;}
        @media(min-width:768px){.content-container{border-radius:24px;}}

        /* ===== HUB ===== */
        .hub-scroll{flex:1;overflow-y:auto;padding:16px;padding-bottom:100px;}
        @media(min-width:768px){.hub-scroll{padding:32px;}}
        .hub-inner{max-width:960px;margin:0 auto;}

        .hub-header{display:flex;align-items:center;gap:16px;margin-bottom:32px;}
        .hub-header-icon{width:56px;height:56px;border-radius:16px;background:#e0e7ff;color:#4338ca;border:1px solid #c7d2fe;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.06);}
        .hub-title{font-size:1.5rem;font-weight:800;color:#1e293b;}
        .hub-subtitle{font-size:0.875rem;color:#64748b;font-weight:500;margin-top:2px;}

        .section{margin-bottom:32px;}
        .section-title{font-size:1.05rem;font-weight:800;color:#334155;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
        .hot-badge{font-size:0.68rem;background:linear-gradient(135deg,#ec4899,#6366f1);color:#fff;padding:2px 8px;border-radius:999px;font-weight:700;margin-left:4px;}

        .fun-grid{display:grid;grid-template-columns:1fr;gap:12px;}
        @media(min-width:640px){.fun-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.fun-grid{grid-template-columns:repeat(4,1fr);}}

        .fun-card{border-radius:24px;padding:24px;color:#fff;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden;}
        .fun-card:hover{transform:scale(1.02);box-shadow:0 12px 40px rgba(0,0,0,0.15);}
        .fun-card:active{transform:scale(0.98);}
        .fun-mental{background:linear-gradient(135deg,#6366f1,#818cf8,#ec4899);}
        .fun-love{background:linear-gradient(135deg,#ec4899,#f43f5e,#ef4444);}
        .fun-stress{background:linear-gradient(135deg,#334155,#1e293b,#312e81);}
        .fun-sbti{background:linear-gradient(135deg,#f59e0b,#f97316,#ef4444);}
        .fun-emoji{font-size:2rem;margin-bottom:12px;}
        .fun-name{font-weight:700;font-size:1.1rem;margin-bottom:4px;}
        .fun-desc{font-size:0.75rem;opacity:0.7;}

        .human-banner{
          background:linear-gradient(135deg,#1e293b,#1e3a5f);
          border-radius:36px;padding:32px;position:relative;overflow:hidden;
          cursor:pointer;margin-bottom:24px;border:1px solid #334155;
          transition:all 0.5s;
        }
        @media(min-width:768px){.human-banner{padding:40px;}}
        .human-banner:hover{box-shadow:0 20px 60px rgba(30,58,95,0.3);}
        .human-bg{position:absolute;right:-20px;top:-20px;opacity:0.08;color:#fff;transition:transform 0.7s;}
        .human-banner:hover .human-bg{transform:scale(1.1);}
        .human-content{position:relative;z-index:1;}
        .human-badge{
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);
          padding:4px 12px;border-radius:999px;font-size:0.75rem;font-weight:700;
          color:#fcd34d;border:1px solid rgba(255,255,255,0.2);margin-bottom:16px;
        }
        .human-title{font-size:1.5rem;font-weight:800;color:#fff;margin-bottom:12px;}
        @media(min-width:768px){.human-title{font-size:1.75rem;}}
        .human-desc{color:#94a3b8;max-width:480px;margin-bottom:28px;font-size:0.875rem;line-height:1.6;font-weight:500;}
        .human-cta{
          background:#fff;color:#1e293b;border:none;padding:12px 28px;border-radius:16px;
          font-size:0.875rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;
          box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:all 0.2s;
        }
        .human-cta:hover{background:#fefce8;transform:translateY(-1px);}
        .human-cta:active{transform:scale(0.95);}

        .pro-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:640px){.pro-grid{grid-template-columns:1fr 1fr;}}

        .pro-card{
          background:#fff;border-radius:24px;padding:24px;border:1px solid #f1f5f9;
          cursor:pointer;transition:all 0.3s;display:flex;flex-direction:column;align-items:flex-start;
          box-shadow:0 1px 3px rgba(0,0,0,0.04);
        }
        .pro-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08);transform:translateY(-2px);}
        .pro-icon{width:48px;height:48px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;border:1px solid;transition:transform 0.3s;}
        .pro-card:hover .pro-icon{transform:scale(1.1);}
        .pro-indigo{background:#eef2ff;color:#6366f1;border-color:#c7d2fe;}
        .pro-sky{background:#f0f9ff;color:#0ea5e9;border-color:#bae6fd;}
        .pro-orange{background:#fff7ed;color:#f97316;border-color:#fed7aa;}
        .pro-teal{background:#f0fdfa;color:#14b8a6;border-color:#99f6e4;}
        .pro-name{font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:4px;}
        .pro-desc{font-size:0.8rem;color:#64748b;}

        /* ===== TEST DIALOG ===== */
        .test-dialog{display:flex;flex-direction:column;height:100%;background:#f8fafc;}
        .test-header{
          flex-shrink:0;padding:10px 16px;
          border-bottom:1px solid rgba(255,255,255,0.5);
          background:rgba(255,255,255,0.6);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
          display:flex;align-items:center;justify-content:space-between;z-index:10;
        }
        .test-header-left{display:flex;align-items:center;gap:12px;}
        .back-btn{padding:8px;margin-left:-8px;background:none;border:none;cursor:pointer;color:#475569;border-radius:50%;transition:all 0.2s;}
        .back-btn:hover{background:rgba(241,245,249,0.5);}
        .back-btn:active{transform:scale(0.95);}
        .test-header-title{font-weight:700;font-size:1rem;color:#1e293b;}
        .test-header-sub{font-size:0.625rem;color:#94a3b8;}

        .msg-list{flex:1;overflow-y:auto;padding:20px 16px;display:flex;flex-direction:column;gap:12px;}
        @media(min-width:640px){.msg-list{padding:24px;}}
        .msg{display:flex;gap:10px;max-width:85%;animation:slideUp 0.4s ease-out;}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .msg-user{align-self:flex-end;flex-direction:row-reverse;}
        .msg-ai{align-self:flex-start;}
        .msg-content{display:flex;flex-direction:column;gap:4px;}
        .avatar-sm{width:32px;height:32px;border-radius:50%;background:#e0e7ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#6366f1;margin-top:2px;}
        .bubble{padding:12px 16px;border-radius:16px;font-size:0.875rem;line-height:1.7;word-break:break-word;}
        .bubble-user{background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border-top-right-radius:4px;}
        .bubble-ai{background:#fff;color:#374151;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,0.04);border-top-left-radius:4px;}
        .msg-time{font-size:0.68rem;color:#94a3b8;}
        .msg-time-right{text-align:right;}

        .thinking{display:flex;gap:6px;align-items:center;padding:12px 20px;}
        .dot{width:8px;height:8px;border-radius:50%;background:#818cf8;animation:bounce 1.4s infinite ease-in-out;}
        .dot:nth-child(2){animation-delay:0.2s;}
        .dot:nth-child(3){animation-delay:0.4s;}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px);opacity:0.7}}

        .input-area{
          flex-shrink:0;padding:12px 16px;
          background:rgba(250,249,254,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border-top:1px solid rgba(226,232,240,0.3);
        }
        .input-row{display:flex;align-items:flex-end;gap:10px;max-width:800px;margin:0 auto;}
        .clip-btn{padding:10px;color:#94a3b8;background:none;border:none;cursor:pointer;border-radius:50%;transition:all 0.2s;}
        .clip-btn:hover{color:#64748b;background:#f1f5f9;}
        .input-wrap{
          flex:1;background:#fff;border-radius:24px;
          box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);
          display:flex;align-items:center;padding:4px 16px;
          border:1px solid transparent;transition:border-color 0.2s;
        }
        .input-wrap:focus-within{border-color:#c7d2fe;}
        .input-field{
          width:100%;border:none;background:transparent;
          font-size:0.875rem;color:#1e293b;resize:none;
          max-height:128px;min-height:44px;padding:10px 0;
          outline:none;font-family:inherit;line-height:1.5;
        }
        .input-field::placeholder{color:#94a3b8;}
        .send-btn{
          padding:10px;border-radius:50%;border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.2s;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,0.1);
        }
        .send-btn-active{background:#6366f1;color:#fff;box-shadow:0 4px 12px rgba(99,102,241,0.2);}
        .send-btn-active:active{transform:scale(0.95);}
        .send-btn-mic{background:#1e293b;color:#fff;box-shadow:0 4px 12px rgba(30,41,59,0.2);}

        /* Mobile Nav */
        .mobile-nav{
          display:none;flex-shrink:0;
          background:rgba(255,255,255,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border-top:1px solid rgba(226,232,240,0.5);
          padding:6px 8px;padding-bottom:max(6px, env(safe-area-inset-bottom));
          justify-content:space-around;
        }
        @media(min-width:768px){.mobile-nav{display:none;}}
        .mob-nav-btn{
          display:flex;flex-direction:column;align-items:center;gap:2px;
          padding:6px 12px;border:none;background:none;cursor:pointer;
          color:#94a3b8;font-size:0.6rem;font-weight:600;transition:color 0.2s;border-radius:12px;
        }
        .mob-nav-btn.active{color:#6366f1;}
        .mob-nav-btn.active::after{content:'';width:4px;height:4px;border-radius:50%;background:#6366f1;margin-top:2px;}
/* === Mobile Optimizations === */
@media(max-width:767px){
  .app-shell{min-height:100%;}
  .hub-scroll{padding:12px;padding-bottom:80px;}
  .hub-header{margin-bottom:20px;gap:12px;}
  .hub-header-icon{width:44px;height:44px;border-radius:12px;}
  .hub-title{font-size:1.25rem;}
  .hub-subtitle{font-size:0.8rem;}
  .section{margin-bottom:24px;}
  .section-title{font-size:0.95rem;margin-bottom:12px;}
  .fun-card{padding:18px;border-radius:20px;}
  .fun-emoji{font-size:1.75rem;margin-bottom:8px;}
  .fun-name{font-size:1rem;}
  .fun-desc{font-size:0.7rem;}
  .human-banner{padding:24px;border-radius:28px;margin-bottom:16px;}
  .human-title{font-size:1.25rem;margin-bottom:8px;}
  .human-desc{font-size:0.8rem;margin-bottom:20px;}
  .human-cta{padding:10px 24px;font-size:0.8rem;border-radius:14px;}
  .pro-card{padding:18px;border-radius:20px;}
  .pro-icon{width:40px;height:40px;border-radius:14px;margin-bottom:12px;}
  .pro-name{font-size:0.95rem;}
  .pro-desc{font-size:0.75rem;}
  .test-header{padding:8px 12px;}
  .test-header-title{font-size:0.9rem;}
  .msg-list{padding:16px 12px;}
  .msg{max-width:92%;}
  .avatar-sm{width:28px;height:28px;}
  .bubble{padding:10px 14px;font-size:0.8125rem;}
  .input-area{padding:8px 12px;padding-bottom:max(8px, env(safe-area-inset-bottom));}
  .input-row{gap:6px;}
  .input-wrap{padding:2px 12px;}
  .clip-btn{padding:8px;}
  .input-field{min-height:40px;font-size:16px;}
  .mob-nav-btn{padding:4px 8px;font-size:0.55rem;}
}

      </style>

      <div class="app-shell">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="sidebar-brand">
            <div class="sidebar-logo">H</div>
            <span class="sidebar-brand-name">${t.brand}</span>
          </div>
          <div class="sidebar-profile">
            <div class="sidebar-avatar">G</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${this.lang === 'en' ? 'Guest' : '\u8BBF\u5BA2'}</div>
              <div class="sidebar-user-role">${t.role}</div>
            </div>
          </div>
          <nav class="sidebar-nav">
            ${navItems.map(item => `
              <button class="nav-item ${item.id === this.activeNav ? 'active' : ''}" data-id="${item.id}">
                <span class="nav-icon">${this.icon(item.icon)}</span>
                ${item.label}
              </button>
            `).join('')}
          </nav>
          <div class="sidebar-bottom">
            <button class="sidebar-btn" id="langBtn">${this.icon('globe')} ${this.lang === 'en' ? 'CN' : 'EN'}</button>
            <button class="sidebar-btn" id="loginBtn">${this.icon('login')} ${t.login}</button>
          </div>
        </div>

        <!-- Main -->
        <div class="main-area">
          <div class="content-container" id="mainContent"></div>

          <!-- Mobile Nav -->
          <div class="mobile-nav">
            ${[
              { id: 'home', icon: 'home', label: t.home },
              { id: 'chat', icon: 'chat', label: t.chat },
              { id: 'booking', icon: 'booking', label: t.booking },
              { id: 'journal', icon: 'journal', label: t.journal },
              { id: 'assessment', icon: 'assessment', label: t.assessment },
            ].map(item => `
              <button class="mob-nav-btn ${item.id === this.activeNav ? 'active' : ''}" data-id="${item.id}">
                ${this.icon(item.icon, 18)}
                ${item.label}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Events
    s.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => this.handleNavClick(btn.dataset.id));
    });
    s.querySelectorAll('.mob-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleNavClick(btn.dataset.id));
    });
    s.getElementById('langBtn').addEventListener('click', () => {
      this.lang = this.lang === 'en' ? 'zh' : 'en';
      this.render();
    });

    this.renderHub();
  }
}

customElements.define('assessment-hub', AssessmentHub);
