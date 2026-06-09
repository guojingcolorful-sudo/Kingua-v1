import React, { useState, useEffect, useRef } from "react";
import { 
  Headphones, 
  Layers, 
  Hexagon, 
  Zap, 
  Link as LinkIcon, 
  FileAudio, 
  BookOpen, 
  ChevronLeft, 
  Play, 
  Pause, 
  Repeat, 
  Trash2, 
  X, 
  Activity, 
  Volume2, 
  ArrowRight, 
  Search, 
  Star, 
  Settings, 
  RotateCcw,
  Smartphone,
  MessageCircle,
  AlertTriangle,
  Info,
  Flame,
  Plus,
  Eye,
  EyeOff,
  CornerDownRight,
  Database,
  Cpu,
  RefreshCcw,
  ZoomIn,
  Sparkles,
  ChevronDown,
  Check,
  Inbox,
  Download,
  Image as ImageIcon,
  MoreHorizontal,
  Mic,
  ChevronRight,
  FileText,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Lesson, Sentence, SyntaxBlock, Vocabulary, UserStats, UserSettings } from "./types";
import { DEFAULT_LESSONS, DEFAULT_VOCABULARIES } from "./data";

// Syllable syllable splitting definitions for vocabulary memorization and phonetic spelling
const SYLLABLE_DICT: Record<string, string> = {
  graduated: "grad·u·at·ed",
  obvious: "ob·vi·ous",
  commencement: "com·mence·ment",
  satisfying: "sat·is·fy·ing",
  molecule: "mol·e·cule",
  motivation: "mo·ti·va·tion",
  surprise: "sur·prise",
  behavior: "be·hav·ior",
  attractive: "at·trac·tive",
  college: "col·lege",
  connecting: "con·nect·ing",
  dopamine: "do·pa·mine",
  graduation: "grad·u·a·tion",
  obviousness: "ob·vi·ous·ness",
  unsatisfying: "un·sat·is·fy·ing",
  connect: "con·nect",
  stories: "sto·ries",
  story: "sto·ry",
  today: "to·day",
  closest: "clos·est",
  truth: "truth",
  whenever: "when·ev·er"
};

export function splitWordIntoSyllables(word: string): string {
  if (!word) return "";
  const clean = word.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (SYLLABLE_DICT[clean]) {
    return SYLLABLE_DICT[clean];
  }
  if (clean.length <= 4) return clean;
  
  const syllables: string[] = [];
  const isVowel = (char: string) => "aeiouy".includes(char);
  
  let i = 0;
  let currentChunk = "";
  while (i < clean.length) {
    currentChunk += clean[i];
    if (isVowel(clean[i]) && i + 1 < clean.length && !isVowel(clean[i+1])) {
      if (i + 2 < clean.length && !isVowel(clean[i+2])) {
        currentChunk += clean[i+1];
        syllables.push(currentChunk);
        currentChunk = "";
        i += 2;
        continue;
      } else {
        syllables.push(currentChunk);
        currentChunk = "";
        i += 1;
        continue;
      }
    }
    i++;
  }
  if (currentChunk) {
    syllables.push(currentChunk);
  }
  
  const result = syllables.filter(Boolean).join("·");
  return result || clean;
}

// Cybernetic synth audio-effects helper using Web Audio API to match the "physics physical tactile click" requirement in the PRD
function playSynthBeep(type: 'click' | 'success' | 'save' | 'glitch' | 'block' | 'roulette') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'save') {
      // Custom clear bubble glass break-pop sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'glitch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'block') {
      // Low rumble warning
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'roulette') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    }
  } catch (e) {
    // browser auto-play restriction safety
  }
}

// Text-to-speech engine wrapper
function speakTextEn(text: string) {
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95; // Slightly slower for better cognitive absorption
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("TTS initialization failed on this platform.", e);
  }
}

function getWordRootAnalysis(word: string): { root: string; prefix?: string; suffix?: string; detail: string } {
  const w = word.toLowerCase().trim();
  if (w.includes("graduate")) {
    return { root: "gradu- (step, degree; 步，度，级)", suffix: "-ate (动词后缀，意为使...)", detail: "源于拉丁语 gradus。表示按部就班经历等级最终获得学位。" };
  }
  if (w.includes("obvious")) {
    return { prefix: "ob- (toward, against; 朝向，对着)", root: "vi- (way, road; 道路)", suffix: "-ous (形容词后缀，充满的)", detail: "字面意思是 '在道路中央迎面而来'，因此表示显而易见、不言自明。" };
  }
  if (w.includes("commence")) {
    return { prefix: "com- (together; 共同)", root: "init- / menc- (begin; 开始)", suffix: "-ment (名词后缀)", detail: "源于古法语, 共同开启新的旅程，现专指极具仪式感的学位授予/毕业典礼。" };
  }
  if (w.includes("molecule")) {
    return { root: "mole- (mass; 质量/块体)", suffix: "-cule (指小词后缀，表极微小事物)", detail: "指极微小的质量质量单位，在现代科学中定义为化学中的 '分子'。" };
  }
  if (w.includes("motivation")) {
    return { root: "mot- (move; 移动)", suffix: "-ation (抽象名词后缀，表行为或状态)", detail: "源于拉丁语 movere (移动)，指促使脑神经或身体产生运动意愿的内驱力。" };
  }
  if (w.includes("behavior")) {
    return { prefix: "be- (thoroughly; 彻底、全面)", root: "have / hav- (to hold, control; 持有、掌控)", suffix: "-ior (名词后缀)", detail: "字面指全面地约束与指引自己的行为，表现出来的行为举止行为。" };
  }
  // Fallbacks based on common word suffixes
  if (w.endsWith("tion")) {
    return { root: `${w.slice(0, -4)}- (核心动词根)`, suffix: "-tion (动作/状态名词后缀)", detail: "常见拉丁语源派生名词后缀，将原本的行为转换成一种抽象概念或状态。" };
  }
  if (w.endsWith("ing")) {
    return { root: `${w.slice(0, -3)}- (活跃词根)`, suffix: "-ing (动名词 / 现在分词后缀)", detail: "表进行状态或正在发生的认知心流行为。" };
  }
  if (w.endsWith("able")) {
    return { root: `${w.slice(0, -4)}- (动词原形)`, suffix: "-able (具有...能力的形容词后缀)", detail: "表示可以被该动作执行的，表达具有某种明确的特质。" };
  }
  if (w.endsWith("ment")) {
    return { root: `${w.slice(0, -4)}- (行为源端)`, suffix: "-ment (表达动作产生结果的名词后缀)", detail: "表示某个动作行为产生的最终态、结果表现或物质载荷。" };
  }
  if (w.endsWith("ed")) {
    return { root: `${w.slice(0, -2)}- (原始印迹)`, suffix: "-ed (过去分词/形容词化后缀)", detail: "表已经完成或已被注入该特性的状态。" };
  }
  
  // Neutral split fallback
  const half = Math.ceil(w.length / 2);
  return { 
    root: `${w.slice(0, half)}- (词根核心)`, 
    suffix: `-${w.slice(half)} (派生构成件)`, 
    detail: "通过声波构词层级进行形态学粗拆分，以极简对齐帮助多动症快速归纳构词轮廓。" 
  };
}

export default function App() {
  // Persistence states
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem("lingua_lessons_v62");
    return saved ? JSON.parse(saved) : DEFAULT_LESSONS;
  });

  const [vocabularies, setVocabularies] = useState<Vocabulary[]>(() => {
    const saved = localStorage.getItem("lingua_vocabularies_v62");
    return saved ? JSON.parse(saved) : DEFAULT_VOCABULARIES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("lingua_favorites_v62");
    return saved ? JSON.parse(saved) : [
      "Today I want to tell you three stories.",
      "Dopamine is a molecule of motivation and surprise."
    ];
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("lingua_stats_v62");
    return saved ? JSON.parse(saved) : {
      streak: 14,
      totalTokens: 1240,
      wordCounts: { green: 4, yellow: 18, red: 10 }
    };
  });

  const [registrationDate] = useState<number>(() => {
    const saved = localStorage.getItem("lingua_registration_date_v62");
    if (saved) return parseInt(saved);
    const now = Date.now();
    localStorage.setItem("lingua_registration_date_v62", now.toString());
    return now;
  });

  const isNewUserWithinOneMonth = () => {
    return (Date.now() - registrationDate) < 30 * 24 * 60 * 60 * 1000;
  };

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("lingua_settings_v62");
    return saved ? JSON.parse(saved) : {
      zenModeDefault: true,
      whiteNoise: false,
      oledContrast: false
    };
  });

  const [isWechatBound, setIsWechatBound] = useState<boolean>(() => {
    return localStorage.getItem("lingua_wechat_bound") === "true";
  });

  const [wechatNickname, setWechatNickname] = useState<string>(() => {
    return localStorage.getItem("lingua_wechat_nickname") || "声波旅客_62";
  });
  const [bindPhoneChecked, setBindPhoneChecked] = useState<boolean>(false);
  const [loginRequiredReason, setLoginRequiredReason] = useState<string>("");

  // Active navigation states
  const [currentTab, setCurrentTab] = useState<'listen' | 'vault' | 'system'>('listen');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  
  // Immersive L2 controller
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isLoopingSentence, setIsLoopingSentence] = useState(false);
  
  // L3 Overlay/Modals
  const [deconstructSentenceId, setDeconstructSentenceId] = useState<string | null>(null);
  const [selectedPillIndex, setSelectedPillIndex] = useState<number | null>(null);
  const [dictSearchWord, setDictSearchWord] = useState<string | null>(null);
  
  // Custom paste url analyzer state
  const [pasteText, setPasteText] = useState("");
  const [showImport舱, setShowImport舱] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Local, customizable English voice and speed speech engine shadowing the global text to speech function
  const speakTextEn = (text: string, forceRate?: number) => {
    try {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      
      // Compute speed
      let rate = 0.95;
      if (forceRate) {
        rate = forceRate;
      } else {
        if (ttsSpeed === 'slow') rate = 0.7;
        else if (ttsSpeed === 'fast') rate = 1.25;
      }
      utterance.rate = rate;

      // Set voice
      if (ttsVoice !== "default" && availableVoices.length > 0) {
        const voiceObj = availableVoices.find(v => v.name === ttsVoice);
        if (voiceObj) {
          utterance.voice = voiceObj;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS initialization failed on this platform.", e);
    }
  };

  // Syllables hyphenation division tool for pronunciation-friendly memorization
  const getSyllables = (word: string): string => {
    const clean = word.toLowerCase().trim();
    if (clean === "obvious") return "ob • vi • ous";
    if (clean === "commencement") return "com • mence • ment";
    if (clean === "graduated") return "grad • u • at • ed";
    if (clean === "destined") return "des • tined";
    if (clean === "intuition") return "in • tu • i • tion";
    if (clean === "intellectual") return "in • tel • lec • tu • al";
    if (clean === "watermarked") return "wa • ter • marked";
    if (clean === "vocabulary") return "vo • cab • u • lar • y";
    if (clean === "immersion") return "im • mer • sion";
    if (clean === "synchronize") return "syn • chro • nize";
    if (clean === "cybernetic") return "cy • ber • net • ic";
    
    // Fallback syllable structure parser
    const vowels = "aeiouy";
    const matches = clean.match(/[aeiouy]{1,2}/g);
    if (!matches || matches.length <= 1) return clean;
    
    try {
      const parts: string[] = [];
      let currentPart = "";
      for (let i = 0; i < clean.length; i++) {
        currentPart += clean[i];
        const char = clean[i];
        if (vowels.includes(char) && i < clean.length - 1 && parts.length < 3) {
          if (!vowels.includes(clean[i+1]) && i + 2 < clean.length && vowels.includes(clean[i+2])) {
            parts.push(currentPart);
            currentPart = "";
          }
        }
      }
      if (currentPart) parts.push(currentPart);
      if (parts.length > 1) return parts.join(" • ");
    } catch (e) {}
    
    return clean.replace(/([bcdfghjklmnpqrstvwxz])([aeiouy])/g, "$1 • $2").replace(/•\s*•/g, "•");
  };

  // Check import resource count limit under different tiers
  const checkImportLimit = (): boolean => {
    if (!isPremiumUser && lessons.length >= 3) {
      setApiErrorMessage("普通免费版最多导入 3 个音视频/电子书资源。请激活 CYBER 极客会员以享受无限导入、全功能离线词典和 AI 精细分析特权！✨");
      setShowPaymentModal(true);
      return false;
    }
    return true;
  };

  // AI grammar analysis and automatic syllable parsing animation loader
  const triggerAiGrammarAnalysis = (sentenceId: string) => {
    playSynthBeep('click');
    if (!isWechatBound) {
      setApiErrorMessage("请先关联登录微信以自动同步和存储您的深度句法分析学习档案 🔐");
      setShowLoginModal(true);
      return;
    }
    if (!isPremiumUser) {
      setApiErrorMessage("很抱歉，普通试用版无权进行 AI 语法和精细句法标注分析。开通会员即可立享专属深度引擎破译！🌌");
      setShowPaymentModal(true);
      return;
    }

    setIsAiAnalyzing(true);
    setAiAnalyzingStepStr("🧙‍♂️ AI 语法引擎：正在唤醒深度神经网络分流解构器...");
    
    setTimeout(() => {
      setAiAnalyzingStepStr("🔬 词性标记与句法剖析：正在精细解析并标识主谓宾修饰成分...");
    }, 600);

    setTimeout(() => {
      setAiAnalyzingStepStr("⚡ 语篇对齐与翻译映射：正在生成多维度认知图层胶囊...");
    }, 1200);

    setTimeout(() => {
      setIsAiAnalyzing(false);
      setDeconstructSentenceId(sentenceId);
      setSelectedPillIndex(null);
    }, 1800);
  };

  // New States for Universal Extractor Grid & EPUB Reader
  const [activeImportTab, setActiveImportTab] = useState<'url' | 'media' | 'epub'>('url');
  const [localMediaFile, setLocalMediaFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [localImportProgress, setLocalImportProgress] = useState(0);
  const [activeBookPage, setActiveBookPage] = useState(0);
  const [isBookPlaying, setIsBookPlaying] = useState(false);
  const [activeBookSentenceIdx, setActiveBookSentenceIdx] = useState<number | null>(null);
  
  // Custom states for V6.2 functional optimization
  const [isVideoViewClosed, setIsVideoViewClosed] = useState(false);
  const [fontSizeFactor, setFontSizeFactor] = useState<'md' | 'lg' | 'xl'>('lg');
  const [selectedBookSentenceId, setSelectedBookSentenceId] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [expandedVocabId, setExpandedVocabId] = useState<string | null>(null);

  // Anti-Rabbit Hole defense lookup history
  const [definitionStack, setDefinitionStack] = useState<Array<{
    word: string;
    phonetic?: string;
    partOfSpeech: string;
    definition: string;
    definitionCn: string;
    example: string;
  }>>([]);
  const [isRabbitHoleAlarm, setIsRabbitHoleAlarm] = useState(false);
  const [isSearchingWordOnline, setIsSearchingWordOnline] = useState(false);

  // 灵感闪回盲盒 roulette wheel state
  const [blindCard, setBlindCard] = useState<Vocabulary | null>(null);
  const [isRouletteRolling, setIsRouletteRolling] = useState(false);

  // Liquid delete confirmation hold timer state
  const [wipeHoldProgress, setWipeHoldProgress] = useState(0);
  const [isHoldingWipe, setIsHoldingWipe] = useState(false);
  const wipeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimerRef = useRef<any>(null);

  // Filter vault items
  const [vaultFilter, setVaultFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
  const [vaultMainCategory, setVaultMainCategory] = useState<'words' | 'phrases' | 'sentences'>('words');

  // Multi-particle state for dopamine reward explosion
  const [showRewardParticles, setShowRewardParticles] = useState(false);

  // New customized states
  const [showAllLessonsModal, setShowAllLessonsModal] = useState(false);
  const [lessonsSearchQuery, setLessonsSearchQuery] = useState("");
  const [lessonsFilterCategory, setLessonsFilterCategory] = useState<'all' | 'bilibili' | 'youtube' | 'podcast' | 'other'>('all');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);

  // Advanced speech states
  const [ttsSpeed, setTtsSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [ttsVoice, setTtsVoice] = useState<string>("default");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // AI grammar parsing simulation state
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalyzingStepStr, setAiAnalyzingStepStr] = useState("");

  // Social sharing contextual action states
  const [activeActionsLessonId, setActiveActionsLessonId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<'speak' | 'doc' | null>(null);
  const [showSubtitleShareModal, setShowSubtitleShareModal] = useState<boolean>(false);
  const [sharedSubtitleText, setSharedSubtitleText] = useState<string>("");
  const [sharedSubtitleTranslation, setSharedSubtitleTranslation] = useState<string>("");

  // Last learned item tracking
  const [lastLearnedItem, setLastLearnedItem] = useState<{
    type: 'podcast' | 'video' | 'epub' | 'word';
    title: string;
    id: string;
  } | null>(() => {
    const saved = localStorage.getItem("lingua_last_learned_v62");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      type: 'podcast',
      title: "Steve Jobs 斯坦福毕业典礼致辞 Special Ed.",
      id: "jobs-commencement"
    };
  });

  // Review & Subscription plans
  const [activeReviewPlan, setActiveReviewPlan] = useState<'ebbinghaus' | 'flash' | 'deep'>('ebbinghaus');
  const [reviewWordsDailyTarget, setReviewWordsDailyTarget] = useState(10);
  const [reviewWordsCompletedToday, setReviewWordsCompletedToday] = useState(4);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(() => {
    return localStorage.getItem("lingua_premium_user") === "true";
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentTier, setSelectedPaymentTier] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [paymentStep, setPaymentStep] = useState<'select' | 'qrcode' | 'success'>('select');

  // Multi-subtitles and player states
  const [showEnglishSubtitles, setShowEnglishSubtitles] = useState(true);
  const [showChineseSubtitles, setShowChineseSubtitles] = useState(true);
  const [isVideoCollapsed, setIsVideoCollapsed] = useState(false);
  const [swipedLessonId, setSwipedLessonId] = useState<string | null>(null);
  const [swipedVocabId, setSwipedVocabId] = useState<string | null>(null);
  const [swipedSentenceIdx, setSwipedSentenceIdx] = useState<number | null>(null);

  // Flashcard Space states
  const [showFlashcardSpace, setShowFlashcardSpace] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isCardRevealed, setIsCardRevealed] = useState(false);

  // Reset card reveal whenever index changes
  useEffect(() => {
    setIsCardRevealed(false);
  }, [currentFlashcardIndex]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("lingua_lessons_v62", JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem("lingua_vocabularies_v62", JSON.stringify(vocabularies));
  }, [vocabularies]);

  useEffect(() => {
    localStorage.setItem("lingua_favorites_v62", JSON.stringify(favorites));
  }, [favorites]);

  // Construct dynamic review queue from collected words and favorite sentences
  const getReviewQueue = () => {
    const queue: Array<{
      type: 'word' | 'sentence';
      id: string;
      word?: string;
      phonetic?: string;
      partOfSpeech?: string;
      definitionCn?: string;
      example?: string;
      text?: string;
      translationCn?: string;
    }> = [];
    
    // Add collected vocabularies
    vocabularies.forEach(v => {
      queue.push({
        type: 'word',
        id: `word-${v.id}`,
        word: v.word,
        phonetic: v.phonetic,
        partOfSpeech: v.partOfSpeech,
        definitionCn: v.definitionCn,
        example: v.example
      });
    });
    
    // Add favorite sentences
    favorites.forEach((favText, idx) => {
      let transl = "经典高光金句听力影子复习";
      for (const l of lessons) {
        const matchingSent = l.sentences.find(s => s.text === favText);
        if (matchingSent) {
          transl = (matchingSent as any).translationCn || matchingSent.translation;
          break;
        }
      }
      queue.push({
        type: 'sentence',
        id: `fav-${idx}`,
        text: favText,
        translationCn: transl
      });
    });
    
    // Fallback deck so user is never left empty-handed
    if (queue.length === 0) {
      queue.push({
        type: 'word',
        id: 'fallback-1',
        word: 'commencement',
        phonetic: "kə'mensmənt",
        partOfSpeech: 'noun',
        definitionCn: 'n. 毕业典礼；开始',
        example: 'at your commencement from one of the finest universities...'
      });
      queue.push({
        type: 'word',
        id: 'fallback-2',
        word: 'motivation',
        phonetic: "ˌməʊtɪ'veɪʃn",
        partOfSpeech: 'noun',
        definitionCn: 'n. 动机；积极性',
        example: 'Dopamine is a molecule of motivation and surprise.'
      });
      queue.push({
        type: 'sentence',
        id: 'fallback-3',
        text: "Today I want to tell you three stories. That's it. No big deal. Just three stories.",
        translationCn: "今天我想和你们说三个故事。就这些，没什么大不了。只是三个故事。"
      });
    }
    
    return queue;
  };

  const handleRecallStatus = (status: 'forget' | 'vague' | 'remember') => {
    playSynthBeep(status === 'remember' ? 'success' : 'click');
    if (status === 'remember') {
      setStats(prev => ({
        ...prev,
        totalTokens: prev.totalTokens + 1,
        wordCounts: {
          ...prev.wordCounts,
          green: prev.wordCounts.green + 1
        }
      }));
    }
    
    const deck = getReviewQueue();
    if (currentFlashcardIndex < deck.length - 1) {
      setCurrentFlashcardIndex(prev => prev + 1);
    } else {
      // Completed queue!
      playSynthBeep('success');
      setShowRewardParticles(true);
      setTimeout(() => setShowRewardParticles(false), 2000);
      setCurrentFlashcardIndex(deck.length); // Moves to completed view screen!
    }
  };

  useEffect(() => {
    localStorage.setItem("lingua_stats_v62", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("lingua_settings_v62", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("lingua_premium_user", isPremiumUser ? "true" : "false");
  }, [isPremiumUser]);

  // Load synthesis voices on mount
  useEffect(() => {
    const loadVoices = () => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const voices = window.speechSynthesis.getVoices();
          setAvailableVoices(voices.filter(v => v.lang.startsWith("en-") || v.lang.startsWith("en_")));
        }
      } catch (e) {}
    };
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // SMS Verification countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (codeCountdown > 0) {
      timer = setInterval(() => {
        setCodeCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [codeCountdown]);

  // Audio simulation timer for active player progress
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && activeLessonId) {
      const lesson = lessons.find(l => l.id === activeLessonId);
      if (lesson) {
        // Enforce 1-minute limit for newly imported items on free level
        const isImported = !DEFAULT_LESSONS.some(dl => dl.id === activeLessonId);
        if (isImported && !isPremiumUser && currentSentenceIndex * 6.5 >= 60) {
          setIsPlaying(false);
          setApiErrorMessage("普通免费用户试用额度已达：新导入的学习内容每次仅可研读前 1 分钟。订阅极客会员立刻激活整篇、无任何播放流阻断特权！🍿");
          setShowPaymentModal(true);
          return;
        }

        interval = setInterval(() => {
          if (!isLoopingSentence) {
            setCurrentSentenceIndex((prev) => {
              const targetIdx = prev + 1;
              if (isImported && !isPremiumUser && targetIdx * 6.5 >= 60) {
                setIsPlaying(false);
                setApiErrorMessage("普通免费用户试用额度已达：新导入的学习内容每次仅可研读前 1 分钟。订阅极客会员立刻激活整篇、无任何播放流阻断特权！🍿");
                setShowPaymentModal(true);
                return prev;
              }

              if (prev < lesson.sentences.length - 1) {
                // Play spoken synthesis for next naturally arriving sentence if Zen allows, or simulate
                speakTextEn(lesson.sentences[targetIdx].text);
                return targetIdx;
              } else {
                setIsPlaying(false);
                // Trigger Target Neutralized celebration!
                playSynthBeep('success');
                setShowRewardParticles(true);
                return 0;
              }
            });
          } else {
            // Loop mode repeats current sentence synthesis
            speakTextEn(lesson.sentences[currentSentenceIndex].text);
          }
        }, 6500); // Sentence transition simulated timing
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeLessonId, currentSentenceIndex, isLoopingSentence, isPremiumUser]);

  // Audio simulation timer for EPUB book reading aloud sentence by sentence
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const lesson = lessons.find(l => l.id === activeLessonId);
    if (isBookPlaying && activeLessonId && lesson?.contentType === "epub") {
      const sentencesPerPage = 2;
      const bSentences = lesson.sentences;
      const startIdx = activeBookPage * sentencesPerPage;
      const endIdx = Math.min(bSentences.length, (activeBookPage + 1) * sentencesPerPage) - 1;

      interval = setInterval(() => {
        setActiveBookSentenceIdx((prev) => {
          const currentIdx = prev !== null ? prev : startIdx;
          if (currentIdx < endIdx && currentIdx < bSentences.length - 1) {
            const nextIdx = currentIdx + 1;
            speakTextEn(bSentences[nextIdx].text);
            return nextIdx;
          } else {
            // End of book page or book limit: pause
            setIsBookPlaying(false);
            window.speechSynthesis.cancel();
            return null;
          }
        });
      }, 6500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBookPlaying, activeLessonId, activeBookPage, lessons]);

  // Handle active lesson selection synthesis trigger
  const selectActiveLesson = (id: string) => {
    playSynthBeep('click');

    // Rule: Free users can only study the first 3 imported learning materials
    const isImported = !DEFAULT_LESSONS.some(dl => dl.id === id);
    if (isImported && !isPremiumUser) {
      const importedLessons = lessons.filter(l => !DEFAULT_LESSONS.some(dl => dl.id === l.id));
      const importedIndex = importedLessons.findIndex(l => l.id === id);
      if (importedIndex > 2) {
        setApiErrorMessage("您当前使用的是免费体验版：限学习前 3 个您导入的学习资料。订阅极客会员立刻激活整篇、无限量资源极速导入与专精研读！💎");
        setShowPaymentModal(true);
        return;
      }
    }

    setActiveLessonId(id);
    setSelectedBookSentenceId(null);
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
      const learned = {
        type: lesson.contentType as any,
        title: lesson.title,
        id: lesson.id
      };
      setLastLearnedItem(learned);
      localStorage.setItem("lingua_last_learned_v62", JSON.stringify(learned));
    }
    if (lesson?.contentType === "epub") {
      // E-book opened: FIRST custom quiet reading layout, do NOT autoplay TTS!
      setIsPlaying(false);
      setIsBookPlaying(false);
      setActiveBookPage(0);
      setActiveBookSentenceIdx(null);
    } else {
      if (lesson?.contentType === "video") {
        setIsVideoViewClosed(false);
      }
      setCurrentSentenceIndex(0);
      setIsPlaying(true);
      const firstSentence = lesson?.sentences[0];
      if (firstSentence) {
        speakTextEn(firstSentence.text);
      }
    }
  };

  // Close Lesson View and return to Dashboard
  const exitLessonView = () => {
    playSynthBeep('click');
    setIsPlaying(false);
    setIsBookPlaying(false);
    setActiveBookSentenceIdx(null);
    window.speechSynthesis.cancel();
    setActiveLessonId(null);
  };

  // Shadow read aloud
  const handleShadowingSpeech = (text: string) => {
    playSynthBeep('click');
    speakTextEn(text);
  };

  // Toggle favorite sentence/phrase
  const toggleSentenceFavorite = (text: string) => {
    playSynthBeep('click');
    setFavorites(prev => {
      if (prev.includes(text)) {
        return prev.filter(t => t !== text);
      } else {
        return [...prev, text];
      }
    });
  };

  // Handle simulated holding for Liquid Data Erase
  useEffect(() => {
    if (isHoldingWipe) {
      wipeIntervalRef.current = setInterval(() => {
        setWipeHoldProgress(prev => {
          if (prev >= 100) {
            clearInterval(wipeIntervalRef.current!);
            executeDataWipe();
            return 0;
          }
          playSynthBeep('roulette');
          return prev + 5;
        });
      }, 150);
    } else {
      if (wipeIntervalRef.current) {
        clearInterval(wipeIntervalRef.current);
      }
      setWipeHoldProgress(0);
    }
    return () => {
      if (wipeIntervalRef.current) clearInterval(wipeIntervalRef.current);
    };
  }, [isHoldingWipe]);

  const executeDataWipe = () => {
    playSynthBeep('glitch');
    localStorage.clear();
    setLessons(DEFAULT_LESSONS);
    setVocabularies(DEFAULT_VOCABULARIES);
    setFavorites(["graduated", "obvious"]);
    setStats({
      streak: 1,
      totalTokens: 0,
      wordCounts: { green: 0, yellow: 0, red: 0 }
    });
    setSettings({
      zenModeDefault: true,
      whiteNoise: false,
      oledContrast: false
    });
    setIsWechatBound(false);
    setCurrentTab('listen');
    setActiveLessonId(null);
    setApiErrorMessage("SYSTEM WIPE COMPLETED. LOCAL DATABASE RESET.");
    setTimeout(() => setApiErrorMessage(null), 3000);
  };

  // Generate beautiful custom lesson from uploaded local media file metadata
  const generateLocalLesson = (fileName: string) => {
    const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const title = baseName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    
    let sentences = [
      {
        id: `local-s1`,
        text: `The focus of this local transcoded resource is the retention of key vocabulary.`,
        translation: `此本地解码音频资源的学习重点是保持核心词汇的长期记忆。`,
        syntaxBlocks: [
          { id: "lb1", token: "The focus", role: "subject" as const, roleCn: "主语", explanation: "冠词加名词作主句主干" },
          { id: "lb2", token: "is the retention", role: "verb" as const, roleCn: "系表结构", explanation: "系表短语表达核心主干关系" },
          { id: "lb3", token: "of key vocabulary", role: "modifier" as const, roleCn: "后置修饰", explanation: "介词短语修饰名词" }
        ]
      },
      {
        id: `local-s2`,
        text: "Using tactile feedback, we can easily break down these syntax constructs without fatigue.",
        translation: "搭配触觉反馈，我们可以十分轻松地分解这些句法结构，而不产生学习疲劳。",
        syntaxBlocks: [
          { id: "lb4", token: "Using tactile feedback", role: "modifier" as const, roleCn: "方式状语", explanation: "分词短语作动作状态描述" },
          { id: "lb5", token: "we can easily break down", role: "verb" as const, roleCn: "复合谓语", explanation: "情态助动词+副词修饰+及物动词" },
          { id: "lb6", token: "these syntax constructs", role: "object" as const, roleCn: "宾语", explanation: "指示词+名词复数充当承受对象" }
        ]
      }
    ];

    if (title.toLowerCase().includes("adhd") || title.toLowerCase().includes("focus") || title.toLowerCase().includes("brain") || title.toLowerCase().includes("study")) {
      sentences = [
        {
          id: `local-s1`,
          text: "Hyperfocus forms a specialized sensory channel within our cognitive brain.",
          translation: "超聚焦（Hyperfocus）在我们的大脑认知中形成了一个特殊的感官通道。",
          syntaxBlocks: [
            { id: "lh1", token: "Hyperfocus", role: "subject" as const, roleCn: "主语", explanation: "专有名词充当句主" },
            { id: "lh2", token: "forms a channel", role: "verb" as const, roleCn: "主谓宾", explanation: "及物动词动作充当谓语" },
            { id: "lh3", token: "within our cognitive brain", role: "modifier" as const, roleCn: "方位修饰", explanation: "介词短语限定方向范畴" }
          ]
        },
        {
          id: `local-s2`,
          text: "Once aligned with appropriate sensory stimulation, it yields high retention.",
          translation: "一旦搭配上适度的感官刺激，它就能产生极高的脑神经网络长效记忆。",
          syntaxBlocks: [
            { id: "lh4", token: "Once aligned", role: "modifier" as const, roleCn: "条件副词状语", explanation: "从句省略构件充当条件状语" },
            { id: "lh5", token: "it yields", role: "verb" as const, roleCn: "主谓结构", explanation: "主代词加及物谓语动词" },
            { id: "lh6", token: "high retention", role: "object" as const, roleCn: "宾语", explanation: "动作承受的名词属性词" }
          ]
        }
      ];
    }

    return {
      id: `local-${Date.now()}`,
      title: title || "Transcribed Local Stream",
      contentType: "podcast" as const,
      durationOrPages: "Local Media",
      coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      progress: 0,
      sentences: sentences
    };
  };

  // Simulate local transcriber flow
  const [isLocalTranscribing, setIsLocalTranscribing] = useState(false);
  const [localTranscribeStep, setLocalTranscribeStep] = useState(0);

  const launchLocalMediaTranscribe = () => {
    if (!localMediaFile) return;
    playSynthBeep('click');
    setIsLocalTranscribing(true);
    setLocalTranscribeStep(0);

    const interval = setInterval(() => {
      setLocalTranscribeStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            const customLesson = generateLocalLesson(localMediaFile.name);
            setLessons(prevLessons => [customLesson, ...prevLessons]);
            setIsLocalTranscribing(false);
            setShowImport舱(false);
            setLocalMediaFile(null);
            selectActiveLesson(customLesson.id);
          }, 1000);
          return 4;
        }
        playSynthBeep('roulette');
        return prev + 1;
      });
    }, 1200);
  };

  // Bookshelf selector trigger
  const launchEpubBookImport = (bookTitle: string, bookSentencesList: any[]) => {
    playSynthBeep('success');
    const newLessonId = "epub-" + Date.now();
    const newLesson: Lesson = {
      id: newLessonId,
      title: bookTitle,
      contentType: "epub",
      durationOrPages: (Math.ceil(bookSentencesList.length / 2)) + " Pages",
      coverImage: bookTitle.includes("Alice") 
        ? "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
        : bookTitle.includes("Steve")
        ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
        : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      progress: 0,
      sentences: bookSentencesList
    };

    setLessons(prev => [newLesson, ...prev]);
    setShowImport舱(false);
    selectActiveLesson(newLessonId);
  };

  const DEMO_BOOKS = [
    {
      title: "Atomic Habits - CH.3",
      sentences: [
        {
          id: "ah-p1-s1",
          text: "Whenever you want to change your behavior, you can simply ask yourself: How can I make it obvious?",
          translation: "每当你想要改变你的习惯行为时，你可以简单地问问自己：我怎样才能让它变得显而易见？",
          syntaxBlocks: [
            { id: "bah1", token: "Whenever", role: "modifier" as const, roleCn: "状语引导", explanation: "引导时间条件状语" },
            { id: "bah2", token: "to change", role: "verb" as const, roleCn: "谓语动作", explanation: "动词不定式" },
            { id: "bah3", token: "your behavior", role: "object" as const, roleCn: "宾语", explanation: "代词修饰名词宾格" }
          ]
        },
        {
          id: "ah-p1-s2",
          text: "How can I make it attractive? How can I make it easy? How can I make it satisfying?",
          translation: "我怎样才能让它变得更有吸引力？怎样让它变得容易？怎样让它令人满足？",
          syntaxBlocks: [
            { id: "bah4", token: "attractive", role: "modifier" as const, roleCn: "修饰词/宾补", explanation: "作代词it的宾语补足语" },
            { id: "bah5", token: "easy", role: "modifier" as const, roleCn: "修饰词/宾补", explanation: "状态形容词" },
            { id: "bah6", token: "satisfying", role: "modifier" as const, roleCn: "修饰词/宾补", explanation: "现在分词形容词化" }
          ]
        },
        {
          id: "ah-p2-s1",
          text: "The cues that guide our daily habits are often invisible, operating quietly in our environment.",
          translation: "引导我们日常习惯的线索通常是肉眼不可见的，它们在我们的环境中静悄悄地起着作用。",
          syntaxBlocks: [
            { id: "bah7", token: "The cues", role: "subject" as const, roleCn: "主语", explanation: "名词短语作主干主语" },
            { id: "bah8", token: "are often invisible", role: "verb" as const, roleCn: "谓语", explanation: "系表系动词组合" },
            { id: "bah9", token: "operating quietly", role: "modifier" as const, roleCn: "伴随状语", explanation: "现在分词伴随修饰" }
          ]
        },
        {
          id: "ah-p2-s2",
          text: "To construct powerful behaviors, make the cues of your good habits stand out.",
          translation: "为了构建强大的行为，请让那些有益习惯的视觉线索变得特别突出显眼。",
          syntaxBlocks: [
            { id: "bah10", token: "To construct", role: "modifier" as const, roleCn: "目标状语", explanation: "不定式表目的" },
            { id: "bah11", token: "make the cues", role: "verb" as const, roleCn: "使役动词", explanation: "使役动词控制意动名词" },
            { id: "bah12", token: "stand out", role: "object" as const, roleCn: "宾补动作", explanation: "省略to的不定式充当宾语补足语" }
          ]
        }
      ]
    },
    {
      title: "Alice in Wonderland",
      sentences: [
        {
          id: "alice-p1-s1",
          text: "Alice was beginning to get very tired of sitting by her sister on the bank, and having nothing to do.",
          translation: "爱丽丝开始对和姐姐并排坐在河岸上、无所事事感到极度厌烦了。",
          syntaxBlocks: [
            { id: "bal1", token: "Alice", role: "subject" as const, roleCn: "主语", explanation: "人名代主" },
            { id: "bal2", token: "was beginning to get", role: "verb" as const, roleCn: "进行时态谓语", explanation: "过去进行时辅助谓语" },
            { id: "bal3", token: "very tired of sitting", role: "modifier" as const, roleCn: "伴随状态", explanation: "形容词加动名词作补足" }
          ]
        },
        {
          id: "alice-p1-s2",
          text: "Suddenly, a White Rabbit with pink eyes ran close by her, checking its pocket watch.",
          translation: "突然，一只长着粉红色眼睛的白兔急匆匆跑过她身边，还看着它的怀表。",
          syntaxBlocks: [
            { id: "bal4", token: "Suddenly", role: "modifier" as const, roleCn: "时间副词", explanation: "修饰整个句子的发生瞬间" },
            { id: "bal5", token: "a White Rabbit", role: "subject" as const, roleCn: "主语", explanation: "定冠形容名词主格" },
            { id: "bal6", token: "ran close", role: "verb" as const, roleCn: "谓语", explanation: "动宾修饰动词短语" }
          ]
        },
        {
          id: "alice-p2-s1",
          text: "Down, down, down went Alice, falling deep into the rabbit hole of curiosity.",
          translation: "沿着兔子洞，爱丽丝不停地往下落、往下落，深陷在充满好奇的心境之中。",
          syntaxBlocks: [
            { id: "bal7", token: "Down went Alice", role: "verb" as const, roleCn: "倒装句", explanation: "方向副词前置引起的倒装结构" },
            { id: "bal8", token: "falling deep", role: "modifier" as const, roleCn: "伴随状态", explanation: "分词伴随表现下坠状态" }
          ]
        },
        {
          id: "alice-p2-s2",
          text: "Do you know how deep this mind journey can go before the depth limit triggers?",
          translation: "你知道在限深保护机制触发之前，这次心灵旅程能向下延伸多深吗？",
          syntaxBlocks: [
            { id: "bal9", token: "Do you know", role: "verb" as const, roleCn: "主句疑问", explanation: "一般疑问主架" },
            { id: "bal10", token: "how deep this journey", role: "subject" as const, roleCn: "宾从主语", explanation: "疑问属格限定引导词" },
            { id: "bal11", token: "before limits trigger", role: "modifier" as const, roleCn: "时间状语", explanation: "时间引导词修饰阶段" }
          ]
        }
      ]
    },
    {
      title: "Steve Jobs: Memoirs of Design",
      sentences: [
        {
          id: "jobs-p1-s1",
          text: "Design is not just what it looks like and feels like. Design is how it works.",
          translation: "设计不仅仅是它的外形看起来怎样、手感摸起来如何。设计，是它具体如何运转与工作的。",
          syntaxBlocks: [
            { id: "bsj1", token: "Design", role: "subject" as const, roleCn: "主语", explanation: "抽象概念代词主格" },
            { id: "bsj2", token: "is not just", role: "verb" as const, roleCn: "否定系动动词", explanation: "系表否定关系修饰" },
            { id: "bsj3", token: "what it looks like", role: "object" as const, roleCn: "表语从句", explanation: "名词属性疑问词引导从句" }
          ]
        },
        {
          id: "jobs-p1-s2",
          text: "Your time is limited, so don't waste it living someone else's simulated destiny.",
          translation: "你的时间极其有限，因此不要把它浪费在过别人为你设计好的模拟人生之中。",
          syntaxBlocks: [
            { id: "bsj4", token: "Your time", role: "subject" as const, roleCn: "主语", explanation: "所属限定词+时间名词" },
            { id: "bsj5", token: "is limited", role: "verb" as const, roleCn: "谓语", explanation: "系表被动状态" },
            { id: "bsj6", token: "don't waste it", role: "verb" as const, roleCn: "祈使复合句", explanation: "否定祈使词加宾语" }
          ]
        },
        {
          id: "jobs-p2-s1",
          text: "Simple can be harder than complex. You have to work hard to get your cognitive thinking clean.",
          translation: "简约往往比繁复更难。你必须下苦功去理清你的认知思维，使它变得干净透彻。",
          syntaxBlocks: [
            { id: "bsj7", token: "Simple", role: "subject" as const, roleCn: "主语", explanation: "形容词名词化作句主" },
            { id: "bsj8", token: "can be harder", role: "verb" as const, roleCn: "比较系动", explanation: "情态动词+标词比较级" },
            { id: "bsj9", token: "to get your thinking clean", role: "modifier" as const, roleCn: "目的从修", explanation: "不定式引导复合状语，clean作宾补" }
          ]
        }
      ]
    }
  ];

  // Custom link parser simulation using server-side Gemini 3.5-flash endpoint
  const launchExtractorAndParse = async () => {
    if (!pasteText.trim()) return;
    playSynthBeep('click');
    setIsAnalyzing(true);
    setAnalyzingStep(0);
    setApiErrorMessage(null);

    // Simulate cyber scanning steps for engagement
    const timers = [
      setTimeout(() => setAnalyzingStep(1), 1000),
      setTimeout(() => setAnalyzingStep(2), 2200),
      setTimeout(() => setAnalyzingStep(3), 3500),
    ];

    try {
      const response = await fetch("/api/gemini/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasteText })
      });

      const parsedJSON = await response.json();

      if (!response.ok || parsedJSON.error) {
        throw new Error(parsedJSON.error || "Network error querying server Gemini proxy.");
      }

      // We got genuine structured response from server Gemini engine!
      timers.forEach(t => clearTimeout(t));
      setAnalyzingStep(4);
      playSynthBeep('success');

      // Add to lessons collection dynamically
      const newLessonId = "custom-" + Date.now();
      const newLesson: Lesson = {
        id: newLessonId,
        title: parsedJSON.title || "Neural Extracted " + new Date().toLocaleDateString(),
        contentType: "podcast",
        durationOrPages: "AI Analyzed",
        coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
        progress: 0,
        sentences: parsedJSON.sentences.map((s: any, idx: number) => ({
          id: `custom-s-${idx}`,
          text: s.text,
          translation: s.translation,
          syntaxBlocks: s.syntaxBlocks.map((b: any, bIdx: number) => ({
            id: `b-custom-${idx}-${bIdx}`,
            token: b.token,
            role: b.role,
            roleCn: b.roleCn,
            explanation: b.explanation
          }))
        }))
      };

      // Merge new vocab words safely
      let newVocabs = [...vocabularies];
      if (parsedJSON.vocabularies && Array.isArray(parsedJSON.vocabularies)) {
        parsedJSON.vocabularies.forEach((v: any, idx: number) => {
          const exists = vocabularies.some(x => x.word.toLowerCase() === v.word.toLowerCase());
          if (!exists) {
            newVocabs.push({
              id: `vocab-custom-${Date.now()}-${idx}`,
              word: v.word,
              phonetic: v.phonetic || "/.../",
              partOfSpeech: v.partOfSpeech || "n.",
              definition: v.definition || "Looked up via neural matrix.",
              definitionCn: v.definitionCn || "神经网络获取",
              example: v.example || "",
              color: 'yellow',
              sentenceId: `custom-s-${idx}`,
              nestedWords: v.definition ? v.definition.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter((w: string) => w.length > 4).slice(0, 4) : [],
              createdAt: Date.now()
            });
          }
        });
      }

      setLessons(prev => [newLesson, ...prev]);
      setVocabularies(newVocabs);
      setStats(prev => ({
        ...prev,
        totalTokens: prev.totalTokens + pasteText.split(/\s+/).length,
        wordCounts: {
          ...prev.wordCounts,
          yellow: prev.wordCounts.yellow + (parsedJSON.vocabularies?.length || 0)
        }
      }));

      setPasteText("");
      setShowImport舱(false);
      setIsAnalyzing(false);

      // Direct navigate into L2 context
      selectActiveLesson(newLessonId);

    } catch (err: any) {
      timers.forEach(t => clearTimeout(t));
      console.warn("Failed to contact server GenAI. Falling back to high-end client simulated parse representation.", err);
      setApiErrorMessage(err.message || "Failed to contact server GenAI proxy.");
      
      // Fallback structured mock engine so experience remains flawless even without external servers/creds configured
      setTimeout(() => {
        const simulatedTitle = "Nexus Segment " + pasteText.split(/\s+/).slice(0, 3).join(" ");
        const words = pasteText.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(w => w.length > 4);
        const extractedWords: string[] = Array.from(new Set(words)).slice(0, 3) as string[];

        const newLessonId = "simulated-" + Date.now();
        const newLesson: Lesson = {
          id: newLessonId,
          title: simulatedTitle,
          contentType: "podcast",
          durationOrPages: "Local Buffer",
          coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
          progress: 0,
          sentences: [
            {
              id: `sim-s1`,
              text: pasteText,
              translation: "本地离线模块高速解密中... [无密钥本地缓存成功]",
              syntaxBlocks: [
                { id: "bs1", token: pasteText.split(" ").slice(0, 2).join(" "), role: "subject", roleCn: "主干构件", explanation: "头部语法结构分段" },
                { id: "bs2", token: pasteText.split(" ").slice(2, 5).join(" ") || "...", role: "verb", roleCn: "行为动作", explanation: "行为关系链" },
                { id: "bs3", token: pasteText.split(" ").slice(5).join(" ") || " ", role: "object", roleCn: "修饰附加语", explanation: "附加意群表示块" }
              ]
            }
          ]
        };

        let newVocabs = [...vocabularies];
        extractedWords.forEach((word: string, idx: number) => {
          newVocabs.push({
            id: `sim-v-${idx}-${Date.now()}`,
            word: word.toLowerCase(),
            phonetic: "/lɒkəl_fæl_bæk/",
            partOfSpeech: "n.",
            definition: "Synthesized segment cached in local sandboxed memory bank.",
            definitionCn: "系统本地断网容灾存储词库中缓存的生词",
            example: pasteText,
            color: "yellow",
            sentenceId: `sim-s1`,
            nestedWords: ["synthesized", "segment", "cached", "local"],
            createdAt: Date.now()
          });
        });

        setLessons(prev => [newLesson, ...prev]);
        setVocabularies(newVocabs);
        setStats(prev => ({
          ...prev,
          totalTokens: prev.totalTokens + pasteText.split(/\s+/).length,
          wordCounts: {
            ...prev.wordCounts,
            yellow: prev.wordCounts.yellow + extractedWords.length
          }
        }));

        setPasteText("");
        setShowImport舱(false);
        setIsAnalyzing(false);
        selectActiveLesson(newLessonId);
      }, 1500);
    }
  };

  // Wipe a custom lesson card (left slide wipe effect)
  const deleteLesson = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSynthBeep('glitch');
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  // Launch L3 Interactive Char-by-Char Dictionary sheet with rabbit hole limits
  const initiateWordLookup = async (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!cleanWord) return;

    playSynthBeep('click');
    setDictSearchWord(cleanWord);
    setIsSearchingWordOnline(true);
    setIsRabbitHoleAlarm(false);

    // Look up in our local collected vocab pool first
    const localMatch = vocabularies.find(v => v.word.toLowerCase() === cleanWord);
    
    // Check if limits of rabbit hole achieved (nested depth limit 3 as required in PRD)
    if (definitionStack.length >= 3) {
      playSynthBeep('block');
      setIsRabbitHoleAlarm(true);
      setIsSearchingWordOnline(false);
      return; 
    }

    if (localMatch) {
      setTimeout(() => {
        setDefinitionStack(prev => [...prev, {
          word: localMatch.word,
          phonetic: localMatch.phonetic,
          partOfSpeech: localMatch.partOfSpeech,
          definition: localMatch.definition,
          definitionCn: localMatch.definitionCn,
          example: localMatch.example
        }]);
        setIsSearchingWordOnline(false);
      }, 300);
    } else {
      // Dynamic look up via Server-Side Gemini define route
      try {
        const res = await fetch("/api/gemini/define", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: cleanWord })
        });

        const parsed = await res.json();
        if (!res.ok || parsed.error) {
          throw new Error(parsed.error || "Cannot find online definition");
        }

        setDefinitionStack(prev => [...prev, {
          word: parsed.word,
          phonetic: parsed.phonetic || "/.../",
          partOfSpeech: parsed.partOfSpeech || "adj. / v. / n.",
          definition: parsed.definition || "Neural parsed online meaning.",
          definitionCn: parsed.definitionCn || "释义获取成功",
          example: parsed.example || ""
        }]);
        setIsSearchingWordOnline(false);
      } catch (err: any) {
        // Simple offline translation generation fallback
        console.warn("Define dynamic server error, executing smart local fallback guess matrix.", err);
        setApiErrorMessage(err.message || "Failed to consult central AI dictionary.");
        setTimeout(() => {
          setDefinitionStack(prev => [...prev, {
            word: cleanWord,
            phonetic: "/" + cleanWord + "ː/",
            partOfSpeech: "n.",
            definition: `A specific cognitive concept related to ${cleanWord}.`,
            definitionCn: `（神经网络在本地分析测算中）指关于:${cleanWord} 的底层意群`,
            example: `The meaning of ${cleanWord} can be understood inside context.`
          }]);
          setIsSearchingWordOnline(false);
        }, 500);
      }
    }
  };

  // Close Dictionary panel completely and reset stack
  const closeDictionary舱 = () => {
    playSynthBeep('click');
    setDictSearchWord(null);
    setDefinitionStack([]);
    setIsRabbitHoleAlarm(false);
  };

  // Step backwards in rabbit hole lookups
  const popRabbitHoleStep = () => {
    playSynthBeep('click');
    setIsRabbitHoleAlarm(false);
    setDefinitionStack(prev => prev.slice(0, -1));
  };

  // Assign or adjust spatial color tagging to the searched word
  const updateWordColorTag = (word: string, color: 'green' | 'yellow' | 'red') => {
    playSynthBeep('click');
    
    // Check if already in collected vocabularies
    const existingIndex = vocabularies.findIndex(v => v.word.toLowerCase() === word.toLowerCase());
    
    if (existingIndex > -1) {
      setVocabularies(prev => prev.map((v, idx) => {
        if (idx === existingIndex) {
          return { ...v, color };
        }
        return v;
      }));
    } else {
      // Find within active looked-up info stack
      const activeInfo = definitionStack.find(s => s.word.toLowerCase() === word.toLowerCase());
      if (activeInfo) {
        setVocabularies(prev => [...prev, {
          id: `vocab-scanned-${Date.now()}`,
          word: activeInfo.word,
          phonetic: activeInfo.phonetic || "/.../",
          partOfSpeech: activeInfo.partOfSpeech,
          definition: activeInfo.definition,
          definitionCn: activeInfo.definitionCn,
          example: activeInfo.example,
          color,
          createdAt: Date.now()
        }]);
      }
    }

    // Update global counters
    setStats(prev => {
      const updatedCounts = { ...prev.wordCounts };
      updatedCounts[color] = updatedCounts[color] + 1;
      return {
        ...prev,
        wordCounts: updatedCounts
      };
    });
  };

  // Commit dynamic dopamine save of word to vault, with clean animation drop
  const saveWordToNexus = (word: string) => {
    playSynthBeep('save');
    setShowRewardParticles(true);
    
    // Auto color yellow if unspecified
    const inList = vocabularies.some(v => v.word.toLowerCase() === word.toLowerCase());
    if (!inList) {
      updateWordColorTag(word, 'yellow');
    }

    // Auto-dim the dictionary HUD sheet beautifully after particle feedback
    setTimeout(() => {
      setShowRewardParticles(false);
      closeDictionary舱();
    }, 1200);
  };

  // 灵感闪回盲盒 triggers random retro slot rolling animation
  const rollInspirationBlindBox = () => {
    if (vocabularies.length === 0) return;
    playSynthBeep('click');
    setIsRouletteRolling(true);
    setBlindCard(null);

    let count = 0;
    const maxTumbles = 15;
    const interval = setInterval(() => {
      const randomWord = vocabularies[Math.floor(Math.random() * vocabularies.length)];
      setBlindCard(randomWord);
      playSynthBeep('roulette');
      count++;
      if (count >= maxTumbles) {
        clearInterval(interval);
        setIsRouletteRolling(false);
        playSynthBeep('success');
      }
    }, 100);
  };

  // Export Subtitles function to generate SRT files based on current state parameters
  const exportSubtitles = (mode: 'bilingual' | 'chinese' | 'english' | boolean) => {
    if (!activeLessonId) return;
    const lesson = lessons.find(l => l.id === activeLessonId);
    if (!lesson) return;
    
    playSynthBeep('success');
    
    let srtText = "";
    lesson.sentences.forEach((sentence, idx) => {
      const startSec = idx * 5;
      const endSec = (idx + 1) * 5;
      
      const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s},000`;
      };
      
      srtText += `${idx + 1}\n`;
      srtText += `${formatTime(startSec)} --> ${formatTime(endSec)}\n`;
      
      const showCn = mode === 'bilingual' || mode === 'chinese' || mode === true;
      const showEn = mode === 'bilingual' || mode === 'english' || mode === false || mode === true;
      
      if (showEn) {
        srtText += `${sentence.text}\n`;
      }
      if (showCn) {
        const cnText = (sentence as any).translationCn || sentence.translation;
        srtText += `${cnText}\n`;
      }
      srtText += "\n";
    });
    
    const blob = new Blob([srtText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    let suffix = "subtitles";
    if (mode === 'bilingual' || mode === true) suffix = "bilingual";
    if (mode === 'chinese') suffix = "chinese";
    if (mode === 'english' || mode === false) suffix = "english";
    
    link.download = `${lesson.title}_${suffix}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter lists inside Vault
  const filteredVocabCollection = vocabularies.filter(v => {
    const isPhrase = v.word.trim().includes(" ");
    if (vaultMainCategory === 'words' && isPhrase) return false;
    if (vaultMainCategory === 'phrases' && !isPhrase) return false;
    if (vaultMainCategory === 'sentences') return false;
    
    if (vaultFilter === 'all') return true;
    return v.color === vaultFilter;
  });

  return (
    <div className={`min-h-screen bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-center p-4 md:p-10 font-sans gap-8 overflow-y-auto no-scrollbar relative selection:bg-lime-400 selection:text-black`}>
      
      {/* Floating System Warning Notification for API Rate limiting / quota errors */}
      <AnimatePresence>
        {apiErrorMessage && (
          <motion.div 
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#0C0C0E]/95 border border-yellow-500/30 text-[#D4FF00] p-4 rounded-2xl max-w-sm md:max-w-md w-[calc(100%-2rem)] z-[100] backdrop-blur-xl shadow-2xl flex items-start gap-3"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <div className="w-5 h-5 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <h5 className="text-yellow-400 text-xs font-black uppercase tracking-wider font-mono mb-1">
                AI COGNITIVE SYSTEM OVERFLOW
              </h5>
              <p className="text-neutral-300 text-[11px] leading-relaxed font-semibold">
                {apiErrorMessage}
              </p>
            </div>
            <button 
              onClick={() => { playSynthBeep('click'); setApiErrorMessage(null); }}
              className="text-neutral-500 hover:text-white shrink-0 p-1 rounded-lg hover:bg-white/5 active:scale-95 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Dopamine particles celebration wrapper */}
      <AnimatePresence>
        {showRewardParticles && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
            {Array.from({ length: 30 }).map((_, idx) => {
              const angle = Math.random() * Math.PI * 2;
              const distance = 100 + Math.random() * 200;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              return (
                <motion.div
                  key={idx}
                  className="absolute w-3 h-3 rounded-full bg-lime-400 shadow-[0_0_10px_#D4FF00]"
                  initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }}
                  animate={{ 
                    x: x, 
                    y: y, 
                    scale: [1, 0.5, 0],
                    opacity: [1, 0.8, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Intro Workspace Desktop Metadata panel */}
      <div className="w-full md:max-w-[340px] flex flex-col gap-6 shrink-0 text-left bg-zinc-950 p-6 rounded-3xl border border-zinc-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            <span className="text-[10px] font-mono text-lime-400 uppercase tracking-widest font-black">Interactive PRD Terminal</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-mono">Lingua.</h1>
          <p className="text-neutral-400 text-xs mt-2 leading-relaxed font-medium">
            这是基于 <b>Slava Kornilov 的极简科技未来美学</b> 深度定制的“智能英语破译中枢”。针对 <b>ADHD 友好交互</b> 与 <b>CBT 认知行为</b>，去除无聊跟读，构建极简毛玻璃与电光荧光色交互。
          </p>
        </div>

        <div className="space-y-3.5 my-1 text-xs">
          <div className="flex justify-between items-center bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-800">
            <span className="text-neutral-400 font-mono">Status:</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
            </span>
          </div>
          <div className="flex justify-between items-center bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-800">
            <span className="text-neutral-400 font-mono">Cognitive Enrolled:</span>
            <span className="text-white font-bold">{vocabularies.length} Tokens</span>
          </div>
          <div className="flex justify-between items-center bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-800">
            <span className="text-neutral-400 font-mono">Daily Target:</span>
            <span className="text-lime-400 font-bold">3 Sentences / Done</span>
          </div>
        </div>

        {/* Quick Simulator controller panel to paste passage */}
        <div className="border-t border-zinc-800 pt-5">
          <span className="text-lime-400 uppercase font-mono text-[9px] font-black tracking-widest">Quick Brain Injection (Paste Anything)</span>
          <textarea
            className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl mt-2 p-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-lime-400 font-mono scrollbar-none resize-none"
            placeholder="Paste raw English paragraph, transcript or book excerpt..."
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <button
            onClick={launchExtractorAndParse}
            disabled={!pasteText.trim()}
            className="w-full bg-lime-400 text-black font-black text-xs py-3 rounded-xl mt-3 flex items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
          >
            <Sparkles className="w-4 h-4 fill-black" /> Inject & Analyze (AI)
          </button>
        </div>
      </div>

      {/* Dynamic Cybernetic Phone Screen Container */}
      <div className={`w-[393px] h-[852px] bg-black rounded-[3rem] border-[10px] border-[#262628] relative overflow-hidden flex flex-col shadow-2xl shrink-0 select-none ${settings.oledContrast ? "border-[#000]" : ""}`}>
        
        {/* WeChat Custom Notch Top capsule Pill */}
        <div className="absolute top-11 right-6 w-[87px] h-8 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-evenly z-50 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-white opacity-90 animate-pulse"></div>
          <div className="w-0.5 h-4 bg-white/20"></div>
          <div className="w-4 h-4 rounded-full border-[3px] border-white/80 flex items-center justify-center">
            <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
          </div>
        </div>

        {/* Dynamic Space background matrix based on settings */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:18px_18px] opacity-40 z-0 pointer-events-none"></div>

        {/* Ambient top light flow glow */}
        <div className={`absolute top-0 left-0 right-0 h-44 bg-gradient-to-b ${isZenMode ? "from-neutral-900/10" : "from-[#D4FF00]/5"} to-transparent pointer-events-none z-0`} />

        {/* Core Screen Layout router */}
        <div className="flex-1 overflow-hidden flex flex-col pt-12 relative z-10 w-full">
          
          {/* L2 Active Full-Screen Lesson view Overlay */}
          <AnimatePresence>
            {activeLessonId && (
              <motion.div 
                className="absolute inset-0 bg-[#050505] z-40 flex flex-col"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                {/* L2 Header bar */}
                <div className="pt-8 px-6 pb-4 flex justify-between items-center border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
                  <button 
                    onClick={exitLessonView}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                    <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">Decoding Wave</span>
                    <span className="text-white text-xs font-black tracking-tight block max-w-[150px] truncate">
                      {lessons.find(l => l.id === activeLessonId)?.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsZenMode(prev => !prev)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform border ${isZenMode ? "bg-lime-400 text-black border-lime-400" : "bg-white/5 text-white border-white/10"}`}
                    title="Ambient Zen Mode"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Check if current lesson is epub book */}
                {(() => {
                  const lesson = lessons.find(l => l.id === activeLessonId);
                  if (!lesson) return null;

                  if (lesson.contentType === "epub") {
                    const sentencesPerPage = 4;
                    const totalPages = Math.ceil(lesson.sentences.length / sentencesPerPage);
                    const currentSentences = lesson.sentences.slice(activeBookPage * sentencesPerPage, (activeBookPage + 1) * sentencesPerPage);

                    const selectedSentenceObj = lesson.sentences.find(s => s.id === selectedBookSentenceId);

                    return (
                      <div className="flex-1 flex flex-col justify-between overflow-hidden" id="epub-reader-body">
                        {/* 1. Book page reader pane with aesthetic paper margins */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar relative flex flex-col justify-start">
                          {/* Book floating page decor */}
                          <div className="text-center mb-4 shrink-0">
                            <span className="px-2.5 py-1 bg-amber-950/20 border border-orange-850/20 text-[#D4FF00] text-[9.5px] font-mono uppercase tracking-widest rounded-md">
                              📚 书架经典精读模式 • Cozy Book Mode
                            </span>
                            <h2 className="text-white text-md font-black tracking-tight mt-1 truncate px-10 font-sans">
                              {lesson.title}
                            </h2>
                          </div>

                          {/* Beautiful book context cards with sepia screen aesthetic */}
                          <div className="bg-[#12100e] border border-orange-950/10 rounded-[2rem] p-6 shadow-2xl relative min-h-[220px] flex flex-col justify-between overflow-hidden" id="epub-paper-card">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-550/5 filter blur-[35px] pointer-events-none" />
                            
                            {/* Page paragraph continuous flow representing book pages cleanly */}
                            <div className="font-serif leading-relaxed text-zinc-300 antialiased text-justify tracking-wide text-md select-none">
                              {currentSentences.map((sentence, idx) => {
                                const realIdx = activeBookPage * sentencesPerPage + idx;
                                const isSelected = selectedBookSentenceId === sentence.id;
                                const isSentencePlaying = activeBookSentenceIdx === realIdx;

                                return (
                                  <span 
                                    key={sentence.id}
                                    onClick={() => {
                                      playSynthBeep('click');
                                      setSelectedBookSentenceId(sentence.id);
                                      setActiveBookSentenceIdx(realIdx);
                                      speakTextEn(sentence.text);
                                    }}
                                    className={`cursor-pointer transition-all duration-300 mx-0.5 px-1 py-0.5 rounded inline ${
                                      isSelected 
                                        ? "bg-amber-400/25 text-white font-bold border-b border-amber-400 shadow-[0_2px_10px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/25" 
                                        : isSentencePlaying 
                                        ? "bg-cyan-500/10 text-cyan-200 border-b border-cyan-400/50" 
                                        : "hover:bg-white/5 hover:text-white"
                                    }`}
                                  >
                                    {sentence.text.split(" ").map((word, wIdx) => {
                                      const trimmedStr = word.toLowerCase().replace(/[^a-z]/g, "");
                                      const isCoreCollected = vocabularies.some(v => v.word.toLowerCase() === trimmedStr);
                                      const vocabObj = vocabularies.find(v => v.word.toLowerCase() === trimmedStr);
                                      
                                      let textAccentColor = isSelected ? "text-white" : "text-zinc-350";
                                      let customUnderline = "border-transparent";
                                      if (isCoreCollected && vocabObj) {
                                        customUnderline = vocabObj.color === 'green' ? "border-emerald-400/40" : vocabObj.color === 'red' ? "border-rose-500/40" : "border-lime-400/40";
                                        textAccentColor = vocabObj.color === 'green' ? "text-emerald-400 font-black" : vocabObj.color === 'red' ? "text-rose-400 font-black" : "text-lime-400 font-black neon-glow";
                                      }

                                      return (
                                        <span 
                                          key={wIdx}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            initiateWordLookup(word);
                                          }}
                                          className={`cursor-pointer border-b-2 hover:text-[#D4FF00] hover:scale-105 active:text-cyan-400 transition-all px-0.5 inline-block ${customUnderline} ${textAccentColor}`}
                                        >
                                          {word}
                                        </span>
                                      );
                                    })}
                                    {" "}
                                  </span>
                                );
                              })}
                            </div>

                            {/* page number footer in book */}
                            <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500 font-bold uppercase border-t border-orange-950/20 pt-3 shrink-0">
                              <span>频道ID Node: {lesson.id}</span>
                              <span className="text-[#D4FF00]">第 {activeBookPage + 1} / {totalPages} 页</span>
                            </div>
                          </div>

                          {/* Dynamic Deep Study Assistant HUD Panel Shown when user selects any book sentence */}
                          <AnimatePresence>
                            {selectedSentenceObj && (
                              <motion.div 
                                className="mt-4 bg-[#0d0c0c] border border-cyan-500/15 rounded-2xl p-4.5 shadow-2xl relative overflow-hidden"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                              >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/5 filter blur-xl rounded-full" />
                                <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-cyan-400 font-bold uppercase">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                                    <span>🔍 句子深度研读中 (Deep Sentence Parsing)</span>
                                  </div>
                                  <button 
                                    onClick={() => setSelectedBookSentenceId(null)}
                                    className="text-neutral-500 hover:text-white px-1 font-sans"
                                  >
                                    ✕ 关闭
                                  </button>
                                </div>
                                <p className="text-zinc-400 text-[11px] leading-relaxed mb-3.5 italic">
                                  "{selectedSentenceObj.text}"
                                </p>
                                <div className="bg-[#141210] p-2.5 rounded-xl border border-white/5 mb-4">
                                  <span className="block text-[8px] font-mono text-[#D4FF00] uppercase font-bold mb-0.5">中文翻译对照</span>
                                  <p className="text-zinc-300 text-xs font-semibold leading-relaxed">{selectedSentenceObj.translation}</p>
                                </div>

                                <div className="flex gap-2 justify-between">
                                  <button 
                                    onClick={() => {
                                      playSynthBeep('click');
                                      setDeconstructSentenceId(selectedSentenceObj.id);
                                      setSelectedPillIndex(null);
                                    }}
                                    className="px-3 py-2 bg-cyan-500 text-black text-[10px] font-bold rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                                  >
                                    <Cpu className="w-3.5 h-3.5" /> 句法和语法解构
                                  </button>

                                  <button 
                                    onClick={() => {
                                      playSynthBeep('click');
                                      handleShadowingSpeech(selectedSentenceObj.text);
                                    }}
                                    className="px-3 py-2 bg-neutral-900 border border-neutral-800 text-[#D4FF00] text-[10px] font-bold rounded-xl flex items-center gap-1.5 active:scale-95 transition-all"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" /> 慢速合成朗读
                                  </button>

                                  <button
                                    onClick={() => {
                                      playSynthBeep('click');
                                      toggleSentenceFavorite(selectedSentenceObj.text);
                                    }}
                                    className={`p-2 rounded-xl flex items-center justify-center border transition-all ${favorites.includes(selectedSentenceObj.text) ? "text-amber-400 bg-amber-400/10 border-amber-400/30" : "text-neutral-600 bg-neutral-900 border-neutral-800"}`}
                                  >
                                    <Star className="w-4 h-4 fill-current" />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* 2. Cozy Book Navigation Drawer Controls bottom-docked */}
                        <div className="bg-zinc-950 border-t border-white/5 p-4 flex flex-col gap-3 z-30">
                          {/* Navigation buttons: Left / Right page turn */}
                          <div className="flex gap-3 justify-between items-center bg-black/40 p-1.5 rounded-2xl border border-white/5">
                            <button 
                              onClick={() => {
                                if (activeBookPage > 0) {
                                  playSynthBeep('click');
                                  setActiveBookPage(prev => prev - 1);
                                  setActiveBookSentenceIdx(null);
                                  setSelectedBookSentenceId(null);
                                }
                              }}
                              disabled={activeBookPage === 0}
                              className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold disabled:opacity-20 active:scale-95 transition-transform font-sans"
                            >
                              ← 上一页
                            </button>

                            {/* Audio Play Aloud ma                            {/* Space holder for clean viewport */}
                            <div className="flex-1" />-black/60 border-white/15 text-zinc-400"}`}
                                  title={showEnglishSubtitles ? "隐藏英文" : "显示英文"}
                                >
                                  英
                                </button>

                                {/* 3. Toggle Chinese subtitles */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setShowChineseSubtitles(!showChineseSubtitles);
                                  }}
                                  className={`w-7 h-7 text-[10px] font-black rounded-full flex items-center justify-center border transition-all ${showChineseSubtitles ? "bg-[#D4FF00] text-black border-[#D4FF00]" : "bg-black/60 border-white/15 text-zinc-400"}`}
                                  title={showChineseSubtitles ? "隐藏中文" : "显示中文"}
                                >
                                  中
                                </button>

                                <div className="relative">
                                  {/* Subtitle Exporter Button */}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSynthBeep('click');
                                      setExportDropdownOpen(prev => !prev);
                                    }}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all backdrop-blur-sm ${exportDropdownOpen ? "bg-[#D4FF00] border-[#D4FF00] text-black shadow-lg" : "bg-black/60 border-white/15 text-white"}`}
                                    title="导出字幕 Subtitle Exporter"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>

                                  {exportDropdownOpen && (
                                    <div className="absolute right-0 top-9 bg-zinc-950 border border-white/10 p-1.5 rounded-xl z-50 flex flex-col gap-1 w-32 shadow-2xl animate-fade-in text-[10px]">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          exportSubtitles('bilingual');
                                          setExportDropdownOpen(false);
                                        }}
                                        className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                      >
                                        <span>🀄 中英双语字幕</span>
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          exportSubtitles('chinese');
                                          setExportDropdownOpen(false);
                                        }}
                                        className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                      >
                                        <span>🇨🇳 纯中文字幕</span>
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          exportSubtitles('english');
                                          setExportDropdownOpen(false);
                                        }}
                                        className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                      >
                                        <span>🇬🇧 纯英文字幕</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* 2. Interactive Main Center play/pause overlay */}
                            {!isVideoCollapsed && (
                              <div 
                                onClick={() => {
                                  playSynthBeep('click');
                                  setIsPlaying(prev => !prev);
                                }}
                                className="relative flex-1 flex items-center justify-center cursor-pointer z-10 group"
                              >
                                <div className="w-12 h-12 rounded-full bg-black/55 hover:bg-[#D4FF00] hover:text-black border border-white/15 flex items-center justify-center backdrop-blur-sm transition-all duration-300 transform group-hover:scale-110 active:scale-95 shadow-2xl">
                                  {isPlaying ? (
                                    <Pause className="w-5 h-5 fill-current" />
                                  ) : (
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 3. Draggable custom slider progress bar and only-audio Mode */}
                            {!isVideoCollapsed && (
                              <div className="relative pb-3 px-4 flex flex-col gap-2 z-10 shrink-0 bg-gradient-to-t from-black via-black/40 to-transparent select-none">
                                {/* Progress timeline track */}
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-mono text-zinc-400 min-w-[32px] block">
                                    {(() => {
                                      const currentSeconds = Math.floor((currentSentenceIndex / (lesson.sentences.length || 1)) * 340);
                                      const m = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
                                      const s = (currentSeconds % 60).toString().padStart(2, '0');
                                      return `${m}:${s}`;
                                    })()}
                                  </span>

                                  {/* Draggable Progress input Seeker bar */}
                                  <input 
                                    type="range"
                                    min={0}
                                    max={lesson.sentences.length - 1}
                                    value={currentSentenceIndex}
                                    onChange={(e) => {
                                      const targetIdx = parseInt(e.target.value);
                                      setCurrentSentenceIndex(targetIdx);
                                      speakTextEn(lesson.sentences[targetIdx].text);
                                    }}
                                    className="flex-1 accent-[#D4FF00] bg-white/20 h-1.5 rounded-full outline-none cursor-pointer"
                                    title="拖拽拖动视频进度"
                                  />

                                  <span className="text-[10px] font-mono text-zinc-400 min-w-[32px] text-right block">
                                    {lesson.durationOrPages}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-ping"></span>
                                    CYBER EYE CH.1 // VIDEO STREAM
                                  </span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSynthBeep('click');
                                      setIsVideoViewClosed(true);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-neutral-850 border border-white/10 flex items-center justify-center text-[#D4FF00] active:scale-95 transition-all active:bg-[#D4FF00] active:text-black"
                                    title="折叠画面仅听原音"
                                  >
                                    <Headphones className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* 2. Alternative Space-saving Audio mode panel if showVideo is false */}
                      {(() => {
                        const isVideo = lesson.contentType === 'video';
                        // For video lessons, we hide this redundant vinyl player whenCollapsed because our toolbar is fully sufficient!
                        if (isVideo) return null;
                        
                        return (
                          <div id="audio_vinyl_player" className="mx-6 mt-4 bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex flex-col gap-3.5 shadow-xl relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4FF00]/5 filter blur-[20px] pointer-events-none rounded-full" />
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3.5">
                                {/* Album cover vinyl spinning track */}
                                <div className="relative w-11 h-11 shrink-0 rounded-full border border-white/10 overflow-hidden flex items-center justify-center bg-black shadow-lg">
                                  <img 
                                    src={lesson.coverImage} 
                                    alt="Audio Disc" 
                                    className={`w-full h-full object-cover rounded-full ${isPlaying ? "animate-spin" : ""}`}
                                    style={{ animationDuration: '10s' }}
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute w-3 h-3 bg-black border border-white/25 rounded-full" />
                                </div>
 
                                <div className="select-none">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded text-[8px] font-black text-[#D4FF00] font-mono tracking-wider uppercase">
                                      播客原音 IMMERSIVE EPISODE
                                    </span>
                                    {isPlaying && (
                                      <div className="flex items-center gap-0.5 h-2">
                                        <span className="w-0.5 h-1.5 bg-[#D4FF00] animate-bounce" style={{ animationDelay: '0.1s' }} />
                                        <span className="w-0.5 h-2 bg-[#D4FF00] animate-bounce" style={{ animationDelay: '0.3s' }} />
                                        <span className="w-0.5 h-1 bg-[#D4FF00] animate-bounce" style={{ animationDelay: '0.5s' }} />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-white text-xs font-black tracking-tight mt-0.5 max-w-[135px] truncate">{lesson.title}</p>
                                </div>
                              </div>
 
                              {/* Simple Play toggle trigger */}
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setIsPlaying(!isPlaying);
                                  }}
                                  className="w-10 h-10 rounded-full bg-[#D4FF00] text-black flex items-center justify-center font-black shadow-lg active:scale-90 transition-transform"
                                >
                                  {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                                </button>
                              </div>
                            </div>
 
                            {/* Clickable slider timeline progress bar */}
                            <div className="flex items-center gap-3 bg-neutral-950/40 p-2.5 rounded-xl border border-white/5">
                              <span className="text-[9px] font-mono text-zinc-500 min-w-[32px] block font-bold">
                                {(() => {
                                  const currentSeconds = Math.floor((currentSentenceIndex / (lesson.sentences.length || 1)) * 340);
                                  const m = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
                                  const s = (currentSeconds % 60).toString().padStart(2, '0');
                                  return `${m}:${s}`;
                                })()}
                              </span>
 
                              <input 
                                type="range"
                                min={0}
                                max={lesson.sentences.length - 1}
                                value={currentSentenceIndex}
                                onChange={(e) => {
                                  const targetIdx = parseInt(e.target.value);
                                  const isImported = !DEFAULT_LESSONS.some(dl => dl.id === lesson.id);
                                  if (isImported && !isPremiumUser && targetIdx * 6.5 >= 60) {
                                    setApiErrorMessage("普通免费试用版限制：自主导入的数据资源每次仅能研读前 1 分钟（前 60 秒时间区）。快订阅 CYBER 会员打破束缚！🎁");
                                    setShowPaymentModal(true);
                                    return;
                                  }
                                  setCurrentSentenceIndex(targetIdx);
                                  speakTextEn(lesson.sentences[targetIdx].text);
                                }}
                                className="flex-1 accent-[#D4FF00] bg-white/10 h-1.5 rounded-full outline-none cursor-pointer"
                              />
 
                              <span className="text-[9px] font-mono text-zinc-500 min-w-[32px] text-right block font-bold">
                                {lesson.durationOrPages}
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Right Edge Miniature Map bar marking word positions */}
                      <div className="absolute right-1.5 top-28 bottom-24 w-[4px] bg-white/5 rounded-full z-30 overflow-hidden">
                        <div className="absolute top-[20%] w-full h-[6px] bg-emerald-400 shadow-[0_0_5px_#00FF66] rounded"></div>
                        <div className="absolute top-[45%] w-full h-[10px] bg-lime-400 shadow-[0_0_8px_#D4FF00] rounded"></div>
                        <div className="absolute top-[75%] w-full h-[4px] bg-red-500 rounded"></div>
                        <div className="absolute top-[35%] w-full h-[22%] bg-lime-400/20 border-y border-lime-400/50"></div>
                      </div>

                      {/* Main subtitle/text rendering flow pane */}
                      <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 no-scrollbar scroll-smooth relative">
                        {/* Cyber Interactive Study Toolbar */}
                        <div id="cyber_interactive_toolbar" className="mb-6 bg-[#111113] border border-white/5 rounded-2xl p-3 flex flex-wrap gap-2.5 items-center justify-between select-none font-sans text-xs">
                          {/* 1. Video Display Toggle (Only shown for video lessons) */}
                          {lesson.contentType === 'video' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  playSynthBeep('click');
                                  setIsVideoCollapsed(!isVideoCollapsed);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 transition-all active:scale-95 border ${
                                  !isVideoCollapsed 
                                    ? "bg-neutral-800 border-white/10 text-white" 
                                    : "bg-[#D4FF00] text-black border-[#D4FF00] shadow-lg shadow-lime-400/10"
                                }`}
                              >
                                <span>{!isVideoCollapsed ? "🧘 纯音研读 (隐藏视频)" : "🎬 展开画面 (视频模式)"}</span>
                              </button>
                            </div>
                          )}

                          {/* 2. Chinese Translation display toggle (Simple toggle) */}
                          <button
                            onClick={() => {
                              playSynthBeep('click');
                              setShowChineseSubtitles(!showChineseSubtitles);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 transition-all active:scale-95 border ${
                              showChineseSubtitles 
                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                                : "bg-neutral-900 border-white/5 text-zinc-500"
                            }`}
                            title="中文字幕显示切换"
                          >
                            <span>{showChineseSubtitles ? "★ 中西对照: 开启" : "☆ 纯英研读: 关闭中文"}</span>
                          </button>

                          {/* 3. Font zoom sizing */}
                          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-white/5">
                            <button
                              onClick={() => {
                                playSynthBeep('click');
                                if (fontSizeFactor === 'lg') setFontSizeFactor('md');
                                else if (fontSizeFactor === 'xl') setFontSizeFactor('lg');
                              }}
                              disabled={fontSizeFactor === 'md'}
                              className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none font-extrabold text-[9px]"
                              title="缩小字号 Font Shrink"
                            >
                              -
                            </button>
                            <span className="text-[9px] font-black text-[#D4FF00] font-sans px-1 select-none whitespace-nowrap">
                              字号: {fontSizeFactor === 'md' ? '小' : fontSizeFactor === 'lg' ? '中' : '大'}
                            </span>
                            <button
                              onClick={() => {
                                playSynthBeep('click');
                                if (fontSizeFactor === 'md') setFontSizeFactor('lg');
                                else if (fontSizeFactor === 'lg') setFontSizeFactor('xl');
                              }}
                              disabled={fontSizeFactor === 'xl'}
                              className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none font-extrabold text-[9px]"
                              title="放大字号 Font Expand"
                            >
                              +
                            </button>
                          </div>

                          {/* 4. Subtitle Exporter (Share & Download All) */}
                          <div className="relative">
                            <button
                              onClick={() => {
                                playSynthBeep('click');
                                setExportDropdownOpen(!exportDropdownOpen);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all active:scale-95 border ${
                                exportDropdownOpen 
                                  ? "bg-[#D4FF00] text-black border-[#D4FF00]" 
                                  : "bg-neutral-900 border-white/5 text-zinc-400 hover:text-white"
                              }`}
                            >
                              <Download className="w-3 h-3 shrink-0" />
                              <span>📥 导出/分享全部字幕</span>
                            </button>

                            {exportDropdownOpen && (
                              <div className="absolute right-0 bottom-9 bg-zinc-950 border border-white/10 p-1.5 rounded-xl z-50 flex flex-col gap-1 w-32 shadow-2xl animate-fade-in text-[10px]">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportSubtitles('bilingual');
                                    setExportDropdownOpen(false);
                                  }}
                                  className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                >
                                  <span>🀄 中英双语字幕</span>
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportSubtitles('chinese');
                                    setExportDropdownOpen(false);
                                  }}
                                  className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                >
                                  <span>🇨🇳 纯中文字幕</span>
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportSubtitles('english');
                                    setExportDropdownOpen(false);
                                  }}
                                  className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                >
                                  <span>🇬🇧 纯英文字幕</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {lesson.sentences.map((sentence, sIdx) => {
                          const isFocussed = sIdx === currentSentenceIndex;
                          
                          return (
                            <div 
                              key={sentence.id}
                              className={`transition-all duration-500 py-6 pr-4 relative border-b border-white/5 ${isFocussed ? "opacity-100 py-8" : "opacity-25"}`}
                              onClick={() => {
                                playSynthBeep('click');
                                const isImported = !DEFAULT_LESSONS.some(dl => dl.id === lesson.id);
                                if (isImported && !isPremiumUser && sIdx * 6.5 >= 60) {
                                  setApiErrorMessage("普通免费试用版限制：自主导入的数据资源每次仅能研读前 1 分钟（前 60 秒卡片区）。快订阅 CYBER 会员打破束缚！🎁");
                                  setShowPaymentModal(true);
                                  return;
                                }
                                setCurrentSentenceIndex(sIdx);
                                speakTextEn(sentence.text);
                              }}
                            >
                              {/* Electro fluorescent yellow side guideline anchor for high-focus view */}
                              {isFocussed && (
                                <motion.div 
                                  className="absolute left-[-24px] top-6 bottom-6 w-1 bg-[#D4FF00] rounded-r shadow-[0_0_10px_#D4FF00]" 
                                  layoutId="sideGuideline"
                                />
                              )}

                              <div className="flex flex-wrap gap-x-1.5 gap-y-2 mb-3">
                                {sentence.text.split(" ").map((word, wIdx) => {
                                  const trimmedStr = word.toLowerCase().replace(/[^a-z]/g, "");
                                  const isCoreCollected = vocabularies.some(v => v.word.toLowerCase() === trimmedStr);
                                  const vocabObj = vocabularies.find(v => v.word.toLowerCase() === trimmedStr);
                                  
                                  let textAccentColor = "text-white";
                                  let customUnderline = "border-transparent";
                                  if (isCoreCollected && vocabObj) {
                                    customUnderline = vocabObj.color === 'green' ? "border-emerald-400/40" : vocabObj.color === 'red' ? "border-rose-500/40" : "border-lime-400/40";
                                    textAccentColor = vocabObj.color === 'green' ? "text-emerald-400 font-bold" : vocabObj.color === 'red' ? "text-rose-400 font-bold" : "text-lime-400 font-black neon-glow";
                                  }

                                  return (
                                    <span 
                                      key={wIdx} 
                                      className={`font-bold tracking-tight cursor-pointer hover:scale-105 active:text-lime-400 border-b-2 transition-all duration-350 ${
                                        fontSizeFactor === 'md' 
                                          ? "text-[16px] leading-snug" 
                                          : fontSizeFactor === 'lg' 
                                          ? "text-[21px] leading-relaxed" 
                                          : "text-[27px] leading-loose"
                                      } ${customUnderline} ${textAccentColor} ${
                                        !showEnglishSubtitles ? "blur-md select-none opacity-10 hover:blur-none hover:opacity-100" : ""
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        initiateWordLookup(word);
                                      }}
                                    >
                                      {word}
                                    </span>
                                  );
                                })}
                              </div>

                              {/* Chinese helper line shown for every sentence under subtitle, highlighted on focus */}
                              {showChineseSubtitles && !isZenMode && (
                                <p 
                                  className={`mt-2 font-bold leading-relaxed tracking-wide transition-all duration-300 ${
                                    isFocussed ? "text-[#D4FF00]" : "text-neutral-500 hover:text-neutral-400"
                                  } ${
                                    fontSizeFactor === 'md' 
                                      ? "text-xs" 
                                      : fontSizeFactor === 'lg' 
                                      ? "text-sm" 
                                      : "text-base"
                                  }`}
                                >
                                  {sentence.translationCn || sentence.translation}
                                </p>
                              )}

                              {/* Space operations layout bar for ADHD tactile triggers */}
                              {isFocussed && (
                                <motion.div 
                                  className="flex gap-2.5 mt-5"
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                >
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSynthBeep('click');
                                      setDeconstructSentenceId(sentence.id);
                                      setSelectedPillIndex(null);
                                    }}
                                    className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-[10px] font-mono font-bold text-white tracking-widest uppercase flex items-center gap-1.5 active:bg-[#D4FF00] active:text-black transition-colors"
                                  >
                                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> 句法
                                  </button>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSynthBeep('click');
                                      handleShadowingSpeech(sentence.text);
                                    }}
                                    className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-[10px] font-mono font-bold text-neutral-400 tracking-widest uppercase flex items-center gap-1.5 active:scale-95 transition-transform"
                                  >
                                    <Volume2 className="w-3.5 h-3.5 text-[#D4FF00]" /> 慢速
                                  </button>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSynthBeep('success');
                                      setSharedSubtitleText(sentence.text);
                                      setSharedSubtitleTranslation(sentence.translationCn || sentence.translation);
                                      setShowSubtitleShareModal(true);
                                    }}
                                    className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-1.5 active:scale-95 transition-transform"
                                    title="分享此句字幕"
                                  >
                                    <Share2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> 分享
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSentenceFavorite(sentence.text);
                                    }}
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-transform ${favorites.includes(sentence.text) ? "text-amber-400 bg-amber-400/10 border border-amber-400/30" : "text-neutral-600 bg-neutral-900 border border-neutral-800"}`}
                                    title="收藏此句"
                                  >
                                    <Star className="w-4 h-4 fill-current" />
                                  </button>
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Simulated Wave audio-play control bar docked at bottom */}
                      {lesson.contentType !== 'video' && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center justify-between z-50">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                playSynthBeep('click');
                                setIsPlaying(prev => !prev);
                              }}
                              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center active:scale-95 transition-transform"
                            >
                              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                            </button>
                            <div>
                              <div className="text-[9px] font-mono text-cyan-400 font-black uppercase tracking-wider">极速流音频研读中 HD</div>
                              <div className="text-white text-xs font-bold font-mono">
                                句子 {currentSentenceIndex + 1} / {lesson.sentences.length}
                              </div>
                            </div>
                          </div>

                          {/* Loop single sentence switch */}
                          <button 
                            onClick={() => {
                              playSynthBeep('click');
                              setIsLoopingSentence(prev => !prev);
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 border transition-all ${isLoopingSentence ? "bg-[#D4FF00]/10 border-[#D4FF00] text-[#D4FF00]" : "bg-neutral-900 border-neutral-800 text-neutral-400"}`}
                            title="单句循环锁定"
                          >
                            <Repeat className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab 1: 🎧 Listen Dashboard L1 */}
          <div className={`flex-1 flex flex-col px-5 overflow-y-auto no-scrollbar pb-24 ${currentTab === 'listen' ? "" : "hidden"}`}>
            
            {/* Header branding */}
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4FF00]/10 flex items-center justify-center border border-[#D4FF00]/30">
                  <Activity className="w-4 h-4 text-[#D4FF00]" />
                </div>
                <span className="text-xl font-black text-white tracking-tighter">Lingua.</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-ping"></span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black">AIOS Hub v6.2</span>
              </div>
            </div>

            {/* Continuing Immersion Hero card (40% page impact) */}
            <div 
              onClick={() => {
                const targetId = lastLearnedItem ? lastLearnedItem.id : (lessons[0]?.id || "jobs-commencement");
                if (lastLearnedItem && lastLearnedItem.type === 'word') {
                  playSynthBeep('click');
                  setCurrentTab('vault');
                  setVaultMainCategory('words');
                  const matchedWord = vocabularies.find(v => v.word.toLowerCase() === lastLearnedItem.title.toLowerCase());
                  if (matchedWord) {
                    setExpandedVocabId(matchedWord.id);
                  }
                } else {
                  selectActiveLesson(targetId);
                }
              }}
              className="mt-4 bg-[#111113]/90 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden box-glow cursor-pointer group active:scale-98 transition-all"
            >
              {/* Soft neon core glow filter */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4FF00]/15 rounded-full filter blur-[50px] pointer-events-none" />

              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-[#D4FF00]/10 border border-[#D4FF00]/30 rounded-full text-[9px] font-mono font-bold text-[#D4FF00] tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse"></span> 继续学习
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">已连续学习 {stats.streak} 天</span>
              </div>

              {/* Dynamic Last Learned Item rendering */}
              {lastLearnedItem ? (
                <div>
                  <span className="text-[10px] font-mono text-[#D4FF00] uppercase tracking-widest block font-black mb-1">
                    {lastLearnedItem.type === 'epub' ? "📚 E-BOOK 书籍经典" : lastLearnedItem.type === 'video' ? "🎬 BLOG VIDEO 视频网课" : lastLearnedItem.type === 'word' ? "🗃️ VOCABULARY 生词温习" : "🎙️ ORIGINAL AUDIO 原声听力"}
                  </span>
                  <h3 className="text-white text-2xl font-black leading-tight mb-2 tracking-tight group-hover:text-[#D4FF00] transition-colors truncate max-w-full">
                    {lastLearnedItem.type === 'word' ? splitWordIntoSyllables(lastLearnedItem.title) : lastLearnedItem.title}
                  </h3>
                  <p className="text-neutral-500 text-xs mb-5 font-medium">上次学习到此进度，点击一键恢复声波沉浸学习。</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-white text-3xl font-black leading-tight mb-2 tracking-tight group-hover:text-[#D4FF00] transition-colors">
                    继续沉浸<br />原声语境。
                  </h2>
                  <p className="text-neutral-500 text-xs mb-6 font-medium">点击继续，让极简声音科技抚平传统背词压力。</p>
                </div>
              )}

              {/* Holographic start play button */}
              <button className="w-full bg-[#D4FF00] hover:bg-[#cbf500] text-black font-black py-4 rounded-2xl flex justify-center items-center gap-2 transition-all active:scale-95 text-xs tracking-wider uppercase">
                恢复声波破译舱 <Zap className="w-4 h-4 fill-black" />
              </button>
            </div>

             {/* Universal Extractor Parser Grid (Matching Slava Kornilov aesthetic) */}
             <div className="mt-5">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black mb-3 pl-1">
                资源导入 CENTRAL INGRESS
              </div>
              <div className="grid grid-cols-2 gap-3" id="extractor-grid">
                {/* Left Column: URL Scan, spans full grid height virtually or beautifully styled taller */}
                <button 
                  onClick={() => {
                    playSynthBeep('click');
                    if (!isWechatBound) {
                      setLoginRequiredReason("数据长期安全同步提示🐾：为了让您自定的 URL 导入的流媒体和网页精读内容能够安全、长期保持备份不丢失，需要通过微信同步到您的账户中。");
                      setShowLoginModal(true);
                    } else if (checkImportLimit()) {
                      setActiveImportTab('url');
                      setShowImport舱(true);
                    }
                  }}
                  className="bg-[#111113] hover:bg-[#161619] border border-white/5 hover:border-[#D4FF00]/50 rounded-2xl p-4 flex flex-col justify-between text-left transition-all active:scale-98 min-h-[120px] shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
                  id="url-scan-tile"
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-[#D4FF00] mb-4 group-hover:shadow-[0_0_15px_rgba(212,255,0,0.3)] transition-all">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-white text-sm font-black tracking-tight leading-none mb-1">URL 导入</span>
                    <span className="block text-neutral-500 text-[9px] leading-tight font-medium">支持 B 站、网页或各种流媒体音频解析</span>
                  </div>
                </button>

                {/* Right Column: Split into 2 rows inside a flex layout */}
                <div className="flex flex-col gap-3">
                  {/* Local Media (Audio/Video uploads) */}
                  <button 
                    onClick={() => {
                      playSynthBeep('click');
                      if (!isWechatBound) {
                        setLoginRequiredReason("数据长期安全同步提示🐾：为了长期安全、稳定地在您的个人云端中转录和存储本地音视频资源，我们需要关联您的微信同步账号。");
                        setShowLoginModal(true);
                      } else if (checkImportLimit()) {
                        setActiveImportTab('media');
                        setShowImport舱(true);
                      }
                    }}
                    className="flex-1 bg-[#111113] hover:bg-[#161619] border border-[#ff3200]/20 hover:border-[#D4FF00]/50 rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all active:scale-98 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
                    id="local-media-tile"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-emerald-400 group-hover:shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all">
                      <FileAudio className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-white text-[12px] font-black leading-tight">导入本地音视频</span>
                      <span className="block text-neutral-500 text-[8px] font-mono leading-none mt-0.5">支持 MP4 视频或 MP3 音频转录</span>
                    </div>
                  </button>

                  {/* EPUB/PDF Reader (Digital Books Shelf) */}
                  <button 
                    onClick={() => {
                      playSynthBeep('click');
                      if (!isWechatBound) {
                        setLoginRequiredReason("数据长期安全同步提示🐾：为了能保证您精挑细选导入的 EPUB/PDF 电子书书架和对应的阅读高光历史不丢失，需要进行微信授权绑定。");
                        setShowLoginModal(true);
                      } else if (checkImportLimit()) {
                        setActiveImportTab('epub');
                        setShowImport舱(true);
                      }
                    }}
                    className="flex-1 bg-[#111113] hover:bg-[#161619] border border-white/5 hover:border-[#D4FF00]/50 rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all active:scale-98 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
                    id="epub-reader-tile"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-white text-[12px] font-black leading-tight">导入电子书</span>
                      <span className="block text-neutral-500 text-[8px] font-mono leading-none mt-0.5">支持 EPUB / PDF / TXT精读</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Captured resources database lists */}
            <div className="mt-8 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4 pl-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black">最新新增</span>
                <button 
                  onClick={() => { playSynthBeep('click'); setShowAllLessonsModal(true); }}
                  className="px-2.5 py-1 text-[10px] font-bold text-black bg-[#D4FF00] hover:bg-[#cbf500] rounded-xl tracking-wider transition-all uppercase flex items-center gap-1 active:scale-95"
                >
                  语感岛 ({lessons.length})
                </button>
              </div>

              <div className="space-y-4">
                {lessons.slice(0, 3).map(lesson => (
                  <div 
                    key={lesson.id}
                    onClick={() => {
                      playSynthBeep('click');
                      selectActiveLesson(lesson.id);
                    }}
                    className="bg-[#111113]/90 border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors relative active:scale-98"
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-white shrink-0 relative overflow-hidden">
                        <img src={lesson.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                        <div className="relative z-10 text-lime-400">
                          {lesson.contentType === "video" ? <Play className="w-4 h-4 fill-current" /> : lesson.contentType === "epub" ? <BookOpen className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
                        </div>
                      </div>
                      <div className="overflow-hidden flex-1 pr-2">
                        <span className="text-white text-sm font-bold block truncate max-w-[180px]">{lesson.title}</span>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500 mt-1 uppercase">
                          <span>{lesson.contentType}</span>
                          <span>•</span>
                          <span>{lesson.durationOrPages}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 bg-white/5 px-2 py-1 rounded">
                        {lesson.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab 2: 🗃️ 语感战利品岛 (Neural Vault) Dashboard L1 */}
          <div className={`flex-1 flex flex-col px-5 overflow-y-auto no-scrollbar pb-24 ${currentTab === 'vault' ? "" : "hidden"}`}>
            
            <div className="py-4 flex justify-between items-end">
              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">Neural streams</span>
                <h2 className="text-3xl font-black text-white tracking-tight">语感瀑布流</h2>
              </div>
              <div className="text-right">
                <span className="text-[20px] font-mono font-black text-[#D4FF00] block">
                  {vaultMainCategory === 'words' && vocabularies.filter(v => !v.word.trim().includes(" ")).length}
                  {vaultMainCategory === 'phrases' && vocabularies.filter(v => v.word.trim().includes(" ")).length}
                  {vaultMainCategory === 'sentences' && favorites.length}
                </span>
                <span className="text-[9px] font-mono text-neutral-600 block uppercase font-bold">已收藏</span>
              </div>
            </div>

            {/* Main Categories Selector Drawer */}
            <div className="flex bg-zinc-950 p-1 border border-white/5 rounded-2xl mb-4 mt-2 select-none">
              <button 
                onClick={() => { playSynthBeep('click'); setVaultMainCategory('words'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${vaultMainCategory === 'words' ? "bg-white/10 text-[#D4FF00] font-bold" : "text-neutral-500 hover:text-white"}`}
              >
                单词 ({vocabularies.filter(v => !v.word.trim().includes(" ")).length})
              </button>
              <button 
                onClick={() => { playSynthBeep('click'); setVaultMainCategory('phrases'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${vaultMainCategory === 'phrases' ? "bg-white/10 text-[#D4FF00] font-bold" : "text-neutral-500 hover:text-white"}`}
              >
                词组 ({vocabularies.filter(v => v.word.trim().includes(" ")).length})
              </button>
              <button 
                onClick={() => { playSynthBeep('click'); setVaultMainCategory('sentences'); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${vaultMainCategory === 'sentences' ? "bg-white/10 text-[#D4FF00] font-bold" : "text-neutral-500 hover:text-white"}`}
              >
                句子 ({favorites.length})
              </button>
            </div>

            {/* Words Only: categorized by review progress status with 4 responsive columns */}
            {vaultMainCategory === 'words' && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button 
                  onClick={() => { playSynthBeep('click'); setVaultFilter('all'); }}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${vaultFilter === 'all' ? "bg-white/10 text-white border-white/20" : "bg-neutral-900/60 text-neutral-500 border-neutral-800"}`}
                >
                  <span className="text-[10px] font-bold block leading-none">全部</span>
                  <span className="text-[9px] font-mono text-zinc-400 font-bold block mt-1.5">{vocabularies.filter(v => !v.word.trim().includes(" ")).length}</span>
                </button>
                <button 
                  onClick={() => { playSynthBeep('click'); setVaultFilter('green'); }}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${vaultFilter === 'green' ? "bg-emerald-500/15 text-emerald-400 border-emerald-555/30" : "bg-neutral-900/60 text-neutral-500 border-neutral-800"}`}
                >
                  <span className="text-[10px] font-bold block leading-none text-emerald-400">熟识</span>
                  <span className="text-[9px] font-mono text-emerald-400 block mt-1.5">{vocabularies.filter(v => !v.word.trim().includes(" ") && v.color === 'green').length}</span>
                </button>
                <button 
                  onClick={() => { playSynthBeep('click'); setVaultFilter('yellow'); }}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${vaultFilter === 'yellow' ? "bg-lime-400/10 text-[#D4FF00] border-lime-400/30" : "bg-neutral-900/60 text-neutral-500 border-neutral-800"}`}
                >
                  <span className="text-[10px] font-bold block leading-none text-[#D4FF00]">精读</span>
                  <span className="text-[9px] font-mono text-[#D4FF00] block mt-1.5">{vocabularies.filter(v => !v.word.trim().includes(" ") && v.color === 'yellow').length}</span>
                </button>
                <button 
                  onClick={() => { playSynthBeep('click'); setVaultFilter('red'); }}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${vaultFilter === 'red' ? "bg-rose-500/15 text-rose-400 border-rose-550/30 font-bold" : "bg-neutral-900/60 text-neutral-500 border-neutral-800"}`}
                >
                  <span className="text-[10px] font-bold block leading-none text-rose-400">陌生</span>
                  <span className="text-[9px] font-mono text-rose-400 block mt-1.5">{vocabularies.filter(v => !v.word.trim().includes(" ") && v.color === 'red').length}</span>
                </button>
              </div>
            )}

            <div className="w-full h-px bg-white/5 mb-4"></div>

            {/* Empty stats state with high-end Ghost illustration */}
            {((vaultMainCategory !== 'sentences' && filteredVocabCollection.length === 0) || (vaultMainCategory === 'sentences' && favorites.length === 0)) ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-neutral-600 transform rotate-12 mb-4 animate-bounce">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-white font-black text-md">这里空空如也</h3>
                <p className="text-neutral-500 text-xs px-8 mt-2 leading-relaxed">
                  开始点击原声字幕，或长按电子书生词句子来进行高光收录收藏到语感流中。
                </p>
                <button 
                  onClick={() => { playSynthBeep('click'); setCurrentTab('listen'); }}
                  className="mt-6 px-5 py-2.5 bg-[#D4FF00] text-black text-xs font-black rounded-lg active:scale-95 transition-transform"
                >
                  开始探索波段 
                </button>
              </div>
            ) : vaultMainCategory === 'sentences' ? (
              /* If sentences category selected, output full sentence cards with left-swipe gestures */
              <div className="space-y-4">
                {favorites.map((textStr, sIdx) => {
                  let startX = 0;
                  const isSwiped = swipedSentenceIdx === sIdx;
                  return (
                    <div key={sIdx} className="relative w-full overflow-hidden rounded-2xl">
                      {/* Swipe Underlay Action Layer */}
                      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1.5 bg-zinc-950 px-3 z-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSwipedSentenceIdx(null);
                            playSynthBeep('success');
                            const match = lessons.flatMap(l => l.sentences).find(s => s.text === textStr);
                            setSharedSubtitleText(textStr);
                            setSharedSubtitleTranslation(match ? (match.translationCn || match.translation) : "暂未翻译");
                            setShowSubtitleShareModal(true);
                          }}
                          className="h-[88%] px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-xl flex flex-col justify-center items-center gap-1 min-w-[56px] transition-colors border border-emerald-500/15"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>分享</span>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSwipedSentenceIdx(null);
                            playSynthBeep('success');
                            toggleSentenceFavorite(textStr);
                          }}
                          className="h-[88%] px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-[10px] rounded-xl flex flex-col justify-center items-center gap-1 min-w-[56px] transition-colors border border-rose-500/15"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>删除</span>
                        </button>
                      </div>

                      {/* Foreground Card */}
                      <div 
                        onTouchStart={(e) => {
                          startX = e.touches[0].clientX;
                        }}
                        onTouchEnd={(e) => {
                          const deltaX = startX - e.changedTouches[0].clientX;
                          if (deltaX > 45) {
                            setSwipedSentenceIdx(sIdx);
                            playSynthBeep('click');
                          } else if (deltaX < -45) {
                            if (swipedSentenceIdx === sIdx) {
                              setSwipedSentenceIdx(null);
                              playSynthBeep('click');
                            }
                          }
                        }}
                        onMouseDown={(e) => {
                          startX = e.clientX;
                        }}
                        onMouseUp={(e) => {
                          const deltaX = startX - e.clientX;
                          if (deltaX > 45) {
                            setSwipedSentenceIdx(sIdx);
                            playSynthBeep('click');
                          } else if (deltaX < -45) {
                            if (swipedSentenceIdx === sIdx) {
                              setSwipedSentenceIdx(null);
                              playSynthBeep('click');
                            }
                          }
                        }}
                        className={`bg-[#111113]/80 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-[#D4FF00]/40 flex flex-col justify-between z-10 transition-transform duration-300 ${isSwiped ? "-translate-x-[136px]" : "translate-x-0"}`}
                      >
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <p className="text-white text-sm font-bold leading-relaxed font-sans">{textStr}</p>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              playSynthBeep('click');
                              toggleSentenceFavorite(textStr);
                            }}
                            className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-550/20 active:scale-95 border border-rose-500/20"
                            title="取消收藏"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-1.5">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-black">SENTENCE FRAGMENT</span>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); playSynthBeep('click'); handleShadowingSpeech(textStr); }}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-neutral-850 text-[#D4FF00] border border-white/5 flex items-center gap-1 active:scale-95 transition-all text-[10px] font-extrabold"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>慢速朗读</span>
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); playSynthBeep('click'); speakTextEn(textStr); }}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-neutral-850 text-white border border-white/5 flex items-center gap-1 active:scale-95 transition-all text-[10px] font-extrabold"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
                              <span>朗读</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Immersive phrase waterfall timeline list with left-swipe gestures */
              <div className="space-y-4">
                {filteredVocabCollection.map(v => {
                  let startX = 0;
                  const isSwiped = swipedVocabId === v.id;
                  return (
                    <div key={v.id} className="relative w-full overflow-hidden rounded-2xl">
                      {/* Swipe Underlay Action Layer */}
                      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1.5 bg-zinc-950 px-3 z-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSwipedVocabId(null);
                            playSynthBeep('success');
                            setSharedSubtitleText(`【语感词语卡】${v.word} [${v.phonetic || ""}]\n词性: ${v.partOfSpeech || ""}\n释义: ${v.definitionCn}`);
                            setSharedSubtitleTranslation(v.example ? `例句: ${v.example}` : "");
                            setShowSubtitleShareModal(true);
                          }}
                          className="h-[88%] px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-xl flex flex-col justify-center items-center gap-1 min-w-[56px] transition-colors border border-emerald-500/15"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>分享</span>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSwipedVocabId(null);
                            playSynthBeep('success');
                            setVocabularies(prev => prev.filter(item => item.id !== v.id));
                          }}
                          className="h-[88%] px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-[10px] rounded-xl flex flex-col justify-center items-center gap-1 min-w-[56px] transition-colors border border-rose-500/15"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>删除</span>
                        </button>
                      </div>

                      {/* Foreground Card */}
                      <div 
                        onTouchStart={(e) => {
                          startX = e.touches[0].clientX;
                        }}
                        onTouchEnd={(e) => {
                          const deltaX = startX - e.changedTouches[0].clientX;
                          if (deltaX > 45) {
                            setSwipedVocabId(v.id);
                            playSynthBeep('click');
                          } else if (deltaX < -45) {
                            if (swipedVocabId === v.id) {
                              setSwipedVocabId(null);
                              playSynthBeep('click');
                            }
                          }
                        }}
                        onMouseDown={(e) => {
                          startX = e.clientX;
                        }}
                        onMouseUp={(e) => {
                          const deltaX = startX - e.clientX;
                          if (deltaX > 45) {
                            setSwipedVocabId(v.id);
                            playSynthBeep('click');
                          } else if (deltaX < -45) {
                            if (swipedVocabId === v.id) {
                              setSwipedVocabId(null);
                              playSynthBeep('click');
                            }
                          }
                        }}
                        onClick={() => {
                          if (isSwiped) {
                            setSwipedVocabId(null);
                          } else {
                            playSynthBeep('click');
                            setExpandedVocabId(expandedVocabId === v.id ? null : v.id);
                          }
                        }}
                        className={`bg-[#111113]/80 border rounded-2xl p-5 relative overflow-hidden group hover:border-[#D4FF00]/40 transition-transform duration-300 z-10 ${isSwiped ? "-translate-x-[136px]" : "translate-x-0"} ${expandedVocabId === v.id ? "border-[#D4FF00]/40 bg-zinc-950 shadow-2xl" : "border-white/5 cursor-pointer"}`}
                      >
                        {/* Spatial color flag circle */}
                        <div className="absolute top-5 right-5 flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${v.color === 'green' ? "bg-emerald-400" : v.color === 'red' ? "bg-rose-500" : "bg-lime-400 neon-glow"}`}></span>
                          <span className="text-[9px] font-mono text-neutral-600 uppercase font-black">{v.color === 'green' ? '熟识' : v.color === 'red' ? '陌生' : '核心'}</span>
                        </div>

                        <div className="flex items-center gap-2.5 mb-1.5">
                          <h3 className="text-xl font-black text-white group-hover:text-[#D4FF00] transition-colors">{v.word}</h3>
                          <span className="text-neutral-400 font-mono text-xs">{v.phonetic}</span>
                          <span className="text-[10px] bg-white/5 text-neutral-400 font-bold px-1.5 rounded">{v.partOfSpeech}</span>
                        </div>

                        <p className="text-neutral-400 text-xs leading-relaxed mb-1.5 font-medium">{v.definitionCn}</p>

                        {v.example && expandedVocabId !== v.id && (
                          <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 flex gap-2 items-start relative mt-3">
                            <div className="text-[11px] text-zinc-500 italic flex-1 font-mono">
                              "{v.example}"
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShadowingSpeech(v.example);
                              }}
                              className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white active:scale-90"
                              title="慢速朗读"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-[#D4FF00]" />
                            </button>
                          </div>
                        )}

                        {/* Highly modular slide up card expanded info context from DB */}
                        {expandedVocabId === v.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs font-sans"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Audio pronunciation trigger */}
                            <div className="flex items-center justify-between bg-zinc-900/40 p-2.5 rounded-xl border border-white/5">
                              <span className="text-zinc-400 font-mono text-[10px]">系统语音引擎单词朗读</span>
                              <button 
                                onClick={() => { playSynthBeep('click'); speakTextEn(v.word); }}
                                className="bg-zinc-950 hover:bg-zinc-900 p-2 rounded-lg text-[#D4FF00] border border-white/5 flex items-center gap-1.5 active:scale-95 transition-all text-[11px] font-bold"
                              >
                                <Volume2 className="w-4 h-4" />
                                <span>中速朗读</span>
                              </button>
                            </div>

                            {/* Example sentence with synth voice */}
                            {v.example && (
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold block">示范例句 Example Case</span>
                                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-white/5 flex gap-2.5 items-start">
                                  <p className="text-zinc-200 text-xs italic font-medium leading-relaxed flex-1 font-mono">"{v.example}"</p>
                                  <button 
                                    onClick={() => { playSynthBeep('click'); speakTextEn(v.example); }}
                                    className="w-7 h-7 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center text-[#D4FF00] hover:text-white active:scale-90 shrink-0"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Knowledge base references */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold block mb-1">对应知识库原句 Context From Knowledge Base</span>
                              {(() => {
                                const matched = lessons.flatMap(l => 
                                  l.sentences
                                    .filter(s => s.text.toLowerCase().includes(v.word.toLowerCase()))
                                    .map(s => ({ ...s, lessonTitle: l.title }))
                                );

                                if (matched.length === 0) {
                                  return (
                                    <div className="text-[10px] text-zinc-650 font-mono italic bg-zinc-950/20 py-2.5 px-3 border border-dashed border-white/5 rounded-xl text-center">
                                      知识库暂无对应原句收录
                                    </div>
                                  );
                                }

                                return (
                                  <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                                    {matched.map((match, mIdx) => (
                                      <div key={mIdx} className="bg-zinc-900/80 p-3 rounded-xl border border-white/5 flex gap-2.5 items-start">
                                        <div className="flex-1 space-y-1">
                                          <span className="text-[8px] font-mono bg-[#D4FF00]/10 text-[#D4FF00] px-1.5 py-0.5 rounded block w-fit shrink-0 uppercase tracking-wide font-black">
                                            {match.lessonTitle}
                                          </span>
                                          <p className="text-zinc-300 font-medium font-sans leading-relaxed text-[11px]">{match.text}</p>
                                          <p className="text-zinc-500 text-[10px] font-sans leading-none">{match.translationCn}</p>
                                        </div>
                                        <button 
                                          onClick={() => { playSynthBeep('click'); speakTextEn(match.text); }}
                                          className="w-7 h-7 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white active:scale-95 shrink-0"
                                        >
                                          <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Direct HUD HUD dictionary analyze */}
                            <button 
                              onClick={() => { playSynthBeep('click'); initiateWordLookup(v.word); }}
                              className="w-full bg-[#D4FF00]/10 hover:bg-[#D4FF00]/20 border border-[#D4FF00]/30 py-3 rounded-2xl text-[11px] font-black text-[#D4FF00] active:scale-98 transition-transform"
                            >
                              🔍 呼起 AI 多维度语篇拆解 HUD
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tab 3: ⚙️ 禅庭 (System) Dashboard L1 */}
          <div className={`flex-1 flex flex-col px-5 overflow-y-auto no-scrollbar pb-24 ${currentTab === 'system' ? "" : "hidden"}`}>
            
            <div className="py-4">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">System Logistics</span>
              <h2 className="text-3xl font-black text-white tracking-tight">禅庭</h2>
            </div>

            {/* User credentials ID (Silent auto assigned) */}
            <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 flex items-center justify-between mt-4">
              <div>
                {isWechatBound ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                      alt="Avatar" 
                      className="w-11 h-11 rounded-full border border-white/10 shrink-0 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-[9px] font-mono text-[#D4FF00] tracking-widest uppercase font-black">WECHAT_AUTHORIZED</div>
                      <div className="text-white text-base font-black font-sans">{wechatNickname}</div>
                      <span className="text-[10px] text-neutral-500 block">云备份同步已激活</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase font-black mb-1">ANON_NEURAL_LINK</div>
                    <div className="text-white text-base font-black font-mono">ANON_8F9A_V6.2</div>
                    <span className="text-[10px] text-neutral-500 block">UUID 本机安全存储。未登录关联。</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  playSynthBeep('success');
                  if (!isWechatBound) {
                    setLoginRequiredReason("微信同步开通🐾：授权绑定后，即可打通云数据链路，终身留存您的语感战利品！");
                    setShowLoginModal(true);
                  } else {
                    setIsWechatBound(false);
                    localStorage.setItem("lingua_wechat_bound", "false");
                  }
                }}
                className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${isWechatBound ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-white text-black active:scale-95"}`}
              >
                {isWechatBound ? (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> 注销登录
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" /> 微信登录
                  </>
                )}
              </button>
            </div>

            {/* Quick Access to 复习闪卡 instead of legacy blocks */}
            <div 
              onClick={() => {
                playSynthBeep('click');
                setShowFlashcardSpace(true);
              }}
              className="mt-6 bg-gradient-to-r from-zinc-950 to-[#111113] border border-[#D4FF00]/15 hover:border-[#D4FF00]/50 rounded-[1.5rem] p-4 flex items-center justify-between cursor-pointer hover:shadow-[0_0_20px_rgba(212,255,0,0.06)] active:scale-98 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#D4FF00]/10 flex items-center justify-center text-[#D4FF00] border border-[#D4FF00]/20 group-hover:scale-105 transition-transform shrink-0">
                  <Layers className="w-4 h-4 shadow-[0_0_8px_#D4FF00]" />
                </div>
                <div>
                  <h4 className="text-white text-[13px] font-black group-hover:text-[#D4FF00] transition-colors leading-tight">
                    今日复习目标 {currentFlashcardIndex}/{getReviewQueue().length}项
                  </h4>
                  <p className="text-zinc-500 text-[10px] font-medium leading-none font-sans mt-1.5">进入复习闪卡，标记单词/卡片掌握情况</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#D4FF00]/10 text-[#D4FF00] text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-[#D4FF00]/20 group-hover:bg-[#D4FF00] group-hover:text-black transition-colors shrink-0">
                <span>进入复习</span>
                <ChevronRight className="w-3 h-3 font-bold" />
              </div>
            </div>

            {/* VIP Subscription Card */}
            <div className="mt-8 space-y-6">
              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black mb-3 pl-1 block">Cyber Membership - 会员订阅状态</span>
                
                {isPremiumUser ? (
                  <div className="bg-gradient-to-br from-amber-400/20 via-purple-500/10 to-transparent border border-amber-400/30 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-amber-950/10">
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_#F59E0B]" />
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-white text-base font-black tracking-tight">👑 CYBER 至尊极客会员</span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed font-medium">特权状态：全套 AI 音像句法语序多维拆解、无任何约束高速听写专精系统已对齐启动。</p>
                    <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-500 font-mono tracking-wider">
                      <span>PLAN: CYBER SUPREME GEEK</span>
                      <span>STATUS: ACTIVE</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Zap className="w-4 h-4 text-zinc-550 fill-zinc-500" />
                        <span className="text-white text-sm font-bold block">CYBER 至尊极客会员</span>
                      </div>
                      
                      {/* Subscription Tiers overview */}
                      <div className="grid grid-cols-3 gap-2.5 mb-4">
                        <div className="bg-zinc-950 p-2.5 rounded-xl border border-white/5 text-center">
                          <span className="text-[10px] text-zinc-500 font-mono block">周会员</span>
                          <span className="text-white text-xs font-bold block mt-1">¥7.00/周</span>
                        </div>
                        <div className="bg-zinc-950 p-2.5 rounded-xl border border-white/5 text-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-[#D4FF00] text-black text-[6px] font-black tracking-widest px-1 py-0.5 transform rotate-12 origin-top-right scale-75">TRIAL</div>
                          <span className="text-[10px] text-zinc-500 font-mono block">月会员</span>
                          <span className="text-white text-xs font-bold block mt-1">¥19.90/月</span>
                        </div>
                        <div className="bg-zinc-950 p-2.5 rounded-xl border border-white/5 text-center relative">
                          <span className="text-[10px] text-zinc-500 font-mono block">年会员</span>
                          <span className="text-white text-xs font-bold block mt-1">¥168.00/年</span>
                        </div>
                      </div>

                      {/* Trial highlight */}
                      {isNewUserWithinOneMonth() && (
                        <div className="bg-amber-400/10 border border-amber-400/20 p-3.5 rounded-xl mb-4 text-[11px] text-amber-300">
                          <span className="font-bold">✨ 新用户独享 (首周特惠试用)</span>
                          <p className="mt-1 leading-snug">注册前一个月内：订阅月度会员仅需 <span className="font-black text-white">¥0.90</span> 试用一周；订阅年度会员仅需 <span className="font-black text-white">¥0.09</span> 试用一周！</p>
                        </div>
                      )}

                      <div className="space-y-1.5 bg-zinc-950/80 p-3.5 rounded-xl border border-white/5 text-[11px] text-neutral-400 font-sans">
                        <p className="text-white/80 font-bold mb-1">📋 会员权益与免费限制：</p>
                        <p>• 订阅会员享有全部句法词组收藏、精准细拆解与不限次音视频研读；</p>
                        <p>• 无会员时限学习您自定导入的 <span className="text-[#D4FF00] font-bold">3 个</span> 学习资料；</p>
                        <p>• 无会员时新导入的内容每次学习研读 <span className="text-[#D4FF00] font-bold font-mono">限前 1 分钟</span> 部分。</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => { playSynthBeep('click'); setShowPaymentModal(true); }}
                      className="w-full bg-[#D4FF00] hover:bg-[#cbf500] text-black font-black text-xs py-3 rounded-xl tracking-wider uppercase mt-4 flex items-center justify-center gap-1.5 active:scale-98 transition-transform shadow-[0_4px_12px_rgba(212,255,0,0.15)]"
                    >
                      <Sparkles className="w-4 h-4 fill-black" /> 立即激发并订阅 VIP 会员 (最省 0.09 元)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User credentials ID (Silent auto assigned) */}
            <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 flex items-center justify-between mt-4">
              <div>
                {isWechatBound ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                      alt="Avatar" 
                      className="w-11 h-11 rounded-full border border-white/10 shrink-0 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-[9px] font-mono text-[#D4FF00] tracking-widest uppercase font-black">WECHAT_AUTHORIZED</div>
                      <div className="text-white text-base font-black font-sans">{wechatNickname}</div>
                      <span className="text-[10px] text-neutral-500 block font-sans">云备份同步已激活</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase font-black mb-1">ANON_NEURAL_LINK</div>
                    <div className="text-white text-base font-black font-mono">ANON_8F9A_V6.2</div>
                    <span className="text-[10px] text-neutral-500 block font-sans">UUID 本机安全存储。未登录关联。</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  playSynthBeep('success');
                  if (!isWechatBound) {
                    setLoginRequiredReason("微信同步开通🐾：授权绑定后，即可打通云数据链路，终身留存您的语感战利品！");
                    setShowLoginModal(true);
                  } else {
                    setIsWechatBound(false);
                    localStorage.setItem("lingua_wechat_bound", "false");
                  }
                }}
                className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${isWechatBound ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-white text-black active:scale-95"}`}
              >
                {isWechatBound ? (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> 注销登录
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" /> 微信登录
                  </>
                )}
              </button>
            </div>

            {/* Quick Access to 复习闪卡 instead of legacy blocks */}
            <div 
              onClick={() => {
                playSynthBeep('click');
                setShowFlashcardSpace(true);
              }}
              className="mt-6 bg-gradient-to-r from-zinc-950 to-[#111113] border border-[#D4FF00]/15 hover:border-[#D4FF00]/50 rounded-[1.5rem] p-4 flex items-center justify-between cursor-pointer hover:shadow-[0_0_20px_rgba(212,255,0,0.06)] active:scale-98 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#D4FF00]/10 flex items-center justify-center text-[#D4FF00] border border-[#D4FF00]/20 group-hover:scale-105 transition-transform shrink-0">
                  <Layers className="w-4 h-4 shadow-[0_0_8px_#D4FF00]" />
                </div>
                <div>
                  <h4 className="text-white text-[13px] font-black group-hover:text-[#D4FF00] transition-colors leading-tight">
                    今日复习目标 {currentFlashcardIndex}/{getReviewQueue().length}项
                  </h4>
                  <p className="text-zinc-500 text-[10px] font-medium leading-none font-sans mt-1.5">进入复习闪卡，标记单词/卡片掌握情况</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#D4FF00]/10 text-[#D4FF00] text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-[#D4FF00]/20 group-hover:bg-[#D4FF00] group-hover:text-black transition-colors shrink-0">
                <span>进入复习</span>
                <ChevronRight className="w-3 h-3 font-bold" />
              </div>
            </div>

            {/* VIP Subscription Card */}
            <div className="mt-8 space-y-6">
              {/* Part 2: VIP Subscription Card */}
              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black mb-3 pl-1 block">Cyber Membership - 会员订阅状态</span>
                
                {isPremiumUser ? (
                  <div className="bg-gradient-to-br from-amber-400/20 via-purple-500/10 to-transparent border border-amber-400/30 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-amber-950/10">
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_#F59E0B]" />
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-white text-base font-black tracking-tight">👑 CYBER 至尊极客会员</span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed font-medium">特权状态：全套 AI 音像句法语序多维拆解、无任何约束高速听写专精系统已对齐启动。</p>
                    <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-500 font-mono tracking-wider">
                      <span>PLAN: LIFETIME UNLIMITED PRO</span>
                      <span>STATUS: ACTIVE</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Zap className="w-4 h-4 text-zinc-500" />
                        <span className="text-white text-sm font-bold block">极简流媒体学习特权</span>
                      </div>
                      <p className="text-neutral-500 text-xs leading-relaxed font-normal">解锁深度 AI 句法全维度拆分包、无限次数音视频转录翻译缓存、ADHD 多维体感辅助白噪声。</p>
                    </div>

                    <button 
                      onClick={() => { playSynthBeep('click'); setShowPaymentModal(true); }}
                      className="w-full bg-[#D4FF00] hover:bg-[#cbf500] text-black font-black text-xs py-3 rounded-xl tracking-wider uppercase mt-4 flex items-center justify-center gap-1.5 active:scale-98 transition-transform shadow-[0_4px_12px_rgba(212,255,0,0.15)]"
                    >
                      <Sparkles className="w-4 h-4 fill-black" /> 立即激发并订阅 VIP 会员 (¥19.00/月)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Secure Danger Erase Area with liquid confirmation hold limits */}
            <div className="mt-8 mb-5">
              <span className="text-rose-500 uppercase font-mono text-[9px] font-black tracking-widest pl-1 mb-3 block">高风险操作区 DANGER ZONE</span>
              <div className="bg-[#111113] border border-rose-500/20 rounded-2xl p-5 flex flex-col justify-center">
                <span className="text-rose-400 text-sm font-bold block">毁灭式清空本地全部存储缓存</span>
                <span className="text-neutral-500 text-[10px] mt-0.5 block">需要持续按住 3 秒进行指纹模拟生物解锁验证以避免误触。</span>

                {/* Simulated filling gauge */}
                <div 
                  onMouseDown={() => setIsHoldingWipe(true)}
                  onMouseUp={() => setIsHoldingWipe(false)}
                  onMouseLeave={() => setIsHoldingWipe(false)}
                  onTouchStart={() => setIsHoldingWipe(true)}
                  onTouchEnd={() => setIsHoldingWipe(false)}
                  className="w-full h-14 bg-zinc-950 border border-rose-950 rounded-2xl overflow-hidden mt-4 relative cursor-pointer flex items-center justify-center select-none active:scale-98 transition-transform"
                >
                  {/* Liquid progress */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-rose-500/20 border-r-2 border-rose-500 transition-all"
                    style={{ width: `${wipeHoldProgress}%` }}
                  />
                  <div className="relative z-10 flex items-center gap-2 text-rose-400 font-mono text-[10px] uppercase font-black tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                    按住 3 秒执行数据毁灭清除
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Capsule navigation island docked at bottom */}
        {!activeLessonId && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/40 border border-white/10 backdrop-blur-3xl rounded-full flex justify-around items-center px-4 z-40 shadow-xl">
            <button 
              onClick={() => { playSynthBeep('click'); setCurrentTab('listen'); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentTab === 'listen' ? "bg-white/10 text-[#D4FF00] shadow-[0_0_15px_rgba(212,255,0,0.15)]" : "text-neutral-500 hover:text-white"}`}
            >
              <Headphones className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => { playSynthBeep('click'); setCurrentTab('vault'); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentTab === 'vault' ? "bg-white/10 text-[#D4FF00] shadow-[0_0_15px_rgba(212,255,0,0.15)]" : "text-neutral-500 hover:text-white"}`}
            >
              <Layers className="w-5 h-5" />
            </button>

            <button 
              onClick={() => { playSynthBeep('click'); setCurrentTab('system'); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentTab === 'system' ? "bg-white/10 text-[#D4FF00] shadow-[0_0_15px_rgba(212,255,0,0.15)]" : "text-neutral-500 hover:text-white"}`}
            >
              <Hexagon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* L3 FULL OVERLAY: Cognitive Custom URL Scan Radar Scanner screen overlay */}
        <AnimatePresence>
          {showImport舱 && (
            <motion.div 
              className="absolute inset-0 bg-[#050505] z-50 flex flex-col pt-10 px-6 overflow-y-auto no-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Back navigation header */}
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => { playSynthBeep('click'); setShowImport舱(false); setLocalMediaFile(null); }}
                  className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-808 flex items-center justify-center text-neutral-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono font-black text-neutral-400 uppercase tracking-widest">智能内容导入舱 UNIVERSAL INGRESS</span>
                <div className="w-10 h-10 opacity-0" />
              </div>

              {/* Loader layout for Analyzing or Local Transcribing */}
              {isAnalyzing || isLocalTranscribing ? (
                <div className="flex-1 flex flex-col justify-center items-center pb-12 w-full text-center">
                  <div className="relative w-44 h-44 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse"></div>
                    <div className="absolute inset-3 rounded-full border border-lime-400/20 border-dashed animate-[spin_8s_linear_infinite]"></div>
                    <div className="absolute inset-1 rounded-full border-t border-r-2 border-[#D4FF00] animate-spin"></div>
                    <div className="absolute inset-5 rounded-full border-b border-l-2 border-cyan-400 animate-[spin_2s_linear_infinite_reverse]"></div>
                    
                    <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[#D4FF00] shadow-[0_0_30px_rgba(212,255,0,0.2)]">
                      <Cpu className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-[#D4FF00]/10 border border-[#D4FF00]/40 rounded-full text-[9px] font-mono text-[#D4FF00] tracking-widest uppercase mb-4 inline-block font-black">
                    {isAnalyzing ? "AI 智能高思断句解析引擎" : "Whisper 听觉声学解算中"}
                  </span>
                  
                  <h3 className="text-white text-xl font-black mb-1">
                    {isAnalyzing ? "正在语义破译对齐..." : "正在转录数字音频..."}
                  </h3>
                  
                  <p className="text-neutral-400 text-xs font-mono mb-8 font-black">
                    {isAnalyzing ? (
                      <>
                        {analyzingStep === 0 && "[📡 正在提取并同步媒体原生字幕軌...]"}
                        {analyzingStep === 1 && "[🧠 正在通过双侧神经突触上传 Gemini AI 高维建模解析...]"}
                        {analyzingStep === 2 && "[🧩 正在分割语法粒子并填充交互式句型药丸...]"}
                        {analyzingStep === 3 && "[⚡ 正在校准词集特征与词类特征对齐...]"}
                        {analyzingStep === 4 && "[✅ 语法特征破译成功，正在激活注入主屏幕]"}
                      </>
                    ) : (
                      <>
                        {localTranscribeStep === 0 && "[📁 正在加载本地二进制音轨波形容器...]"}
                        {localTranscribeStep === 1 && "[🎙️ 正在对齐声带声波时间戳高维印迹...]"}
                        {localTranscribeStep === 2 && "[🧬 正在校准形态学与词形检索锚点...]"}
                        {localTranscribeStep === 3 && "[⚡ 正在写入本地沙盒高频词根索引数据库...]"}
                        {localTranscribeStep === 4 && "[✅ 机器声听转换完毕]"}
                      </>
                    )}
                  </p>

                  <div className="w-56 mx-auto bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#D4FF00] h-full shadow-[0_0_10px_#D4FF00] transition-all duration-1000"
                      style={{ 
                        width: `${isAnalyzing ? (analyzingStep + 1) * 20 : (localTranscribeStep + 1) * 20}%` 
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-1 pb-10">
                  {/* Glass Segment Tab Selector */}
                  <div className="flex bg-neutral-950 p-1 border border-white/5 rounded-xl mb-6">
                    <button 
                      onClick={() => { playSynthBeep('click'); setActiveImportTab('url'); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${activeImportTab === 'url' ? "bg-white/10 text-white shadow-md font-bold" : "text-neutral-500 hover:text-white"}`}
                    >
                      URL导入
                    </button>
                    <button 
                      onClick={() => { playSynthBeep('click'); setActiveImportTab('media'); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${activeImportTab === 'media' ? "bg-white/10 text-white shadow-md font-bold" : "text-neutral-500 hover:text-white"}`}
                    >
                      导入本地资源
                    </button>
                    <button 
                      onClick={() => { playSynthBeep('click'); setActiveImportTab('epub'); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${activeImportTab === 'epub' ? "bg-white/10 text-white shadow-md font-bold" : "text-neutral-500 hover:text-white"}`}
                    >
                      电子书导入
                    </button>
                  </div>

                  {/* 1. Tab: URL LINK PARSE */}
                  {activeImportTab === 'url' && (
                    <div className="flex-1 flex flex-col justify-between" id="tabcontent-url">
                      <div>
                        <span className="px-3 py-1 bg-neutral-900 rounded-full text-[9px] font-mono text-neutral-400 block w-max mb-3 border border-zinc-900 uppercase tracking-widest font-black">
                          AI SCAN SYSTEM
                        </span>
                        <h3 className="text-white text-xl font-black mb-2">通过网络流媒体一键解析</h3>
                        <p className="text-neutral-505 text-xs mb-6">输入任何播客或 B站 视频 URL 链接，系统将自动破译转录文字，搭建极简、无焦虑的中英学习对齐频道。</p>

                        {/* input box */}
                        <div className="bg-neutral-950 border border-zinc-850 rounded-2xl p-4 mb-6">
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5 font-bold">RESOURCE URL - 资源网络链接</label>
                          <input 
                            type="text"
                            value={pasteText}
                            onChange={(e) => setPasteText(e.target.value)}
                            placeholder="请粘贴 B站 视频(如 BV1xx) 或 网页播客链接..."
                            className="w-full text-white bg-transparent outline-none border-none text-xs placeholder-zinc-700 font-mono"
                          />
                        </div>

                        {/* preset helper links */}
                        <div className="space-y-2.5">
                          <span className="text-[9px] font-mono font-black text-neutral-550 uppercase tracking-widest block pl-1">推荐一键体验（免粘贴直接导入）</span>
                          <button 
                            onClick={() => {
                              playSynthBeep('click');
                              setPasteText("https://www.youtube.com/watch?v=AndrewHuberman-Neurobiology-Focus-Tricks");
                            }}
                            className="w-full text-neutral-400 bg-[#111113]/50 hover:bg-[#161619] border border-white/5 rounded-xl p-3.5 text-xs text-left transition-all flex items-center justify-between"
                          >
                            <div className="overflow-hidden pr-2">
                              <span className="block font-black text-[9px] text-[#D4FF00] mb-0.5 uppercase font-mono">播客：安德鲁·休伯曼神经学</span>
                              <span className="block text-neutral-505 text-[10px] truncate">如何自主调谐脑电波进入高浓度专注对齐心流</span>
                            </div>
                            <span className="text-[10px] font-mono font-black text-neutral-550 shrink-0">点击载入</span>
                          </button>

                          <button 
                            onClick={() => {
                              playSynthBeep('click');
                              setPasteText("https://www.bilibili.com/video/BV1TEDTalks-ADHD-Interactive-Mindset");
                            }}
                            className="w-full text-neutral-400 bg-[#111113]/50 hover:bg-[#161619] border border-white/5 rounded-xl p-3.5 text-xs text-left transition-all flex items-center justify-between"
                          >
                            <div className="overflow-hidden pr-2">
                              <span className="block font-black text-[9px] text-[#D4FF00] mb-0.5 uppercase font-mono">B站：TED 神经漫步者利器</span>
                              <span className="block text-neutral-505 text-[10px] truncate">极微小阻力自启动的生理</span>
                            </div>
                            <span className="text-[10px] font-mono font-black text-neutral-550 shrink-0">点击载入</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button 
                          onClick={() => { playSynthBeep('click'); setShowImport舱(false); setPasteText(""); }}
                          className="px-5 py-3.5 bg-neutral-900 border border-neutral-808 text-neutral-400 rounded-xl text-xs font-bold w-1/3 active:scale-95 transition-transform"
                        >
                          返回主界面
                        </button>
                        <button 
                          onClick={() => {
                            if (!pasteText) return;
                            playSynthBeep('success');
                            setIsAnalyzing(true);
                            setAnalyzingStep(0);
                            let step = 0;
                            const interval = setInterval(() => {
                              step++;
                              setAnalyzingStep(step);
                              if (step === 4) {
                                clearInterval(interval);
                                setTimeout(() => {
                                  setIsAnalyzing(false);
                                  setShowImport舱(false);
                                  // Add imported lesson to top of state
                                  const importedId = `imp-${Date.now()}`;
                                  setLessons(prev => [
                                    {
                                      id: importedId,
                                      title: "📥 [已解密本地认知频道] Imported Link Segment",
                                      desc: "Gemini AI Multi-sensory Deconstruct Matrix activated",
                                      sentences: [
                                        {
                                          id: `${importedId}-s1`,
                                          text: "The neurobiology of focus requires active feedback loops between the visual cortex and prefrontal structures.",
                                          translation: "专注的神经生物学需要视觉皮层与前额叶结构之间建立起主动的反馈环路。",
                                          syntaxBlocks: [
                                            { id: `${importedId}-sb1`, token: "The neurobiology of focus", role: "subject" as const, roleCn: "主语", explanation: "名词短语，作为句子的主干核心对象。表示“专注的神经生物学运作机理”。" },
                                            { id: `${importedId}-sb2`, token: "requires", role: "verb" as const, roleCn: "谓语", explanation: "动词的第三人称单数形式，表示“要求、需要”这一核心核心支配行为。" },
                                            { id: `${importedId}-sb3`, token: "active feedback loops", role: "object" as const, roleCn: "宾语", explanation: "名词结构作宾语，表示谓语需求的直达承载物，即“主动的反馈闭环”。" },
                                            { id: `${importedId}-sb4`, token: "between the visual cortex and prefrontal structures", role: "modifier" as const, roleCn: "介词短语修饰核心宾语", explanation: "介词短语，用作后置定语细节描述反馈闭环的多维解剖空间分布（视觉皮层和前额脑区）。" }
                                          ]
                                        }
                                      ]
                                    },
                                    ...prev
                                  ]);
                                  setActiveLessonId(importedId);
                                  setCurrentSentenceIndex(0);
                                  playSynthBeep('success');
                                }, 1000);
                              }
                            }, 1000);
                          }}
                          disabled={!pasteText}
                          className="px-5 py-3.5 bg-[#D4FF00] text-black rounded-xl text-xs font-black flex-1 active:scale-95 transition-transform disabled:opacity-20 flex justify-center items-center gap-2 hover:bg-[#cbf500] shadow-[0_0_15px_rgba(212,255,0,0.2)]"
                        >
                          ⚡ 运行 AI 破译导入
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. Tab: LOCAL AUDIO/VIDEO IMPORT */}
                  {activeImportTab === 'media' && (
                    <div className="flex-1 flex flex-col justify-between" id="tabcontent-media">
                      <div>
                        <span className="px-3 py-1 bg-neutral-900 rounded-full text-[9px] font-mono text-neutral-400 block w-max mb-3 border border-zinc-900 uppercase tracking-widest font-black">
                          LOCAL FILE INGRESS
                        </span>
                        <h3 className="text-white text-xl font-black mb-1">导入本地资源</h3>
                        <p className="text-neutral-505 text-xs mb-6">支持导入手机或电脑本地音视频文件，使用云端智能转录对齐。</p>

                        {!localMediaFile ? (
                          <div className="relative border border-dashed border-zinc-805 bg-[#111113]/20 hover:bg-[#111113]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all group min-h-[160px]">
                            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 duration-300">
                              <Volume2 className="w-5 h-5" />
                            </div>
                            <span className="block text-zinc-500 text-[10px] font-mono tracking-wider mb-4 uppercase">请选择导入媒介 SELECT DIRECT MEDIA COGNITIVE CHANNEL</span>
                            
                            <div className="flex gap-4 w-full z-10 justify-center">
                              <button className="relative px-3 py-2 bg-neutral-900 hover:bg-neutral-850 border border-white/10 hover:border-[#D4FF00]/40 rounded-xl text-white text-[11.5px] font-bold flex items-center gap-1.5 transition-all">
                                <FileAudio className="w-3.5 h-3.5 text-emerald-400" />
                                <span>从文件导入</span>
                                <input 
                                  type="file" 
                                  accept="audio/*,video/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      playSynthBeep('success');
                                      setLocalMediaFile({
                                        name: file.name,
                                        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                                        type: file.type
                                      });
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                              </button>
                              <button className="relative px-3 py-2 bg-neutral-900 hover:bg-neutral-850 border border-white/10 hover:border-[#D4FF00]/40 rounded-xl text-white text-[11.5px] font-bold flex items-center gap-1.5 transition-all">
                                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                                <span>从相册导入</span>
                                <input 
                                  type="file" 
                                  accept="video/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      playSynthBeep('success');
                                      setLocalMediaFile({
                                        name: file.name,
                                        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                                        type: file.type
                                      });
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-neutral-950 border border-emerald-955/40 p-5 rounded-3xl relative">
                            <div className="absolute top-4 right-4">
                              <button 
                                onClick={() => { playSynthBeep('click'); setLocalMediaFile(null); }}
                                className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-neutral-400 hover:text-white"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-[8px] font-mono font-black py-0.5 px-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full tracking-widest uppercase mb-3 inline-block">
                              ☑️ 资源加载就绪，可执行破译
                            </span>
                            <div className="overflow-hidden">
                              <span className="block text-white font-black text-sm truncate pr-8">{localMediaFile.name}</span>
                              <div className="flex gap-4 mt-2 text-[10px] font-mono text-neutral-500 font-bold uppercase">
                                <span>容量大小: {localMediaFile.size}</span>
                                <span>文件格式: {localMediaFile.type.split('/')[0]}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* alternative fast load for demo files */}
                        {!localMediaFile && (
                          <div className="mt-6 space-y-2">
                            <span className="text-[9px] font-mono font-black text-neutral-550 uppercase tracking-widest block pl-1">一键载入默认演示声谱文件（免上传）</span>
                            <button 
                              onClick={() => {
                                  playSynthBeep('click');
                                  setLocalMediaFile({
                                    name: "ADHD_Focus_Stimulation_Brain_Hacks.mp3",
                                    size: "12.4 MB",
                                    type: "audio/mp3"
                                  });
                              }}
                              className="w-full text-neutral-450 bg-neutral-950 hover:bg-[#111113] border border-white/5 rounded-xl p-3 text-xs text-left flex items-center justify-between"
                            >
                              <div className="overflow-hidden pr-2">
                                <span className="block font-black text-[9px] text-emerald-400 uppercase font-mono">演示声谱：双耳阿尔法伴奏</span>
                                <span className="block text-neutral-505 text-[10px] truncate">多动症高倍专注与英文语感无阻力精学.mp3</span>
                              </div>
                              <span className="text-[10px] font-mono font-black text-neutral-550 shrink-0">点击载入</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button 
                          onClick={() => { playSynthBeep('click'); setShowImport舱(false); setLocalMediaFile(null); }}
                          className="px-5 py-3.5 bg-neutral-900 border border-neutral-808 text-neutral-400 rounded-xl text-xs font-bold w-1/3 active:scale-95 transition-transform"
                        >
                          返回主界面
                        </button>
                        <button 
                          onClick={launchLocalMediaTranscribe}
                          disabled={!localMediaFile}
                          className="px-5 py-3.5 bg-emerald-500 text-black rounded-xl text-xs font-black flex-1 active:scale-95 transition-transform disabled:opacity-20 flex justify-center items-center gap-2 hover:bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                        >
                          <Volume2 className="w-4 h-4 fill-black text-black" /> 🚀 智能解构一键导入
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. Tab: EPUB/PDF READER IMPORT */}
                  {activeImportTab === 'epub' && (
                    <div className="flex-1 flex flex-col justify-between" id="tabcontent-epub">
                      <div>
                        <span className="px-3 py-1 bg-neutral-900 rounded-full text-[9px] font-mono text-neutral-400 block w-max mb-3 border border-zinc-900 uppercase tracking-widest font-black">
                          BOOKS INGRESS
                        </span>
                        <h3 className="text-white text-xl font-black mb-1">经典公版电纸书架</h3>
                        <p className="text-neutral-500 text-xs mb-6">点击下方精选公版英文书籍，一秒开启沉浸式 Cozy 英文电纸书阅读世界，轻按单词即可提取翻译。</p>

                        <div className="grid grid-cols-2 gap-3 mb-6" id="demo-bookshelf">
                          {DEMO_BOOKS.map((book) => (
                            <button 
                              key={book.title}
                              onClick={() => {
                                playSynthBeep('success');
                                launchEpubBookImport(book.title, book.sentences);
                              }}
                              className="bg-[#111113]/90 hover:bg-[#161619] border border-white/5 hover:border-cyan-400/50 rounded-2xl p-4 flex flex-col justify-between text-left transition-all active:scale-98 min-h-[140px] group relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full filter blur-[30px] pointer-events-none" />
                              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-cyan-400 mb-4 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all">
                                <BookOpen className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="block text-white text-[12px] font-black leading-tight truncate max-w-[125px]">{book.title}</span>
                                <span className="block text-neutral-500 text-[8px] font-mono leading-none mt-1 uppercase">一键开卷精读</span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* file drop representation */}
                        <div className="relative border border-dashed border-zinc-805 bg-[#111113]/20 hover:bg-[#111113]/40 rounded-2xl p-5 flex items-center gap-3 cursor-pointer transition-all">
                          <input 
                            type="file"
                            accept=".epub,.pdf,.txt"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                playSynthBeep('success');
                                const nameClean = file.name.replace(/\.[^/.]+$/, "");
                                launchEpubBookImport(nameClean, [
                                  {
                                    id: "upl-p1-s1",
                                    text: "Imported content was parsed cleanly. Reading this document helps lock active words.",
                                    translation: "导入的数字图书内容被干净地解析。阅读此段落有助于记忆锁定的高价值词汇。",
                                    syntaxBlocks: [
                                      { id: "up1", token: "Imported content", role: "subject" as const, roleCn: "主语", explanation: "主词名词结构" }
                                    ]
                                  },
                                  {
                                    id: "upl-p1-s2",
                                    text: "Tap on any word dynamically to run your dictionary lookup layers inside the page.",
                                    translation: "在页面内部，动态轻按任意单词均可自主调起词典搜索底片。",
                                    syntaxBlocks: [
                                      { id: "up2", token: "Tap on words", role: "verb" as const, roleCn: "动作动词", explanation: "极小阻力点击查词" }
                                    ]
                                  }
                                ]);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-cyan-400 shrink-0">
                            <Plus className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-white text-[11px] font-black font-sans">手动导入本地方便精读精听 (.epub/.pdf/.txt)</span>
                            <span className="block text-neutral-500 text-[8px] font-mono font-semibold">SUPPORT LOCAL DRAG-DROP</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button 
                          onClick={() => { playSynthBeep('click'); setShowImport舱(false); }}
                          className="px-5 py-3.5 bg-neutral-900 border border-neutral-808 text-neutral-400 rounded-xl text-xs font-bold w-full active:scale-95 transition-transform"
                        >
                          返回极简频道书架
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* L3 FULL OVERLAY: Grammar Deconstruct Pill Matrix jigsaw screen overlay */}
        <AnimatePresence>
          {deconstructSentenceId && (
            <motion.div 
              className="absolute inset-0 bg-[#050505] z-50 flex flex-col pt-12 pb-6 px-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-between items-center py-4 border-b border-white/5 mb-6">
                <button 
                  onClick={() => { playSynthBeep('click'); setDeconstructSentenceId(null); setSelectedPillIndex(null); }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="glass-island px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse"></span>
                  <span className="text-[9px] font-mono text-white tracking-widest uppercase font-black">句法解构矩阵</span>
                </div>
                <div className="w-10 h-10"></div>
              </div>

              {/* Core block flow container showing disassembled pills */}
              <div className="flex-1 flex flex-col justify-center gap-6 overflow-y-auto no-scrollbar">
                
                <span className="text-center text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black block animate-pulse">
                  🔮 轻按各单词胶囊，极速解剖词法成分
                </span>

                <div className="flex flex-wrap gap-x-2 gap-y-3 justify-center text-center py-6">
                  {lessons
                    .find(l => l.id === activeLessonId)
                    ?.sentences
                    .find(s => s.id === deconstructSentenceId)
                    ?.syntaxBlocks.map((block, idx) => {
                      const isSelected = selectedPillIndex === idx;
                      
                      let roleBg = "bg-neutral-900 border-neutral-800 text-neutral-400";
                      let roleAccent = "shadow-none";
                      
                      if (block.role === 'subject') {
                        roleBg = isSelected ? "bg-cyan-500 text-black font-black border-cyan-400" : "bg-cyan-500/10 border-cyan-505/30 text-cyan-400";
                        roleAccent = isSelected ? "shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "";
                      } else if (block.role === 'verb') {
                        roleBg = isSelected ? "bg-rose-500 text-white font-black border-rose-400" : "bg-rose-500/10 border-rose-505/30 text-rose-400";
                        roleAccent = isSelected ? "shadow-[0_0_20px_rgba(244,63,94,0.4)]" : "";
                      } else if (block.role === 'object') {
                        roleBg = isSelected ? "bg-purple-500 text-white font-black border-purple-400" : "bg-purple-500/10 border-purple-505/30 text-purple-400";
                        roleAccent = isSelected ? "shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "";
                      } else if (block.role === 'modifier') {
                        roleBg = isSelected ? "bg-[#D4FF00] text-black font-black border-[#D4FF00]" : "bg-[#D4FF00]/10 border-lime-400/30 text-[#D4FF00]";
                        roleAccent = isSelected ? "shadow-[0_0_20px_rgba(212,255,0,0.4)]" : "";
                      }

                      return (
                        <button
                          key={block.id}
                          onClick={() => {
                            playSynthBeep('click');
                            setSelectedPillIndex(idx);
                          }}
                          className={`px-4 py-2.5 rounded-2xl border text-sm transition-all transform ${isSelected ? "scale-105 active:scale-95" : "hover:border-zinc-700 active:scale-95"} ${roleBg} ${roleAccent}`}
                        >
                          {block.token}
                        </button>
                      );
                    })}
                </div>

                {/* Sub syntactic definition description block */}
                <div className="min-h-[160px] bg-neutral-900 border border-zinc-805/50 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 filter blur-3xl pointer-events-none" />
                  
                  {selectedPillIndex !== null ? (
                    (() => {
                      const activeBlock = lessons
                        .find(l => l.id === activeLessonId)
                        ?.sentences
                        .find(s => s.id === deconstructSentenceId)
                        ?.syntaxBlocks[selectedPillIndex];
                      
                      if (!activeBlock) return null;
 
                      return (
                        <motion.div 
                          key={selectedPillIndex} 
                          className="flex flex-col h-full justify-between"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">
                                {activeBlock.role === 'subject' ? '主语 Subject' : activeBlock.role === 'verb' ? '谓语动词 Verb' : activeBlock.role === 'object' ? '宾语 Object' : '修饰成分 Modifier'} ({activeBlock.roleCn})
                              </span>
                              <h4 className="text-white text-lg font-black mt-1 leading-snug">{activeBlock.token}</h4>
                            </div>
                            
                            {(() => {
                              const isCollected = vocabularies.some(v => v.word.toLowerCase() === activeBlock.token.toLowerCase());
                              return (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    if (isCollected) {
                                      setVocabularies(prev => prev.filter(v => v.word.toLowerCase() !== activeBlock.token.toLowerCase()));
                                    } else {
                                      const now = Date.now();
                                      setVocabularies(prev => [...prev, {
                                        id: `vocab-scanned-${now}`,
                                        word: activeBlock.token,
                                        phonetic: "/.../",
                                        partOfSpeech: activeBlock.role === 'subject' ? 'n.' : activeBlock.role === 'verb' ? 'v.' : activeBlock.role === 'object' ? 'pron.' : 'adj./adv.',
                                        definition: activeBlock.explanation,
                                        definitionCn: activeBlock.explanation,
                                        example: "",
                                        color: 'yellow',
                                        createdAt: now
                                      }]);
                                      setShowRewardParticles(true);
                                      setTimeout(() => setShowRewardParticles(false), 1500);
                                    }
                                  }}
                                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 active:scale-90 transition-all text-[10px] font-bold ${
                                    isCollected 
                                      ? "bg-[#D4FF00]/10 text-[#D4FF00] border-[#D4FF00]/30" 
                                      : "bg-zinc-855/60 hover:bg-zinc-800 text-zinc-400 border-white/5"
                                  }`}
                                  title={isCollected ? "点击取消收藏此词组" : "点击加入生词瀑布流收藏"}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isCollected ? "fill-[#D4FF00]" : ""}`} />
                                  <span>{isCollected ? "已收藏" : "收藏词组"}</span>
                                </button>
                              );
                            })()}
                          </div>
                          <p className="text-neutral-400 text-xs leading-relaxed font-semibold mt-2.5">{activeBlock.explanation}</p>
                          <div className="flex gap-2.5 mt-4">
                            <span className="text-[9px] font-mono text-[#D4FF00] bg-[#D4FF00]/15 px-2 py-0.5 rounded uppercase">智能句法校验器</span>
                          </div>
                        </motion.div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-6 flex flex-col items-center justify-center my-auto">
                      <Cpu className="w-10 h-10 text-neutral-600 mb-2 animate-pulse" />
                      <span className="text-xs text-neutral-500 font-mono">在上方点击任意句法单词，即刻开启 X 光电光解构。</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Action buttons */}
              <div className="mt-8">
                <button 
                  onClick={() => { playSynthBeep('click'); setDeconstructSentenceId(null); setSelectedPillIndex(null); }}
                  className="w-full py-4.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs font-black tracking-widest uppercase text-white hover:text-[#D4FF00] active:scale-95 transition-transform"
                >
                  关闭并返回频道原声音流
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* L3 OVERLAY COMPONENT: Anti-Rabbit Hole Dictionary Bottom Sheet HUD Sheet */}
        <AnimatePresence>
          {dictSearchWord && (
            <motion.div 
              className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 z-0" onClick={closeDictionary舱} />
              
              {/* Glass container sheet */}
              <motion.div 
                className={`w-full max-h-[82%] bg-[#0A0A0C] border-t border-white/10 rounded-t-[3rem] z-10 flex flex-col pb-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative ${isRabbitHoleAlarm ? "border-t-rose-500" : ""}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
              >
                
                {/* Visual Breadcrumb defense markers */}
                <div className="w-full flex justify-between items-center px-8 pt-6 pb-2 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-neutral-500 font-black">Level {definitionStack.length} Index</span>
                  </div>
                  
                  {/* Nest breadcrumbs indicators */}
                  <div className="flex gap-1.5">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-5 h-1 rounded transition-colors ${idx < definitionStack.length ? "bg-[#D4FF00]" : "bg-neutral-800"}`}
                        title={`Rabbit Depth ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-5 no-scrollbar flex flex-col">
                  
                  {isSearchingWordOnline ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                      <RefreshCcw className="w-8 h-8 text-[#D4FF00] animate-spin mb-3" />
                      <span className="text-xs text-neutral-400 font-mono animate-pulse">Consulting Neural Dictionary...</span>
                    </div>
                  ) : isRabbitHoleAlarm ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 relative">
                      {/* Heavy red flash layout frame warning indicator */}
                      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-6 animate-pulse">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      
                      <h4 className="text-rose-500 font-mono text-lg font-black uppercase tracking-wider mb-2">DEPTH LIMIT ACHIEVED</h4>
                      <div className="bg-zinc-950 p-4 rounded-xl border border-rose-950 max-w-xs mb-8">
                        <p className="text-zinc-500 text-xs font-mono">
                          DEPTH LIMIT REACHED. RETURN TO SOURCE.
                          <br />
                          防迷路保护机制已触发：无限查询释义单词已达最大深度(3层)，以阻止用户脑回路无限发散偏离主句！
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 w-full">
                        <button 
                          onClick={popRabbitHoleStep}
                          className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                          <X className="w-4 h-4" /> Return one step back
                        </button>
                        <button 
                          onClick={closeDictionary舱}
                          className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 py-3.5 rounded-2xl font-bold text-xs"
                        >
                          Reset & Close Panel
                        </button>
                      </div>
                    </div>
                  ) : (
                    (() => {
                      const currentDef = definitionStack[definitionStack.length - 1];
                      if (!currentDef) return null;

                      return (
                        <motion.div 
                          key={definitionStack.length}
                          className="flex flex-col flex-1"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          {/* Breadcrumbs string history */}
                          {definitionStack.length > 1 && (
                            <div className="flex flex-wrap gap-1 items-center mb-4 bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5 text-[9px] font-mono text-zinc-500">
                              <button onClick={popRabbitHoleStep} className="hover:text-white flex items-center gap-0.5">
                                <CornerDownRight className="w-2.5 h-2.5" /> step back
                              </button>
                              <span>•</span>
                              {definitionStack.map((step, sIdx) => (
                                <React.Fragment key={sIdx}>
                                  <span className={sIdx === definitionStack.length - 1 ? "text-[#D4FF00]" : ""}>{step.word}</span>
                                  {sIdx < definitionStack.length - 1 && <span>&gt;</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between items-start mt-2">
                            <div>
                              <h3 className="text-4xl font-black text-white tracking-tight leading-none mb-2">{currentDef.word}</h3>
                              <div className="flex items-center gap-2.5 mt-1">
                                <span className="text-neutral-500 font-mono text-xs">{currentDef.phonetic}</span>
                                <button 
                                  onClick={() => speakTextEn(currentDef.word)}
                                  className="text-[#D4FF00] hover:text-[#cbf500] active:scale-90"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Known Core Hard rating tag circle inputs */}
                            <div className="flex gap-2">
                              <button 
                                onClick={() => updateWordColorTag(currentDef.word, 'green')}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${vocabularies.find(v => v.word === currentDef.word)?.color === 'green' ? "bg-emerald-500 border-emerald-400 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "border-emerald-500/20 bg-neutral-900 text-emerald-400"}`}
                                title="Known"
                              >
                                <span>K</span>
                              </button>
                              <button 
                                onClick={() => updateWordColorTag(currentDef.word, 'yellow')}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${vocabularies.find(v => v.word === currentDef.word)?.color === 'yellow' ? "bg-lime-400 border-lime-400 text-black font-bold shadow-[0_0_10px_rgba(212,255,0,0.3)]" : "border-lime-400/20 bg-neutral-900 text-[#D4FF00]"}`}
                                title="Core"
                              >
                                <span>C</span>
                              </button>
                              <button 
                                onClick={() => updateWordColorTag(currentDef.word, 'red')}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${vocabularies.find(v => v.word === currentDef.word)?.color === 'red' ? "bg-rose-500 border-rose-400 text-black font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]" : "border-rose-500/20 bg-neutral-900 text-rose-400"}`}
                                title="Hard"
                              >
                                <span>H</span>
                              </button>
                            </div>
                          </div>

                          <div className="w-full h-px bg-white/5 my-5" />

                          {/* Grammar Class detail explanations */}
                          <div className="flex-1">
                            <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest mb-1 pl-0.5">English Meaning & Chinese Translation</div>
                            <div className="space-y-4">
                              <div>
                                <span className="font-mono text-xs font-bold text-neutral-400 block mb-1">[{currentDef.partOfSpeech}]</span>
                                <p className="text-white text-base font-bold leading-relaxed tracking-tight">
                                  {/* Split the english definitions to hook lookup trigger anchors for nest searches */}
                                  {currentDef.definition.split(" ").map((engW, eIdx) => {
                                    const cleanW = engW.toLowerCase().replace(/[^a-z]/g, "");
                                    return (
                                      <span 
                                        key={eIdx}
                                        onClick={() => initiateWordLookup(cleanW)}
                                        className="inline-block hover:text-[#D4FF00] hover:underline cursor-pointer border-b border-transparent hover:border-lime-400 mr-1"
                                      >
                                        {engW}
                                      </span>
                                    );
                                  })}
                                </p>
                              </div>

                              <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                                <span className="block text-[9px] font-mono text-[#D4FF00] uppercase font-black mb-1">Chinese Equivalent</span>
                                <p className="text-[#888] text-sm font-bold">{currentDef.definitionCn}</p>
                              </div>

                              {currentDef.example && (
                                <div className="bg-zinc-950 p-4 rounded-2xl border-l-[3px] border-lime-400">
                                  <span className="block text-[8px] font-mono text-neutral-500 uppercase tracking-wider mb-1.5">Context Usage Spec</span>
                                  <p className="text-gray-300 text-xs italic font-medium leading-relaxed">"{currentDef.example}"</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer and dynamic Dopamine save trigger */}
                          <div className="flex gap-4 mt-8 pt-4">
                            <button 
                              onClick={closeDictionary舱}
                              className="w-16 h-16 rounded-[1.5rem] bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white active:scale-95 shrink-0"
                            >
                              <X className="w-6 h-6" />
                            </button>
                            {(() => {
                              const isSaved = vocabularies.some(v => v.word.toLowerCase() === currentDef.word.toLowerCase());
                              return (
                                <button 
                                  onClick={() => {
                                    if (isSaved) {
                                      // Toggle or do nothing beautifully
                                      playSynthBeep('click');
                                      setVocabularies(prev => prev.filter(v => v.word.toLowerCase() !== currentDef.word.toLowerCase()));
                                    } else {
                                      saveWordToNexus(currentDef.word);
                                    }
                                  }}
                                  className={`flex-1 rounded-[1.5rem] font-black text-base flex justify-center items-center gap-2 active:scale-95 shadow-xl select-none transition-all ${isSaved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white text-black hover:bg-neutral-100"}`}
                                >
                                  {isSaved ? (
                                    <>
                                      <Check className="w-5 h-5 text-emerald-400" /> 已收藏
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="w-5 h-5 fill-black" /> 收藏生词
                                    </>
                                  )}
                                </button>
                              );
                            })()}
                          </div>
                        </motion.div>
                      );
                    })()
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show All Lessons Modal */}
        <AnimatePresence>
          {showAllLessonsModal && (
            <motion.div 
              className="absolute inset-0 bg-[#0a0a0c] z-[60] flex flex-col"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">Library Channels Archive</span>
                  <h3 className="text-xl font-black text-white">我的语感岛</h3>
                </div>
                {/* Click down button to collapse */}
                <button 
                  onClick={() => { playSynthBeep('click'); setShowAllLessonsModal(false); }}
                  className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition-all"
                  title="收起"
                >
                  <ChevronDown className="w-5 h-5 text-[#D4FF00]" />
                </button>
              </div>

              {/* Search and Classification Filters Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-zinc-950/40 space-y-3.5">
                {/* Fuzzy Search */}
                <div className="relative font-sans">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    value={lessonsSearchQuery}
                    onChange={(e) => setLessonsSearchQuery(e.target.value)}
                    placeholder="输入关键词模糊检索资源名称..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4FF00] font-medium"
                  />
                  {lessonsSearchQuery && (
                    <button 
                      onClick={() => setLessonsSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sources Classification Filter */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
                  {(['all', 'bilibili', 'youtube', 'podcast', 'other'] as const).map((cat) => {
                    const label = cat === 'all' ? '全部' : cat === 'bilibili' ? 'B 站' : cat === 'youtube' ? 'YouTube' : cat === 'podcast' ? '博客' : '其他';
                    const isActive = lessonsFilterCategory === cat;
                    return (
                      <button 
                        key={cat}
                        onClick={() => { playSynthBeep('click'); setLessonsFilterCategory(cat); }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${isActive ? "bg-[#D4FF00] text-black shadow-lg" : "bg-neutral-900 text-zinc-400 hover:text-white border border-neutral-800/60"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtered list section */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-24">
                {(() => {
                  const filtered = lessons.filter(lesson => {
                    const matchesSearch = lesson.title.toLowerCase().includes(lessonsSearchQuery.toLowerCase());
                    let matchesCat = lessonsFilterCategory === 'all';
                    if (lessonsFilterCategory === 'bilibili') {
                      matchesCat = !!lesson.bilibiliId;
                    } else if (lessonsFilterCategory === 'youtube') {
                      matchesCat = !!lesson.youtubeId;
                    } else if (lessonsFilterCategory === 'podcast') {
                      matchesCat = lesson.contentType === 'pod' || lesson.contentType === 'audio';
                    } else if (lessonsFilterCategory === 'other') {
                      matchesCat = !lesson.bilibiliId && !lesson.youtubeId && lesson.contentType !== 'pod' && lesson.contentType !== 'audio';
                    }
                    return matchesSearch && matchesCat;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-16 text-center select-none border border-dashed border-white/5 rounded-3xl bg-zinc-950/20">
                        <Inbox className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <p className="text-zinc-500 text-xs font-mono">未检索到匹配的频道资源</p>
                      </div>
                    );
                  }

                  return filtered.map(lesson => {
                    let startX = 0;
                    const isSwiped = swipedLessonId === lesson.id;
                    return (
                      <div key={lesson.id} className="relative w-full overflow-hidden rounded-2xl bg-[#111113]/30">
                        {/* Swipe Underlay Action Layer */}
                        <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1.5 bg-zinc-950 px-2.5 z-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSwipedLessonId(null);
                              setActiveActionsLessonId(lesson.id);
                              setShowShareModal('doc');
                              playSynthBeep('success');
                            }}
                            className="h-[88%] px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-xl flex flex-col justify-center items-center gap-1 min-w-[56px] transition-all border border-emerald-500/15"
                          >
                            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>分享</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSwipedLessonId(null);
                              deleteLesson(lesson.id, e);
                            }}
                            className="h-[88%] px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-[10px] rounded-xl flex flex-col justify-center items-center gap-1 min-w-[56px] transition-all border border-rose-500/15"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>删除</span>
                          </button>
                        </div>

                        {/* Foreground Lesson Card */}
                        <div 
                          onClick={() => {
                            if (isSwiped) {
                              setSwipedLessonId(null);
                            } else {
                              playSynthBeep('click');
                              selectActiveLesson(lesson.id);
                              setShowAllLessonsModal(false);
                            }
                          }}
                          onTouchStart={(e) => {
                            startX = e.touches[0].clientX;
                          }}
                          onTouchEnd={(e) => {
                            const deltaX = startX - e.changedTouches[0].clientX;
                            if (deltaX > 45) {
                              setSwipedLessonId(lesson.id);
                              playSynthBeep('click');
                            } else if (deltaX < -45) {
                              if (swipedLessonId === lesson.id) {
                                setSwipedLessonId(null);
                                playSynthBeep('click');
                              }
                            }
                          }}
                          onMouseDown={(e) => {
                            startX = e.clientX;
                          }}
                          onMouseUp={(e) => {
                            const deltaX = startX - e.clientX;
                            if (deltaX > 45) {
                              setSwipedLessonId(lesson.id);
                              playSynthBeep('click');
                            } else if (deltaX < -45) {
                              if (swipedLessonId === lesson.id) {
                                setSwipedLessonId(null);
                                playSynthBeep('click');
                              }
                            }
                          }}
                          className={`bg-[#111113]/90 border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-zinc-700 relative z-10 transition-transform duration-300 ${isSwiped ? "-translate-x-[136px]" : "translate-x-0"}`}
                        >
                          <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                            <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-white shrink-0 relative overflow-hidden">
                              <img src={lesson.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                              <div className="relative z-10 text-lime-400">
                                {lesson.contentType === "video" ? <Play className="w-4 h-4 fill-current" /> : lesson.contentType === "epub" ? <BookOpen className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
                              </div>
                            </div>
                            <div className="overflow-hidden flex-1 pr-2">
                              <span className="text-white text-sm font-bold block truncate max-w-[180px]">{lesson.title}</span>
                              <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500 mt-1 uppercase">
                                <span>{lesson.contentType}</span>
                                <span>•</span>
                                <span>{lesson.durationOrPages}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono font-bold text-neutral-400 bg-white/5 px-2 py-1 rounded">
                              {lesson.progress}%
                            </span>
                            <span className="text-zinc-650 text-[10px] font-mono select-none">左滑 ➜</span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WeChat Share Bottom Action Drawer */}
        <AnimatePresence>
          {activeActionsLessonId && (
            <>
              {/* Back backdrop filter mask */}
              <motion.div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveActionsLessonId(null)}
              />
              
              {/* Sliding Bottom Actions Cabinet Sheet */}
              <motion.div 
                className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0d0d0f]/95 border-t border-white/10 rounded-t-[2.5rem] z-[100] p-6 shadow-2xl font-sans"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
              >
                {/* Visual drag hint bar */}
                <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mb-5" />
                
                <div className="mb-5">
                  <span className="text-[9px] font-mono text-[#D4FF00] tracking-widest block uppercase font-black">WeChat Share & Organize</span>
                  <h4 className="text-white text-md font-black tracking-tight truncate mt-0.5">
                    {lessons.find(l => l.id === activeActionsLessonId)?.title}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      playSynthBeep('click');
                      setShowShareModal('doc');
                    }}
                    className="w-full py-4 px-4 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-between text-left hover:bg-neutral-850 active:scale-98 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-white text-xs font-black block">微信高光思维文档分享 (Syllabus Poster)</span>
                        <span className="text-zinc-500 text-[9px] font-medium block mt-0.5">带智能物归原位以及破译 Logo 的高清结构化单词句子思维库图</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-655" />
                  </button>

                  <button 
                    onClick={(e) => {
                      playSynthBeep('block');
                      deleteLesson(activeActionsLessonId, e);
                      setActiveActionsLessonId(null);
                    }}
                    className="w-full py-4 px-4 bg-rose-500/5 hover:bg-rose-550/15 border border-rose-500/15 rounded-2xl flex items-center justify-between text-left active:scale-98 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-rose-400 text-xs font-black block">从语感岛彻底废弃此块 (Delete Block)</span>
                        <span className="text-rose-500/50 text-[9px] font-medium block mt-0.5">永久删除此课程/电子书高光以及所有转录词包</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-800" />
                  </button>
                </div>

                <button 
                  onClick={() => setActiveActionsLessonId(null)}
                  className="w-full mt-6 py-3.5 bg-zinc-950 hover:bg-neutral-900 rounded-xl text-neutral-400 hover:text-white text-xs font-bold border border-white/5"
                >
                  取消
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* WeChat Shares Modal Poster Overlays */}
        <AnimatePresence>
          {showShareModal && activeActionsLessonId && (
            <motion.div 
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-5 overflow-y-auto no-scrollbar font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute top-4 right-4 z-50">
                <button 
                  onClick={() => { playSynthBeep('click'); setShowShareModal(null); }}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Poster frame */}
              <div className="w-full max-w-sm bg-[#09090b] border border-[#D4FF00]/20 rounded-[2.5rem] p-6 shadow-[0_0_40px_rgba(212,255,0,0.1)] relative overflow-hidden flex flex-col justify-between my-auto">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-[#D4FF00] to-cyan-500" />
                
                {showShareModal === 'speak' ? (
                  /* Speak Challenge Poster */
                  <div>
                    {/* Header Logo & traceback branding */}
                    <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#D4FF00] text-black flex items-center justify-center text-[10px] font-black">L</div>
                        <span className="text-white text-xs font-black tracking-tight">Lingua 语感岛®</span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-black tracking-wider uppercase">Moments Challenge</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold leading-none">源于精读频道</span>
                      <h4 className="text-white text-base font-black truncate leading-tight mt-1">
                        {lessons.find(l => l.id === activeActionsLessonId)?.title}
                      </h4>
                      <p className="text-neutral-500 text-[10px] mt-1">微信扫码或长按卡片在小程序中进行语感发音破译打分挑战</p>
                    </div>

                    {/* 3 Select speech sentences challenger lists */}
                    <div className="space-y-3 my-4 bg-zinc-950 p-4 rounded-3xl border border-white/5">
                      <span className="text-[8px] text-[#D4FF00] font-mono uppercase tracking-widest font-black block mb-1">🔥 黄金片段跟读推荐 (Top 3 Sentences)</span>
                      
                      {(() => {
                        const lessonObj = lessons.find(l => l.id === activeActionsLessonId);
                        const topSentences = lessonObj?.sentences.slice(0, 3) || [];
                        if (topSentences.length === 0) {
                          return <div className="text-zinc-600 text-xs py-2">无句法数据</div>;
                        }
                        return topSentences.map((s, idx) => (
                          <div key={s.id} className="p-2.5 rounded-xl bg-neutral-900 border border-white/5 relative overflow-hidden group">
                            <span className="absolute right-2 top-2 text-[9px] font-mono text-zinc-600 font-black">SQ-{idx+1}</span>
                            <p className="text-white text-xs font-medium leading-relaxed pr-8 font-sans">"{s.text}"</p>
                            
                            <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                              <span className="text-zinc-500 text-[8.5px] leading-none truncate max-w-[150px]">{s.translation}</span>
                              <div className="flex gap-1.5 shrink-0">
                                <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-black">打分 98pts</span>
                                <Mic className="w-3 h-3 text-[#D4FF00]" />
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* QR Code and platform trace back footer */}
                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/5 pt-4 bg-[#111113]/40 p-4 rounded-3xl">
                      <div className="overflow-hidden">
                        <span className="text-white text-[11px] font-black block">Lingua 语感破译分析</span>
                        <span className="text-zinc-500 text-[8.5px] block leading-relaxed mt-1">
                          此片段已由微信用户分享。跟读完成后由高级 TTS 核心打分，自动记录于该用户的 **“语感瀑布流”** 中持续迭代。
                        </span>
                      </div>
                      
                      {/* Fake polished vector QR Code illustration */}
                      <div className="w-16 h-16 shrink-0 rounded-xl bg-white p-1 flex flex-col justify-between items-center relative overflow-hidden shadow-lg select-none">
                        <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-90">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`rounded-sm ${
                                (i % 3 === 0 || i === 0 || i === 15 || i === 5 || i === 10) 
                                ? "bg-black" : "bg-neutral-100"
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="absolute bottom-1 bg-[#D4FF00] text-black text-[6.5px] px-1 font-mono uppercase font-black tracking-tighter leading-none rounded">LINGUA</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Documents Share Poster */
                  <div>
                    {/* Header Logo & traceback branding */}
                    <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-cyan-400 text-black flex items-center justify-center text-[10px] font-black font-sans">島</div>
                        <span className="text-white text-xs font-black tracking-tight">Lingua 语感岛®</span>
                      </div>
                      <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-black tracking-wider uppercase">Neural Syllabus</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold leading-none">结构化文档知识库</span>
                      <h4 className="text-white text-base font-black truncate leading-tight mt-1">
                        {lessons.find(l => l.id === activeActionsLessonId)?.title}
                      </h4>
                      <p className="text-cyan-400/80 text-[10px] mt-1 font-mono uppercase">已破译 24 个生词 • 3 组句型思维结构</p>
                    </div>

                    {/* Brief document vocabulary teaser breakdown lists */}
                    <div className="my-4 bg-zinc-950 p-4 rounded-3xl border border-white/5 space-y-3">
                      <span className="text-[8px] text-cyan-400 font-mono uppercase tracking-widest font-black block mb-1">📁 生词与破译卡 (Knowledge Base Teaser)</span>
                      
                      <div className="space-y-2">
                        {vocabularies.slice(0, 3).map((vocab, vIdx) => (
                          <div key={vIdx} className="flex justify-between items-center p-2 rounded-xl bg-neutral-900 border border-white/5">
                            <div className="overflow-hidden">
                              <span className="text-[#D4FF00] text-[11px] font-mono font-black block">{vocab.word}</span>
                              <span className="text-zinc-500 text-[9px] block leading-none truncate max-w-[180px] mt-1">{vocab.exampleCn || "上下文高光释义"}</span>
                            </div>
                            <span className="text-white text-[10px] font-bold bg-white/5 px-2.5 py-1 rounded shrink-0">
                              {vocab.definitionCn}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* QR Code and platform trace back footer */}
                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/5 pt-4 bg-[#111113]/40 p-4 rounded-3xl">
                      <div className="overflow-hidden">
                        <span className="text-white text-[11px] font-black block">专属高光文档归档</span>
                        <span className="text-zinc-500 text-[8.5px] block leading-relaxed mt-1">
                          扫码同步此定制电子书/流媒体转录所得的生词瀑布、发音解构。新用户扫码自动解锁 **7 天高级禅庭订阅**。
                        </span>
                      </div>
                      
                      {/* Fake polished vector QR Code illustration */}
                      <div className="w-16 h-16 shrink-0 rounded-xl bg-white p-1 flex flex-col justify-between items-center relative overflow-hidden shadow-lg select-none">
                        <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-90">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`rounded-sm ${
                                (i % 3 === 0 || i === 0 || i === 15 || i === 5 || i === 10) 
                                ? "bg-black" : "bg-neutral-100"
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="absolute bottom-1 bg-[#D4FF00] text-black text-[6.5px] px-1 font-mono uppercase font-black tracking-tighter leading-none rounded">LINGUA</span>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => { playSynthBeep('click'); setShowShareModal(null); }}
                  className="w-full mt-6 py-3.5 bg-[#D4FF00] hover:bg-[#b0d400] text-black rounded-2xl text-xs font-black transition-all"
                >
                  保存并推送到微信
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unified "复习闪卡" Workspace Modal */}
        <AnimatePresence>
          {showFlashcardSpace && (
            <motion.div 
              className="fixed inset-0 bg-[#070709] z-[120] flex flex-col justify-between p-5 font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,255,0,0.06),transparent)] pointer-events-none" />
              
              {/* Header block with close and progress */}
              <div className="relative z-10 flex justify-between items-center py-2.5 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] animate-pulse shadow-[0_0_8px_#D4FF00]" />
                  <div>
                    <h3 className="text-sm font-black text-white tracking-widest uppercase font-mono">复习闪卡 SPACED STUDY</h3>
                    <span className="text-[9px] text-zinc-500 font-mono tracking-widest block font-black uppercase mt-0.5">
                      PROGRESS: {getReviewQueue().length ? Math.min(currentFlashcardIndex, getReviewQueue().length) : 0} / {getReviewQueue().length}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => { playSynthBeep('click'); setShowFlashcardSpace(false); }}
                  className="w-9 h-9 rounded-full bg-[#111113] border border-white/5 hover:border-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Central Main Interactive Area */}
              <div className="flex-1 flex flex-col justify-center py-6">
                {(() => {
                  const deck = getReviewQueue();
                  const isFinished = currentFlashcardIndex >= deck.length;
                  
                  if (isFinished) {
                    return (
                      <motion.div 
                        className="w-full max-w-sm mx-auto bg-[#111113]/50 border border-emerald-500/20 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden flex flex-col items-center gap-5 justify-center py-12"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 filter blur-3xl rounded-full" />
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-2">
                          <span className="text-3xl font-bold">🎉</span>
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-black mb-1">今日复习目标达成！</h4>
                          <p className="text-zinc-500 text-xs">您已完美标注了今日所有的闪卡记忆节点，语感网格再次得到了强化。</p>
                        </div>
                        
                        <div className="w-full space-y-2 mt-4">
                          <button 
                            onClick={() => {
                              playSynthBeep('success');
                              setCurrentFlashcardIndex(0);
                            }}
                            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-2xl text-xs font-black text-white hover:text-[#D4FF00] transition-colors"
                          >
                            🔄 重新开始本轮复习
                          </button>
                          <button 
                            onClick={() => {
                              playSynthBeep('click');
                              setShowFlashcardSpace(false);
                            }}
                            className="w-full py-3.5 bg-[#D4FF00] hover:bg-[#cbf500] text-black rounded-2xl text-xs font-black transition-transform active:scale-95"
                          >
                            退出闪卡空间 Close
                          </button>
                        </div>
                      </motion.div>
                    );
                  }

                  const item = deck[currentFlashcardIndex];
                  return (
                    <motion.div 
                      className="w-full max-w-sm mx-auto flex flex-col gap-6"
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Active Flashcard Block */}
                      <div 
                        onClick={() => {
                          if (!isCardRevealed) {
                            playSynthBeep('click');
                            setIsCardRevealed(true);
                          }
                        }}
                        className={`w-full bg-[#111113] border transition-all cursor-pointer rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-h-[300px] flex flex-col justify-between relative overflow-hidden ${isCardRevealed ? "border-zinc-700" : "border-[#D4FF00]/40 bg-zinc-950 hover:border-[#D4FF00]/70"}`}
                      >
                        {/* Pulse glow background if not revealed */}
                        {!isCardRevealed && (
                          <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4FF00]/5 filter blur-3xl rounded-full" />
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono font-bold text-[#D4FF00] tracking-widest uppercase bg-[#D4FF00]/10 px-2.5 py-0.5 rounded">
                            {item.type === 'word' ? `生词 • ${item.partOfSpeech || 'VOCAB'}` : '高光金句 • SENTENCE'}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              playSynthBeep('click');
                              speakTextEn(item.type === 'word' ? item.word! : item.text!);
                            }}
                            className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-300 hover:text-[#D4FF00] active:scale-90"
                            title="原声朗读 Speak"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Text Center focus */}
                        <div className="my-auto py-4 flex flex-col items-center">
                          {item.type === 'word' ? (
                            <div className="space-y-1">
                              <h2 className="text-white text-3xl font-black font-sans tracking-tight leading-none text-center select-text">
                                {item.word}
                              </h2>
                              {isCardRevealed && (
                                <p className="text-neutral-500 font-mono text-center text-xs mt-1">
                                  [{item.phonetic}]
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-white text-[15px] font-bold leading-relaxed text-center font-sans select-text px-2">
                              "{item.text}"
                            </p>
                          )}
                        </div>

                        {/* Translation revelation zone */}
                        <div className="border-t border-white/5 pt-4">
                          {isCardRevealed ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center space-y-3"
                            >
                              <p className="text-white text-sm font-black font-mono leading-relaxed bg-[#D4FF00]/5 py-2 px-4 rounded-xl border border-[#D4FF00]/25">
                                {item.type === 'word' ? item.definitionCn : item.translationCn}
                              </p>
                              {item.type === 'word' && item.example && (
                                <p className="text-zinc-500 text-[10.5px] italic text-left leading-normal bg-black/40 p-2.5 rounded-lg border border-white/[0.02]">
                                  "{item.example}"
                                </p>
                              )}
                            </motion.div>
                          ) : (
                            <div className="flex flex-col items-center py-2">
                              <span className="text-[10px] font-bold text-[#D4FF00] tracking-widest uppercase flex items-center gap-1 opacity-70 animate-pulse">
                                👆 点击卡片翻面显现释义 REVEAL CARD
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Memory Situation Marking buttons at lower card */}
                      <div className="space-y-3">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-black block text-center">
                          请诚实标注卡片的记忆状况 MARK MEMORY STATE
                        </span>
                        
                        <div className="grid grid-cols-3 gap-2.5">
                          <button 
                            onClick={() => handleRecallStatus('forget')}
                            className="bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all text-red-400 border border-red-500/30 font-black text-xs py-3 rounded-2xl flex flex-col items-center justify-center gap-1"
                          >
                            <span className="text-lg">🔴</span>
                            <span>未掌握/忘记</span>
                          </button>
                          
                          <button 
                            onClick={() => handleRecallStatus('vague')}
                            className="bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 transition-all text-amber-400 border border-amber-500/30 font-black text-xs py-3 rounded-2xl flex flex-col items-center justify-center gap-1"
                          >
                            <span className="text-lg">🟡</span>
                            <span>记不清/模糊</span>
                          </button>

                          <button 
                            onClick={() => handleRecallStatus('remember')}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 transition-all text-emerald-400 border border-emerald-500/30 font-black text-xs py-3 rounded-2xl flex flex-col items-center justify-center gap-1"
                          >
                            <span className="text-lg">🟢</span>
                            <span>已掌握/牢记</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Progress track timeline progress bar at modal bottom footer */}
              <div className="relative pt-4 border-t border-white/5">
                {(() => {
                  const deck = getReviewQueue();
                  const pct = deck.length ? (Math.min(currentFlashcardIndex, deck.length) / deck.length) * 100 : 0;
                  return (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black shrink-0">
                        IMMERSION LOOP ACTIVE
                      </span>
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#D4FF00] rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#D4FF00] font-black shrink-0">
                        {Math.round(pct)}%
                      </span>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WeChat Login Modal */}
        <AnimatePresence>
          {showLoginModal && (
            <motion.div 
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="w-full max-w-sm bg-[#0c0c0e]/95 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden font-sans"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 filter blur-3xl rounded-full" />
                
                {/* WeChat brand Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                    <MessageCircle className="w-5.5 h-5.5 text-emerald-400 fill-emerald-400/20" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight">微信一键授权登录</h3>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-black mt-0.5">WECHAT SECURE AUTHENTICATION</span>
                  </div>
                </div>

                {/* Secure sync user prompt warning */}
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3.5 mb-5 text-[11px] text-emerald-300 leading-relaxed flex gap-2.5 items-start">
                  <span className="text-base shrink-0 select-none">🐾</span>
                  <p>
                    {loginRequiredReason || "为了保证您的专属听写本、音视频导入历史及学习生词库在多端可以长期安全地云端存储不丢失，请完成极速授权。"}
                  </p>
                </div>

                {/* Mock WeChat OAuth visual sheet */}
                <div className="space-y-4">
                  <div className="bg-zinc-950 p-4 border border-white/5 rounded-2xl">
                    <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest font-black block mb-3">申请获取以下公开权限</span>
                    <span className="text-xs text-zinc-300 font-extrabold block mb-4">获得您的公开信息（昵称、头像、地区及性别）</span>
                    
                    {/* User profile check item */}
                    <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-emerald-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                          alt="Avatar" 
                          className="w-11 h-11 rounded-full border border-white/10 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <input 
                            type="text"
                            value={wechatNickname}
                            onChange={(e) => setWechatNickname(e.target.value.slice(0, 15))}
                            placeholder="自定义微信昵称..."
                            className="bg-transparent border-b border-zinc-700 focus:border-emerald-400 text-xs text-white font-black py-0.5 focus:outline-none w-full"
                          />
                          <span className="text-[9px] text-zinc-500 block mt-1">支持编辑个人微信公开昵称</span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-xs shrink-0 select-none">
                        ✓
                      </div>
                    </div>
                  </div>

                  {/* Optional phone binding section */}
                  <div className="bg-zinc-950/60 p-4 border border-white/5 rounded-2xl space-y-3.5">
                    <label className="flex items-center gap-2 cursor-pointer py-1 select-none">
                      <input 
                        type="checkbox"
                        checked={bindPhoneChecked}
                        onChange={(e) => {
                          playSynthBeep('click');
                          setBindPhoneChecked(e.target.checked);
                        }}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-neutral-900 border-neutral-800"
                      />
                      <span className="text-xs text-zinc-400 font-extrabold">绑定手机号 (选填，开通多端验证同步后备)</span>
                    </label>

                    {bindPhoneChecked && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden pt-1 border-t border-white/5"
                      >
                        {/* Phone input */}
                        <div>
                          <input 
                            type="tel"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                            placeholder="请输入 11 位大陆手机号"
                            className="w-full bg-zinc-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono font-bold"
                          />
                        </div>

                        {/* Verification code input */}
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={loginCode}
                            onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="6 位短信验证码"
                            className="flex-1 bg-zinc-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono font-bold"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              if (loginPhone.length < 11) {
                                playSynthBeep('block');
                                setApiErrorMessage("请输入完整的 11 位手机号码");
                                return;
                              }
                              playSynthBeep('click');
                              setIsCodeSent(true);
                              setCodeCountdown(60);
                            }}
                            disabled={codeCountdown > 0 || loginPhone.length < 11}
                            className="px-3 py-2.5 rounded-xl text-[10px] font-bold bg-[#D4FF00] text-black hover:bg-[#cbf500] disabled:bg-neutral-900 disabled:text-zinc-500 disabled:border disabled:border-neutral-800 transition-colors shrink-0 font-sans"
                          >
                            {codeCountdown > 0 ? `${codeCountdown}s` : "获取验证码"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Auth decision buttons */}
                  <div className="flex gap-3 pt-3">
                    <button 
                      onClick={() => { playSynthBeep('click'); setShowLoginModal(false); }}
                      className="flex-1 bg-neutral-950 text-zinc-400 hover:text-white border border-neutral-850 py-3.5 rounded-2xl text-xs font-black transition-colors"
                    >
                      拒绝
                    </button>
                    <button 
                      onClick={() => {
                        if (bindPhoneChecked) {
                          if (loginPhone.length < 11) {
                            playSynthBeep('block');
                            setApiErrorMessage("请填写正确的 11 位手机号码以进行关联绑定。");
                            return;
                          }
                          if (loginCode.length < 4) {
                            playSynthBeep('block');
                            setApiErrorMessage("请输入手机收到的短信验证码。");
                            return;
                          }
                          localStorage.setItem("lingua_user_phone", loginPhone);
                        }
                        
                        playSynthBeep('success');
                        setIsWechatBound(true);
                        localStorage.setItem("lingua_wechat_bound", "true");
                        localStorage.setItem("lingua_wechat_nickname", wechatNickname);
                        setShowLoginModal(false);
                        setShowRewardParticles(true);
                        setTimeout(() => setShowRewardParticles(false), 2000);
                      }}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 rounded-2xl text-xs flex justify-center items-center gap-1.5 active:scale-95 transition-transform shadow-lg shadow-emerald-950/40"
                    >
                      <span>允许授权登录</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIP Member Subscription Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div 
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="w-full max-w-sm bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
              >
                {/* Visual header background decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/5 filter blur-[24px] rounded-full" />
                <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-purple-500/5 filter blur-[30px] rounded-full" />

                <div className="flex justify-between items-start mb-6 font-sans">
                  <div>
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-black block">PRO EXPERIENCE</span>
                    <h3 className="text-2xl font-black text-white flex items-center gap-1.5 tracking-tight mt-0.5">
                      <Zap className="w-5 h-5 fill-amber-400 text-amber-400" /> CYBER VIP 会员
                    </h3>
                  </div>
                  <button 
                    onClick={() => { playSynthBeep('click'); setShowPaymentModal(false); setPaymentStep('select'); }}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {paymentStep === 'select' && (
                  <div className="space-y-5 font-sans">
                    {/* Feature check list */}
                    <div className="space-y-2.5 bg-zinc-950 p-4 rounded-2xl border border-white/5 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>解锁全部 AI 句法精准精细拆解</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>无限次音流端到端翻译及精听缓存</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>ADHD 无延迟多感官声波共振模式</span>
                      </div>
                    </div>

                    {/* Choose plan */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block pl-0.5">选择会员订阅方案</span>
                      
                      {/* Weekly Tier */}
                      <button 
                        onClick={() => { playSynthBeep('click'); setSelectedPaymentTier('weekly'); }}
                        className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between transition-all ${selectedPaymentTier === 'weekly' ? "bg-amber-400/10 border-amber-400" : "bg-[#111113] border-white/5 text-zinc-400 hover:border-zinc-800"}`}
                      >
                        <div>
                          <span className={`text-[8px] font-mono font-black uppercase block ${selectedPaymentTier === 'weekly' ? "text-amber-400" : "text-zinc-500"}`}>Weekly Access</span>
                          <span className="text-white text-xs font-black block mt-0.5">周卡特权</span>
                        </div>
                        <span className="text-white font-mono text-sm font-black">¥7.00 <span className="text-[9px] font-sans font-normal text-zinc-500">/ 周</span></span>
                      </button>

                      {/* Monthly Tier with trial option */}
                      <button 
                        onClick={() => { playSynthBeep('click'); setSelectedPaymentTier('monthly'); }}
                        className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between transition-all relative overflow-hidden ${selectedPaymentTier === 'monthly' ? "bg-amber-400/10 border-amber-400" : "bg-[#111113] border-white/5 text-zinc-400 hover:border-zinc-800"}`}
                      >
                        {isNewUserWithinOneMonth() && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white text-[6px] font-black tracking-widest px-1.5 py-0.5 uppercase transform rotate-12 origin-top-right mt-1.5 mr-1 scale-90">TRIAL</div>
                        )}
                        <div>
                          <span className={`text-[8px] font-mono font-black uppercase block ${selectedPaymentTier === 'monthly' ? "text-amber-400" : "text-zinc-500"}`}>Monthly Pass</span>
                          <span className="text-white text-xs font-black block mt-0.5">月度特权</span>
                          {isNewUserWithinOneMonth() && (
                            <span className="text-amber-400 font-sans text-[8px] block mt-0.5">★ 新用户首周 ¥0.90 试用</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-white font-mono text-sm font-black block">
                            {isNewUserWithinOneMonth() ? "¥0.90" : "¥19.90"}
                          </span>
                          <span className="text-[9px] text-zinc-500 block">
                            {isNewUserWithinOneMonth() ? "首周, 后续 ¥19.9/月" : "/ 月"}
                          </span>
                        </div>
                      </button>

                      {/* Yearly Tier with trial option */}
                      <button 
                        onClick={() => { playSynthBeep('click'); setSelectedPaymentTier('yearly'); }}
                        className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between transition-all relative overflow-hidden ${selectedPaymentTier === 'yearly' ? "bg-amber-400/10 border-amber-400" : "bg-[#111113] border-white/5 text-zinc-400 hover:border-zinc-800"}`}
                      >
                        {isNewUserWithinOneMonth() && (
                          <div className="absolute top-0 right-0 bg-[#D4FF00] text-black text-[6px] font-black tracking-widest px-1.5 py-0.5 uppercase transform rotate-12 origin-top-right mt-1.5 mr-1 scale-90">HOT</div>
                        )}
                        <div>
                          <span className={`text-[8px] font-mono font-black uppercase block ${selectedPaymentTier === 'yearly' ? "text-amber-400" : "text-zinc-500"}`}>Yearly Pass</span>
                          <span className="text-white text-xs font-black block mt-0.5">年卡尊享特权</span>
                          {isNewUserWithinOneMonth() && (
                            <span className="text-[#D4FF00] font-sans text-[8px] block mt-0.5">★ 新用户首周 ¥0.09 试用</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-white font-mono text-sm font-black block">
                            {isNewUserWithinOneMonth() ? "¥0.09" : "¥168.00"}
                          </span>
                          <span className="text-[9px] text-zinc-500 block">
                            {isNewUserWithinOneMonth() ? "首周, 后续 ¥168/年" : "/ 年"}
                          </span>
                        </div>
                      </button>
                    </div>

                    <button 
                      onClick={() => { playSynthBeep('click'); setPaymentStep('qrcode'); }}
                      className="w-full bg-[#D4FF00] hover:bg-[#cbf500] text-black py-4 rounded-2xl font-black text-sm transition-colors mt-2"
                    >
                      微信安全支付 Secure WeChat Pay
                    </button>
                  </div>
                )}

                {paymentStep === 'qrcode' && (
                  <div className="flex flex-col items-center justify-center py-4 font-sans">
                    {/* High contrast digital QR code simulation */}
                    <div className="w-40 h-40 bg-white p-3.5 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
                      {/* Grid patterns */}
                      <div className="grid grid-cols-4 gap-1.5 w-full h-full text-black">
                        {[...Array(16)].map((_, idx) => (
                          <div 
                            key={idx} 
                            style={{ opacity: (idx % 3 === 0 || idx % 5 === 2) ? 1 : 0.15 }}
                            className="bg-black rounded-sm h-full"
                          />
                        ))}
                      </div>
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                    </div>

                    <div className="mt-4 text-center select-none">
                      <span className="text-xs font-mono text-zinc-400 block font-bold">请使用微信扫码完成支付</span>
                      <span className="text-[10px] text-zinc-500 block mt-1">
                        订单金额: ¥{
                          selectedPaymentTier === 'weekly' 
                            ? "7.00" 
                            : selectedPaymentTier === 'monthly'
                              ? (isNewUserWithinOneMonth() ? "0.90" : "19.90")
                              : (isNewUserWithinOneMonth() ? "0.09" : "168.00")
                        } (沙盒安全测试模式)
                      </span>
                    </div>

                    <button 
                      onClick={() => {
                        playSynthBeep('success');
                        setIsPremiumUser(true);
                        setPaymentStep('success');
                        setShowRewardParticles(true);
                        setTimeout(() => setShowRewardParticles(false), 2000);
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-xs mt-6 transition-all shadow-md shadow-emerald-905/10 active:scale-95"
                    >
                      ✓ 模拟支付成功
                    </button>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="text-center py-6 font-sans">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                      <Check className="w-8 h-8 font-black" />
                    </div>
                    <h4 className="text-white font-black text-lg">支付成功！特权已即刻激活</h4>
                    <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto">尊敬的 CYBER 会员，所有多发性多巴胺专注、句法拆解全部开启。尽情享受沉浸效率吧！</p>
                    
                    <button 
                      onClick={() => { playSynthBeep('click'); setShowPaymentModal(false); setPaymentStep('select'); }}
                      className="w-full bg-[#D4FF00] text-black font-black py-3.5 rounded-xl text-xs mt-8"
                    >
                      开始沉浸专精之旅
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
