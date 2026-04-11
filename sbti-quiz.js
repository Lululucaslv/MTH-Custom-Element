/**
 * SBTI Quiz — Wix Custom Element
 * 纯 vanilla JS Web Component，无框架依赖
 * 用于嵌入 Wix 页面，通过 setAttribute 接收会员信息
 */
class SbtiQuiz extends HTMLElement {
  static get observedAttributes() {
    return ['user-id', 'user-email', 'user-name'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.userId = 'guest';
    this.userEmail = '';
    this.userName = '访客';
    this.screen = 'intro';
    this.currentQuestion = 0;
    this.shuffledQuestions = [];
    this.dimensions = {};
    this.resultType = null;
    this.similarity = 0;
    this.allDimensions = ['S1','S2','S3','E1','E2','E3','A1','A2','A3','Ac1','Ac2','Ac3','So1','So2','So3'];
    this.allDimensions.forEach(d => this.dimensions[d] = 0);
  }

  connectedCallback() { this.render(); }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'user-id') this.userId = newVal || 'guest';
    if (name === 'user-email') this.userEmail = newVal || '';
    if (name === 'user-name') this.userName = newVal || '访客';
  }

  // ─── 题目数据 ───
  get questions() {
    return [
      { dimension:'S1', zh:'我不仅是屌丝，我还是joker，早上起来一照镜子，镜子碎了；走在街上，乌鸦掉下来；说句话，狗都躲，我就是这么铁血。', options:[{text:'我哭了。。',value:1},{text:'这是什么。。',value:2},{text:'这不是我！',value:3}]},
      { dimension:'S1', zh:'我不够好，周围的人都比我优秀', options:[{text:'确实',value:1},{text:'有时',value:2},{text:'不是',value:3}]},
      { dimension:'S2', zh:'我很清楚真正的自己是什么样的', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
      { dimension:'S2', zh:'我内心有真正追求的东西', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
      { dimension:'S3', zh:'我一定要不断往上爬、变得更厉害', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
      { dimension:'S3', zh:'外人的评价对我来说无所吊谓。', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
      { dimension:'E1', zh:'对象超过5小时没回消息，说自己窜稀了，你会怎么想？', options:[{text:'拉稀不可能5小时，也许ta隐瞒了我。',value:1},{text:'在信任和怀疑之间摇摆。',value:2},{text:'也许今天ta真的不太舒服。',value:3}]},
      { dimension:'E1', zh:'我在感情里经常担心被对方抛弃', options:[{text:'是的',value:1},{text:'偶尔',value:2},{text:'不是',value:3}]},
      { dimension:'E2', zh:'我对天发誓，我对待每一份感情都是认真的！', options:[{text:'并没有',value:1},{text:'也许？',value:2},{text:'是的！（问心无愧骄傲脸）',value:3}]},
      { dimension:'E2', zh:'你的恋爱对象是一个専老爱幼，温柔敦厚，顾家爱你，还有点小幼默的人（总之就是完美人设），此时你会？', options:[{text:'就算ta再优秀我也不会陷入太深。',value:1},{text:'会介于A和C之间。',value:2},{text:'会非常珍惜ta，也许会变成恋爱脑。',value:3}]},
      { dimension:'E3', zh:'恋爱后，对象非常黏人，你作何感想？', options:[{text:'那很爽了',value:1},{text:'都行无所谓',value:2},{text:'我更喜欢保留独立空间',value:3}]},
      { dimension:'E3', zh:'我在任何关系里都很重视个人空间', options:[{text:'我更喜欢依赖与被依赖',value:1},{text:'看情况',value:2},{text:'是的！（斩钉截铁地说道）',value:3}]},
      { dimension:'A1', zh:'大多数人是善良的', options:[{text:'其实邪恶的人心比世界上的痔疮更多。',value:1},{text:'也许吧。',value:2},{text:'是的，我愿相信好人更多。',value:3}]},
      { dimension:'A1', zh:'你走在街上，一位萌萌的小女孩蹦蹦跳跳地朝你走来，递给你一根棒棒糖，此时你作何感想？', options:[{text:'这也许是一种新型诈骗？还是走开为好。',value:1},{text:'一脸懵逼，作挠头状',value:2},{text:'呜呜她真好真可爱！居然给我棒棒糖！',value:3}]},
      { dimension:'A2', zh:'快考试了，学校规定忁须上晚自习。你本来打算玩游戏，现在你会？', options:[{text:'翘了！反正就一次！',value:1},{text:'干脆请个假吧。',value:2},{text:'都快考试了还去啥。',value:3}]},
      { dimension:'A2', zh:'我喜欢打破常规，不喜欢被束缚', options:[{text:'认同',value:1},{text:'保持中立',value:2},{text:'不认同',value:3}]},
      { dimension:'A3', zh:'我做事通常有目标。', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
      { dimension:'A3', zh:'突然某一天，我意识到人生哪有什么他妈的狗屁意义，一切都是虚无，我们只是宇宙尘埃。', options:[{text:'是这样的。',value:1},{text:'也许是，也许不是。',value:2},{text:'这简直是胡扯',value:3}]},
      { dimension:'Ac1', zh:'我做事主要为了取得成果和进步，而不是避免麻烦和风险。', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
      { dimension:'Ac1', zh:'你因便秘坐在马桶上（已长达30分钟），你会？', options:[{text:'再坐三十分钟看看，说不定就有了。',value:1},{text:'用力拍打自己的屁股并说："死屁股，快拉啊！"',value:2},{text:'使用开塞露，快点拉出来才好。',value:3}]},
      { dimension:'Ac2', zh:'我做决定比较果断，不喜欢特豫', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
      { dimension:'Ac2', zh:'此题没有题目，请皜选', options:[{text:'反复思考后感觉应该选A？',value:1},{text:'啊，要不选B？',value:2},{text:'不会就选C？',value:3}]},
      { dimension:'Ac3', zh:'别人说你"执行力强"，你内心更接近哪句？', options:[{text:'我被逼到最后确实执行力超强。。。',value:1},{text:'啊，有时候吧。',value:2},{text:'是的，事情本来就该被推进',value:3}]},
      { dimension:'Ac3', zh:'我做事常常有计划，____', options:[{text:'然而计划不如变化快。',value:1},{text:'有时能完成，有时不能。',value:2},{text:'我讨厌被打破计划。',value:3}]},
      { dimension:'So1', zh:'你因玩《第五人格》和网友开了话音，打了一个月游戏后，有网友约你线下见面，你会？', options:[{text:'网上口嗨下就算了，真见面还是有点忐忑。',value:1},{text:'见网友也挺好，反正谁来聊我就聊两句。',value:2},{text:'我会打扮一番并热情聊天，万一呢，我是说万一呢？',value:3}]},
      { dimension:'So1', zh:'朋友带了ta的朋友一起来玩，你最可能的状态是', options:[{text:'对"朋友的朋友"天然有点距离感，怕影响二人关系',value:1},{text:'看对方，能玩就玩。',value:2},{text:'朋友的朋友应该也算我的朋友！要热情聊天',value:3}]},
      { dimension:'So2', zh:'我和人相处主打一个电子围栏，靠太近会自动报警。', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
      { dimension:'So2', zh:'我渴望和我信任的人关系密切，熟得像失敥多年的亲戚。', options:[{text:'认同',value:1},{text:'中立',value:2},{text:'不认同',value:3}]},
      { dimension:'So3', zh:'有时候你明白对一件事有不同的、负面的看法，但最后没说出来', options:[{text:'这种情况较少。',value:1},{text:'可能碍于情面或者关系。',value:2},{text:'不想让别人知道自己是个阴暗的人。',value:3}]},
      { dimension:'So3', zh:'我在不同人面前会表现出不一样的自己', options:[{text:'不认同',value:1},{text:'中立',value:2},{text:'认同',value:3}]},
    ];
  }

  // ─── 人格类型数据 ───
  get personalityTypes() {
    return {
      CTRL:{cn:'拿捏者',intro:'怎么样，被我拿捏了吧？',summary:'你天生就有掌控全局的气场。自信、清晰、有目标，游刃有余地驾驭人生。',pattern:{S1:'H',S2:'H',S3:'H',E1:'H',E2:'M',E3:'H',A1:'M',A2:'H',A3:'H',Ac1:'H',Ac2:'H',Ac3:'H',So1:'M',So2:'H',So3:'M'}},
      'ATM-er':{cn:'送钱者',intro:'你以为我很有钱吗？',summary:'你对人慷慨大方，容易为他人付出。有信心但也容易被利用。',pattern:{S1:'H',S2:'H',S3:'H',E1:'H',E2:'H',E3:'M',A1:'H',A2:'H',A3:'H',Ac1:'H',Ac2:'M',Ac3:'H',So1:'M',So2:'H',So3:'L'}},
      'Dior-s':{cn:'屌丝',intro:'等着我屌丝逆袭。',summary:'自我评价偏低，但内心有冲劲。经历会让你更懂生活，潜力巨大。',pattern:{S1:'M',S2:'H',S3:'M',E1:'M',E2:'M',E3:'H',A1:'M',A2:'H',A3:'M',Ac1:'H',Ac2:'M',Ac3:'H',So1:'L',So2:'H',So3:'L'}},
      BOSS:{cn:'领导者',intro:'方向盘给我，我来开。',summary:'天生的领导者。自信、果决、有远见，天然吸引他人跟随。',pattern:{S1:'H',S2:'H',S3:'H',E1:'H',E2:'M',E3:'H',A1:'M',A2:'M',A3:'H',Ac1:'H',Ac2:'H',Ac3:'H',So1:'L',So2:'H',So3:'L'}},
      'THAN-K':{cn:'感恩者',intro:'我感谢苍天！我感谢大地！',summary:'心态积极，懂得感恩。虽然自信度一般，但能从容应对生活的起伏。',pattern:{S1:'M',S2:'H',S3:'M',E1:'H',E2:'M',E3:'M',A1:'H',A2:'H',A3:'M',Ac1:'M',Ac2:'M',Ac3:'H',So1:'M',So2:'H',So3:'L'}},
      'OH-NO':{cn:'哦不人',intro:'哦不！我怎么会是这个人格？！',summary:'自信不足，对世界有戒心。但也会有突然的热情和能量。',pattern:{S1:'H',S2:'H',S3:'L',E1:'L',E2:'M',E3:'H',A1:'L',A2:'H',A3:'H',Ac1:'H',Ac2:'H',Ac3:'M',So1:'L',So2:'H',So3:'L'}},
      GOGO:{cn:'行者',intro:'gogogo~出发咯',summary:'行动派，充满能量和热情。不太在乎自我认知，就是想往前冲。',pattern:{S1:'H',S2:'H',S3:'M',E1:'H',E2:'M',E3:'H',A1:'M',A2:'M',A3:'H',Ac1:'H',Ac2:'H',Ac3:'H',So1:'M',So2:'H',So3:'M'}},
      SEXY:{cn:'尤物',intro:'您就是天生的尤物！',summary:'魅力十足，懂得吸引人。有点自信的焦虑，但整体很有气质。',pattern:{S1:'H',S2:'M',S3:'H',E1:'H',E2:'H',E3:'L',A1:'H',A2:'M',A3:'M',Ac1:'H',Ac2:'M',Ac3:'M',So1:'H',So2:'L',So3:'H'}},
      'LOVE-R':{cn:'多情者',intro:'爱意太满，现实显得有点贫瘠。',summary:'情感丰富，容易沉浸在感情中。一旦爱上就是全身心投入。',pattern:{S1:'M',S2:'L',S3:'H',E1:'L',E2:'H',E3:'L',A1:'H',A2:'L',A3:'H',Ac1:'M',Ac2:'L',Ac3:'M',So1:'M',So2:'L',So3:'H'}},
      MUM:{cn:'妈妈',intro:'或许...我可以叫你妈妈吗....?',summary:'母性光辉，照顾他人的天赋。自己可能不够自信，但能给人安全感。',pattern:{S1:'M',S2:'M',S3:'H',E1:'M',E2:'H',E3:'L',A1:'H',A2:'M',A3:'M',Ac1:'L',Ac2:'M',Ac3:'M',So1:'H',So2:'L',So3:'L'}},
      FAKE:{cn:'伪人',intro:'已经，没有人类了。',summary:'高度的自我欺骗，活在自己构建的世界里。懂得社交但也很疲惫。',pattern:{S1:'H',S2:'L',S3:'M',E1:'M',E2:'M',E3:'L',A1:'M',A2:'L',A3:'M',Ac1:'M',Ac2:'L',Ac3:'M',So1:'H',So2:'L',So3:'H'}},
      OJBK:{cn:'无所谓人',intro:'我说随便，是真的随便。',summary:'随性洒脱，对很多事都无所谓。既不极端乐观也不悲观。',pattern:{S1:'M',S2:'M',S3:'H',E1:'M',E2:'M',E3:'M',A1:'H',A2:'M',A3:'L',Ac1:'L',Ac2:'M',Ac3:'M',So1:'M',So2:'M',So3:'L'}},
      MALO:{cn:'吗喽',intro:'人生是个副本，而我只是一只吗喽。',summary:'有点自嘲，但也有往上爬的心。感情投入少，但做事还算积极。',pattern:{S1:'M',S2:'L',S3:'H',E1:'M',E2:'H',E3:'M',A1:'M',A2:'L',A3:'H',Ac1:'M',Ac2:'L',Ac3:'H',So1:'L',So2:'M',So3:'H'}},
      'JOKE-R':{cn:'小丑',intro:'原来我们都是小丑。',summary:'自我贬低，但也很会搞笑。内心有颓废感，但表面保持幽默。',pattern:{S1:'L',S2:'L',S3:'H',E1:'L',E2:'H',E3:'L',A1:'L',A2:'M',A3:'L',Ac1:'L',Ac2:'L',Ac3:'L',So1:'M',So2:'L',So3:'M'}},
      'WOC!':{cn:'握草人',intro:'卧槽，我怎么是这个人格？',summary:'惊讶于自己，其实很有能力和热情。适应力强，做事有条理。',pattern:{S1:'H',S2:'H',S3:'L',E1:'H',E2:'M',E3:'H',A1:'M',A2:'M',A3:'H',Ac1:'H',Ac2:'H',Ac3:'M',So1:'L',So2:'H',So3:'H'}},
      'THIN-K':{cn:'思考者',intro:'已深度思考100s。',summary:'深思熟虑，内向型的思考者。有自己的价值观，但社交不是强项。',pattern:{S1:'H',S2:'H',S3:'L',E1:'H',E2:'M',E3:'H',A1:'M',A2:'L',A3:'H',Ac1:'M',Ac2:'H',Ac3:'M',So1:'L',So2:'H',So3:'H'}},
      SHIT:{cn:'愤世者',intro:'这个世界，构石一坨。',summary:'愤世嫉俗，但也有执行力。看透很多东西，有点悲观但不无能。',pattern:{S1:'H',S2:'H',S3:'L',E1:'H',E2:'L',E3:'H',A1:'L',A2:'M',A3:'M',Ac1:'H',Ac2:'H',Ac3:'M',So1:'L',So2:'H',So3:'H'}},
      ZZZZ:{cn:'装死者',intro:'我没死，我只是在睡觉。',summary:'佛系躺平，对生活没什么欲望。不追求，也不特别拒绝。',pattern:{S1:'M',S2:'H',S3:'L',E1:'M',E2:'L',E3:'H',A1:'L',A2:'M',A3:'L',Ac1:'M',Ac2:'M',Ac3:'L',So1:'L',So2:'H',So3:'M'}},
      POOR:{cn:'贫困者',intro:'我穷，但我很专。',summary:'资源少但很执着。看世界有防御但做事很专业。专注力强。',pattern:{S1:'H',S2:'H',S3:'L',E1:'M',E2:'L',E3:'H',A1:'L',A2:'M',A3:'H',Ac1:'H',Ac2:'H',Ac3:'H',So1:'L',So2:'H',So3:'L'}},
      MONK:{cn:'僧人',intro:'没有那种世俗的欲望。',summary:'看破红尘，内心平静。不太在乎成就和关系，就是想修行。',pattern:{S1:'H',S2:'H',S3:'L',E1:'L',E2:'L',E3:'H',A1:'L',A2:'L',A3:'M',Ac1:'M',Ac2:'M',Ac3:'L',So1:'L',So2:'H',So3:'M'}},
      IMSB:{cn:'傻者',intro:'认真的么？我真的是傻逼么？',summary:'自我评价极低，但不是全无能力。内心有很多自我质疑。',pattern:{S1:'L',S2:'L',S3:'M',E1:'L',E2:'M',E3:'M',A1:'L',A2:'L',A3:'L',Ac1:'L',Ac2:'L',Ac3:'L',So1:'M',So2:'L',So3:'M'}},
      SOLO:{cn:'孤儿',intro:'我哭了，我怎么会是孤儿？',summary:'孤独感重，缺乏安全感。有自我认知但也很防守。',pattern:{S1:'L',S2:'M',S3:'L',E1:'L',E2:'L',E3:'H',A1:'L',A2:'H',A3:'L',Ac1:'L',Ac2:'M',Ac3:'L',So1:'L',So2:'H',So3:'M'}},
      FUCK:{cn:'草者',intro:'操！这是什么人格？',summary:'感受不佳，做事风格混乱。有时有热情，但容易陷入自我怀疑。',pattern:{S1:'M',S2:'L',S3:'L',E1:'L',E2:'H',E3:'L',A1:'L',A2:'L',A3:'M',Ac1:'M',Ac2:'L',Ac3:'L',So1:'H',So2:'L',So3:'H'}},
      DEAD:{cn:'死者',intro:'我，还活着吗？',summary:'活得很消沉，对什么都没热情。可能在经历低谷。',pattern:{S1:'L',S2:'L',S3:'L',E1:'L',E2:'L',E3:'M',A1:'L',A2:'M',A3:'L',Ac1:'L',Ac2:'L',Ac3:'L',So1:'L',So2:'H',So3:'M'}},
      IMFW:{cn:'废物',intro:'我真的...是废物吗？',summary:'自我认知不足，做事缺乏方向。但还有改变的可能。',pattern:{S1:'L',S2:'L',S3:'H',E1:'L',E2:'H',E3:'L',A1:'M',A2:'L',A3:'L',Ac1:'L',Ac2:'L',Ac3:'L',So1:'M',So2:'L',So3:'L'}},
      HHHH:{cn:'傻乐者',intro:'哈哈哈哈哈哈。',summary:'性格不明显，或者太平衡。开心就好，别想太多。',pattern:{S1:'H',S2:'H',S3:'H',E1:'H',E2:'H',E3:'H',A1:'H',A2:'H',A3:'H',Ac1:'H',Ac2:'H',Ac3:'H',So1:'H',So2:'H',So3:'H'}},
    };
  }

  // ─── 维度描述 ───
  get dimensionDescriptions() {
    return {
      S1:{L:'对自己下手比别人还狠，夸你两句你都想先验明真伪。',M:'自信值随天气波动，顺风能飞，逆风先缩。',H:'心里对自己大致有数，不太会被路人一句话打散。'},
      S2:{L:'内心频道雪花较多，常在"我是谁"里循环缓存。',M:'平时还能认出自己，偶尔也会被情绪临时换号。',H:'对自己的脾气、欲望和底线都算门儿清。'},
      S3:{L:'更在意舒服和安全，没必要天天给人生开冲刺模式。',M:'想上进，也想躺会儿，价值排序经常内部开会。',H:'很容易被目标、成长或某种重要信念推着往前。'},
      E1:{L:'感情里警报器灵敏，已读不回都能脑补到大结局。',M:'一半信任，一半试探，感情里常在心里拉锯。',H:'更愿意相信关系本身，不会被一点风吹草动吓散。'},
      E2:{L:'感情投入偏克制，心门不是没开，是门禁太严。',M:'会投入，但会给自己留后手，不至于全盘梭哈。',H:'一旦认定就容易认真，情绪和精力都给得很足。'},
      E3:{L:'容易黏人也容易被黏，关系里的温度感很重要。',M:'亲密和独立都要一点，属于可调节型依赖。',H:'空间感很重要，再爱也得留一块属于自己的地。'},
      A1:{L:'看世界自带防御滤镜，先怀疑，再靠近。',M:'既不天真也不彻底阴谋论，观望是你的本能。',H:'更愿意相信人性和善意，遇事不急着把世界判死刑。'},
      A2:{L:'规则能绕就绕，舒服和自由往往排在前面。',M:'该守的时候守，该变通的时候也不死磕。',H:'秩序感较强，能按流程来就不爱即兴炸场。'},
      A3:{L:'意义感偏低，容易觉得很多事都像在走过场。',M:'偶尔有目标，偶尔也想摆烂，人生观处于半开机。',H:'做事更有方向，知道自己大概要往哪边走。'},
      Ac1:{L:'做事先考虑别翻车，避险系统比野心更先启动。',M:'有时想赢，有时只想别麻烦，动机比较混合。',H:'更容易被成果、成长和推进感点燃。'},
      Ac2:{L:'做决定前容易多转几圈，脑内会议常常超时。',M:'会想，但不致于想死机，属于正常犹豫。',H:'拍板速度快，决定一下就不爱回头磨叽。'},
      Ac3:{L:'执行力和死线有深厚感情，越晚越像要觉醒。',M:'能做，但状态看时机，偶尔稳偶尔摆。',H:'推进欲比较强，事情不落地心里都像卡了根刺。'},
      So1:{L:'社交启动慢热，主动出击这事通常得攒半天气。',M:'有人来就接，没人来也不硬凑，社交弹性一般。',H:'更愿意主动打开场子，在人群里不太怕露头。'},
      So2:{L:'关系里更想亲近和融合，熟了就容易把人划进内圈。',M:'既想亲近又想留缝，边界感看对象调节。',H:'边界感偏强，靠太近会先本能性后退半步。'},
      So3:{L:'表达更直接，心里有啥基本不爱绕。',M:'会看气氛说话，真实和体面通常各留一点。',H:'对不同场景的自我切换更熟练，真实感会分层发放。'},
    };
  }

  // ─── 工具方法 ───
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  startQuiz() {
    this.shuffledQuestions = this.shuffle(this.questions);
    this.allDimensions.forEach(d => this.dimensions[d] = 0);
    this.currentQuestion = 0;
    this.screen = 'questions';
    this.render();
  }

  handleAnswer(value) {
    const q = this.shuffledQuestions[this.currentQuestion];
    this.dimensions[q.dimension] += value;
    if (this.currentQuestion < this.shuffledQuestions.length - 1) {
      this.currentQuestion++;
      this.render();
    } else {
      this.calculateResult();
    }
  }

  calculateResult() {
    const levels = {};
    this.allDimensions.forEach(dim => {
      const s = this.dimensions[dim];
      levels[dim] = s <= 3 ? 'L' : s >= 5 ? 'H' : 'M';
    });

    let bestType = 'HHHH', bestDist = Infinity, bestSim = 0;
    const types = this.personalityTypes;
    for (const [key, data] of Object.entries(types)) {
      let dist = 0;
      for (const dim of this.allDimensions) {
        const uv = levels[dim] === 'L' ? 1 : levels[dim] === 'M' ? 2 : 3;
        const tv = data.pattern[dim] === 'L' ? 1 : data.pattern[dim] === 'M' ? 2 : 3;
        dist += Math.abs(uv - tv);
      }
      const sim = Math.max(0, 100 - dist * 3);
      if (dist < bestDist) { bestDist = dist; bestType = key; bestSim = sim; }
    }
    if (bestSim < 60) { bestType = 'HHHH'; bestSim = 50; }

    this.resultType = bestType;
    this.similarity = bestSim;
    this.screen = 'result';
    this.render();

    this.dispatchEvent(new CustomEvent('quizComplete', {
      detail: {
        userId: this.userId, userEmail: this.userEmail, userName: this.userName,
        type: bestType, typeName: types[bestType].cn,
        scores: { ...this.dimensions }, timestamp: new Date().toISOString(),
      },
      bubbles: true, composed: true,
    }));
  }

  // ─── 渲染 ───
  render() {
    const s = this.shadowRoot;
    if (this.screen === 'intro') { s.innerHTML = this.renderIntro(); }
    else if (this.screen === 'questions') { s.innerHTML = this.renderQuestion(); }
    else if (this.screen === 'result') { s.innerHTML = this.renderResult(); }
    this.attachEvents();
  }

  renderIntro() {
    return `
      <style>${this.styles}</style>
      <div class="container intro">
        <h1>SBTI 人格鉴定</h1>
        <p class="subtitle">MBTI已经过时，SBTI来了。</p>
        <button id="startBtn" class="btn primary">开始测试</button>
        <p class="disclaimer">本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。</p>
      </div>`;
  }

  renderQuestion() {
    const q = this.shuffledQuestions[this.currentQuestion];
    const progress = ((this.currentQuestion + 1) / this.shuffledQuestions.length * 100).toFixed(0);
    return `
      <style>${this.styles}</style>
      <div class="container question">
        <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
        <p class="counter">第 ${this.currentQuestion + 1} / ${this.shuffledQuestions.length} 题</p>
        <h2>${q.zh}</h2>
        <div class="options">
          ${q.options.map((o, i) => `<button class="btn option" data-value="${o.value}">${String.fromCharCode(65 + i)}. ${o.text}</button>`).join('')}
        </div>
      </div>`;
  }

  renderResult() {
    const t = this.personalityTypes[this.resultType];
    const levels = {};
    this.allDimensions.forEach(dim => {
      const s = this.dimensions[dim];
      levels[dim] = s <= 3 ? 'L' : s >= 5 ? 'H' : 'M';
    });
    const desc = this.dimensionDescriptions;

    return `
      <style>${this.styles}</style>
      <div class="container result">
        <div class="result-card">
          <h1 class="type-name">${this.resultType}（${t.cn}）</h1>
          <p class="intro-text">${t.intro}</p>
          <div class="summary-box"><p>${t.summary}</p></div>
          <div class="match-bar">
            <span>匹配度：</span>
            <div class="bar-bg"><div class="bar-fill" style="width:${this.similarity}%"></div></div>
            <span class="match-pct">${Math.round(this.similarity)}%</span>
          </div>
        </div>
        <div class="dimensions-card">
          <h2>你的15维度分析</h2>
          <div class="dim-grid">
            ${this.allDimensions.map(dim => `
              <div class="dim-item">
                <div class="dim-header">
                  <span class="dim-name">${dim}</span>
                  <span class="dim-level level-${levels[dim]}">${levels[dim]}</span>
                </div>
                <p class="dim-desc">${desc[dim][levels[dim]]}</p>
              </div>`).join('')}
          </div>
        </div>
        <button id="retryBtn" class="btn primary" style="margin-top:24px;">重新测试</button>
      </div>`;
  }

  attachEvents() {
    const s = this.shadowRoot;
    const startBtn = s.getElementById('startBtn');
    if (startBtn) startBtn.addEventListener('click', () => this.startQuiz());

    const retryBtn = s.getElementById('retryBtn');
    if (retryBtn) retryBtn.addEventListener('click', () => { this.screen = 'intro'; this.render(); });

    s.querySelectorAll('.option').forEach(btn => {
      btn.addEventListener('click', () => this.handleAnswer(parseInt(btn.dataset.value)));
    });
  }

  // ─── 样式 ───
  get styles() {
    return `
      :host { display:block; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color:#1a1a2e; }
      * { box-sizing:border-box; margin:0; padding:0; }
      .container { min-height:500px; padding:32px 20px; }
      .intro { background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; border-radius:16px; }
      .intro h1 { color:#fff; font-size:2.2em; margin-bottom:8px; }
      .intro .subtitle { color:#a5b4fc; font-size:1.1em; margin-bottom:32px; }
      .intro .disclaimer { color:#6b7280; font-size:0.8em; margin-top:24px; max-width:360px; }
      .btn { border:none; cursor:pointer; font-size:1em; border-radius:12px; padding:14px 28px; transition:all 0.2s; width:100%; max-width:400px; }
      .btn.primary { background:#4f46e5; color:#fff; font-weight:600; font-size:1.1em; }
      .btn.primary:hover { background:#4338ca; }
      .question { background:#f8fafc; border-radius:16px; }
      .progress-bar { width:100%; height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden; margin-bottom:12px; }
      .progress-fill { height:100%; background:#4f46e5; border-radius:4px; transition:width 0.3s; }
      .counter { color:#6b7280; font-size:0.9em; margin-bottom:24px; }
      .question h2 { font-size:1.3em; color:#1e293b; margin-bottom:28px; line-height:1.6; }
      .options { display:flex; flex-direction:column; gap:12px; }
      .btn.option { background:#fff; border:2px solid #d1d5db; color:#1e293b; text-align:left; font-weight:500; padding:16px 20px; }
      .btn.option:hover { border-color:#4f46e5; background:#eef2ff; }
      .result { background:#f8fafc; border-radius:16px; }
      .result-card { background:#fff; border-radius:16px; padding:32px; box-shadow:0 4px 24px rgba(0,0,0,0.08); margin-bottom:24px; }
      .type-name { color:#4f46e5; font-size:2em; margin-bottom:8px; }
      .intro-text { color:#6b7280; font-size:1.1em; margin-bottom:16px; }
      .summary-box { background:#eef2ff; border-left:4px solid #4f46e5; padding:16px; border-radius:0 8px 8px 0; margin-bottom:20px; }
      .summary-box p { color:#1e293b; line-height:1.6; }
      .match-bar { display:flex; align-items:center; gap:12px; }
      .match-bar span { font-size:0.9em; color:#4b5563; font-weight:600; }
      .bar-bg { flex:1; height:16px; background:#e2e8f0; border-radius:8px; overflow:hidden; }
      .bar-fill { height:100%; background:linear-gradient(90deg,#4f46e5,#7c3aed); border-radius:8px; }
      .match-pct { color:#4f46e5; font-weight:700; }
      .dimensions-card { background:#fff; border-radius:16px; padding:32px; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
      .dimensions-card h2 { font-size:1.4em; margin-bottom:20px; }
      .dim-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
      .dim-item { border:1px solid #e2e8f0; border-radius:12px; padding:16px; }
      .dim-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
      .dim-name { font-weight:700; font-size:1em; }
      .dim-level { display:inline-block; padding:2px 12px; border-radius:20px; color:#fff; font-weight:700; font-size:0.85em; }
      .level-L { background:#3b82f6; } .level-M { background:#eab308; } .level-H { background:#ef4444; }
      .dim-desc { color:#4b5563; font-size:0.9em; line-height:1.5; }
    `;
  }
}

customElements.define('sbti-quiz', SbtiQuiz);
