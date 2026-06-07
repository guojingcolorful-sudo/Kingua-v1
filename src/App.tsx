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
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Lesson, Sentence, SyntaxBlock, Vocabulary, UserStats, UserSettings } from "./types";
import { DEFAULT_LESSONS, DEFAULT_VOCABULARIES } from "./data";

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
    return saved ? JSON.parse(saved) : ["graduated", "obvious"];
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("lingua_stats_v62");
    return saved ? JSON.parse(saved) : {
      streak: 14,
      totalTokens: 1240,
      wordCounts: { green: 4, yellow: 18, red: 10 }
    };
  });

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

  // Filter vault items
  const [vaultFilter, setVaultFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');

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

  // Review & Subscription plans
  const [activeReviewPlan, setActiveReviewPlan] = useState<'ebbinghaus' | 'flash' | 'deep'>('ebbinghaus');
  const [reviewWordsDailyTarget, setReviewWordsDailyTarget] = useState(10);
  const [reviewWordsCompletedToday, setReviewWordsCompletedToday] = useState(4);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentTier, setSelectedPaymentTier] = useState<'monthly' | 'lifetime'>('monthly');
  const [paymentStep, setPaymentStep] = useState<'select' | 'qrcode' | 'success'>('select');

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

  useEffect(() => {
    localStorage.setItem("lingua_stats_v62", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("lingua_settings_v62", JSON.stringify(settings));
  }, [settings]);

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
        interval = setInterval(() => {
          if (!isLoopingSentence) {
            setCurrentSentenceIndex((prev) => {
              if (prev < lesson.sentences.length - 1) {
                // Play spoken synthesis for next naturally arriving sentence if Zen allows, or simulate
                const nextId = prev + 1;
                speakTextEn(lesson.sentences[nextId].text);
                return nextId;
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
  }, [isPlaying, activeLessonId, currentSentenceIndex, isLoopingSentence]);

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
    setActiveLessonId(id);
    setSelectedBookSentenceId(null);
    const lesson = lessons.find(l => l.id === id);
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
  const exportSubtitles = (includeChinese: boolean) => {
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
      srtText += `${sentence.text}\n`;
      if (includeChinese) {
        srtText += `${sentence.translationCn}\n`;
      }
      srtText += "\n";
    });
    
    const blob = new Blob([srtText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${lesson.title}_${includeChinese ? "bilingual" : "english"}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter lists inside Vault
  const filteredVocabCollection = vocabularies.filter(v => {
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

                            {/* Audio Play Aloud master play button */}
                            <button 
                              onClick={() => {
                                playSynthBeep('success');
                                const currentlyPlaying = !isBookPlaying;
                                setIsBookPlaying(currentlyPlaying);
                                if (currentlyPlaying) {
                                  // start playing first sentence of the page
                                  const startIdx = activeBookPage * sentencesPerPage;
                                  setActiveBookSentenceIdx(startIdx);
                                  setSelectedBookSentenceId(lesson.sentences[startIdx]?.id || null);
                                  speakTextEn(lesson.sentences[startIdx]?.text || "");
                                } else {
                                  window.speechSynthesis.cancel();
                                }
                              }}
                              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${isBookPlaying ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "bg-white text-black font-sans"}`}
                            >
                              {isBookPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-black" /> 正在朗读整页...
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-black ml-0.5" /> 🔊 自动播放整页
                                </>
                              )}
                            </button>

                            <button 
                              onClick={() => {
                                if (activeBookPage < totalPages - 1) {
                                  playSynthBeep('click');
                                  setActiveBookPage(prev => prev + 1);
                                  setActiveBookSentenceIdx(null);
                                  setSelectedBookSentenceId(null);
                                }
                              }}
                              disabled={activeBookPage === totalPages - 1}
                              className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold disabled:opacity-20 active:scale-95 transition-transform font-sans"
                            >
                              下一页 →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Non-epub lessons fall back to standard list layout
                  return (
                    <>
                      {/* 1. Sticky Video Player Frame if showVideo is true */}
                      {(() => {
                        const isVideo = lesson.contentType === 'video';
                        const showVideo = isVideo && !isVideoViewClosed;
                        if (!showVideo) return null;
                        
                        return (
                          <div className="w-full bg-[#000000] border-b border-white/10 shrink-0 relative flex flex-col justify-between" style={{ height: '220px' }}>
                            <img 
                              src={lesson.coverImage} 
                              alt="Video Cover" 
                              className="absolute inset-0 object-cover w-full h-full opacity-60 pointer-events-none filter brightness-75 contrast-125 select-none"
                              referrerPolicy="no-referrer"
                            />
                            {/* Cybernetic Scanline scan-raster decoration */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.85))] pointer-events-none" />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_95%,rgba(18,16,16,0.3)_98%)] pointer-events-none" />
                            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

                            {/* L3 Absolute video head controls */}
                            <div className="relative pt-4 px-4 flex justify-between items-center z-10 shrink-0 select-none">
                              <button 
                                onClick={exitLessonView}
                                className="w-9 h-9 rounded-full bg-black/60 hover:bg-neutral-900 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-transform"
                                title="返回书架"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>

                              <div className="bg-black/60 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-neutral-300 font-sans tracking-wide max-w-[124px] truncate">
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="flex gap-2 relative">
                                {/* Subtitle Exporter Button */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setExportDropdownOpen(prev => !prev);
                                  }}
                                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${exportDropdownOpen ? "bg-[#D4FF00] border-[#D4FF00] text-black shadow-lg shadow-lime-950" : "bg-black/60 border-white/15 text-white hover:text-[#D4FF00]"}`}
                                  title="导出字幕 Subtitle Exporter"
                                >
                                  <Download className="w-4 h-4" />
                                </button>

                                {exportDropdownOpen && (
                                  <div className="absolute right-0 top-11 bg-zinc-950 border border-white/10 p-1.5 rounded-xl z-50 flex flex-col gap-1 w-32 shadow-2xl animate-fade-in text-[10px]">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        exportSubtitles(true);
                                        setExportDropdownOpen(false);
                                      }}
                                      className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                    >
                                      <span>🀄 中英双语字幕</span>
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        exportSubtitles(false);
                                        setExportDropdownOpen(false);
                                      }}
                                      className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                    >
                                      <span>🇬🇧 纯英文字幕</span>
                                    </button>
                                  </div>
                                )}

                                {/* Subtitle Font Size Cycle Toggle button */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setFontSizeFactor(prev => prev === 'md' ? 'lg' : prev === 'lg' ? 'xl' : 'md');
                                  }}
                                  className="w-9 h-9 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white hover:text-[#D4FF00] active:scale-95 transition-all font-mono text-xs font-black"
                                  title="调节字级 Subtitle Sizing"
                                >
                                  {fontSizeFactor === 'md' ? 'A' : fontSizeFactor === 'lg' ? 'AA' : 'AAA'}
                                </button>

                                {/* Subtitle Hidden/Visible (Zen Mode) button */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setIsZenMode(prev => !prev);
                                  }}
                                  className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform border ${isZenMode ? "bg-amber-400 border-amber-400 text-black shadow-lg" : "bg-black/60 border-white/15 text-white hover:text-[#D4FF00]"}`}
                                  title={isZenMode ? "开启全屏幕遮罩听音" : "显示中英对齐字幕"}
                                >
                                  {isZenMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* 2. Interactive Main Center play/pause overlay */}
                            <div 
                              onClick={() => {
                                playSynthBeep('click');
                                setIsPlaying(prev => !prev);
                              }}
                              className="relative flex-1 flex items-center justify-center cursor-pointer z-10 group"
                            >
                              <div className="w-12 h-12 rounded-full bg-black/55 hover:bg-[#D4FF00] hover:text-black border border-white/15 flex items-center justify-center backdrop-blur-sm transition-all duration-300 transform group-hover:scale-110 active:scale-90 shadow-2xl">
                                {isPlaying ? (
                                  <Pause className="w-5 h-5 fill-current" />
                                ) : (
                                  <Play className="w-5 h-5 fill-current ml-0.5" />
                                )}
                              </div>
                            </div>

                            {/* 3. Bottom controls overlaid */}
                            <div className="relative pb-3 px-4 flex flex-col gap-2 z-10 shrink-0 bg-gradient-to-t from-black via-black/40 to-transparent select-none">
                              {/* Progress track timeline progress bar with custom click seek */}
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-zinc-400 min-w-[32px] block">
                                  {(() => {
                                    const currentSeconds = Math.floor((currentSentenceIndex / (lesson.sentences.length || 1)) * 340);
                                    const m = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
                                    const s = (currentSeconds % 60).toString().padStart(2, '0');
                                    return `${m}:${s}`;
                                  })()}
                                </span>

                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickX = e.clientX - rect.left;
                                    const percentage = clickX / rect.width;
                                    const targetIdx = Math.min(
                                      Math.max(0, Math.floor(percentage * lesson.sentences.length)),
                                      lesson.sentences.length - 1
                                    );
                                    playSynthBeep('click');
                                    setCurrentSentenceIndex(targetIdx);
                                    speakTextEn(lesson.sentences[targetIdx].text);
                                  }}
                                  className="flex-1 h-1.5 bg-white/10 hover:bg-white/20 rounded-full relative cursor-pointer overflow-hidden transition-colors"
                                >
                                  <div 
                                    className="absolute left-0 top-0 bottom-0 bg-[#D4FF00] rounded-full transition-all duration-300 shadow-[0_0_8px_#D4FF00]"
                                    style={{ width: `${((currentSentenceIndex + 1) / (lesson.sentences.length || 1)) * 100}%` }}
                                  />
                                </div>

                                <span className="text-[10px] font-mono text-zinc-400 min-w-[32px] text-right block">
                                  {lesson.durationOrPages}
                                </span>
                              </div>

                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
                                  CYBER EYE CH.1 // VIDEO STREAM
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setIsVideoViewClosed(true);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-neutral-850 border border-white/10 flex items-center justify-center text-[#D4FF00] active:scale-95 transition-all active:bg-[#D4FF00] active:text-black"
                                  title="仅听音频 Only Audio"
                                >
                                  <Headphones className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 2. Alternative Space-saving Audio mode panel if showVideo is false */}
                      {(() => {
                        const isVideo = lesson.contentType === 'video';
                        const showVideo = isVideo && !isVideoViewClosed;
                        if (showVideo) return null;
                        
                        return (
                          <div className="mx-6 mt-4 bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex flex-col gap-3.5 shadow-xl relative overflow-hidden shrink-0">
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
                                      {lesson.contentType === "video" ? "音频沉浸流 AUDIO MODE" : "播客原音 PODCAST MODE"}
                                    </span>
                                    {isPlaying && (
                                      <div className="flex items-center gap-0.5 h-2">
                                        <span className="w-0.5 h-1.5 bg-[#D4FF00] animate-bounce" style={{ animationDelay: '0.1s' }} />
                                        <span className="w-0.5 h-2 bg-[#D4FF00] animate-bounce" style={{ animationDelay: '0.3s' }} />
                                        <span className="w-0.5 h-1 bg-[#D4FF00] animate-bounce" style={{ animationDelay: '0.5s' }} />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-white text-xs font-black tracking-tight mt-0.5 max-w-[130px] truncate">{lesson.title}</p>
                                </div>
                              </div>

                              {/* Controls right */}
                              <div className="flex items-center gap-2 relative">
                                {/* Subtitle Exporter Button */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setExportDropdownOpen(prev => !prev);
                                  }}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${exportDropdownOpen ? "bg-[#D4FF00] border-[#D4FF00] text-black" : "bg-neutral-900 border-white/5 text-zinc-400 hover:text-white"}`}
                                  title="导出字幕 Subtitle Exporter"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>

                                {exportDropdownOpen && (
                                  <div className="absolute right-0 top-10 bg-zinc-950 border border-white/10 p-1.5 rounded-xl z-50 flex flex-col gap-1 w-32 shadow-2xl animate-fade-in text-[10px]">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        exportSubtitles(true);
                                        setExportDropdownOpen(false);
                                      }}
                                      className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                    >
                                      <span>🀄 中英双语字幕</span>
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        exportSubtitles(false);
                                        setExportDropdownOpen(false);
                                      }}
                                      className="py-1.5 px-2 rounded-lg text-left hover:bg-neutral-900 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors font-sans font-bold whitespace-nowrap"
                                    >
                                      <span>🇬🇧 纯英文字幕</span>
                                    </button>
                                  </div>
                                )}

                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setIsPlaying(prev => !prev);
                                  }}
                                  className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-white hover:text-[#D4FF00] active:scale-90"
                                >
                                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                                </button>

                                {/* Subtitle sizing overlay cycle toggle */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSynthBeep('click');
                                    setFontSizeFactor(prev => prev === 'md' ? 'lg' : prev === 'lg' ? 'xl' : 'md');
                                  }}
                                  className="w-8 h-8 rounded-full bg-neutral-950 hover:bg-neutral-900 border border-white/15 flex items-center justify-center text-[10px] font-mono font-black text-zinc-400 active:scale-95 transition-transform"
                                  title="字号 Sizing"
                                >
                                  {fontSizeFactor === 'md' ? 'A' : fontSizeFactor === 'lg' ? 'AA' : 'AAA'}
                                </button>

                                {/* Switch back to video option if lesson is video */}
                                {lesson.contentType === "video" && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSynthBeep('click');
                                      setIsVideoViewClosed(false);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-[#D4FF00]/10 hover:bg-[#D4FF00]/25 border border-[#D4FF00]/30 text-[#D4FF00] flex items-center justify-center active:scale-95 transition-transform"
                                    title="开启视频 Show Video"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Clickable slider timeline progress bar */}
                            <div className="flex items-center gap-3 bg-neutral-950/40 p-2.5 rounded-xl border border-white/5">
                              <span className="text-[9px] font-mono text-zinc-500 min-w-[32px] block">
                                {(() => {
                                  const currentSeconds = Math.floor((currentSentenceIndex / (lesson.sentences.length || 1)) * 340);
                                  const m = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
                                  const s = (currentSeconds % 60).toString().padStart(2, '0');
                                  return `${m}:${s}`;
                                })()}
                              </span>

                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const clickX = e.clientX - rect.left;
                                  const percentage = clickX / rect.width;
                                  const targetIdx = Math.min(
                                    Math.max(0, Math.floor(percentage * lesson.sentences.length)),
                                    lesson.sentences.length - 1
                                  );
                                  playSynthBeep('click');
                                  setCurrentSentenceIndex(targetIdx);
                                  speakTextEn(lesson.sentences[targetIdx].text);
                                }}
                                className="flex-1 h-1.5 bg-white/10 hover:bg-white/20 rounded-full relative cursor-pointer overflow-hidden transition-colors"
                              >
                                <div 
                                  className="absolute left-0 top-0 bottom-0 bg-[#D4FF00] rounded-full transition-all duration-300 shadow-[0_0_8px_#D4FF00]"
                                  style={{ width: `${((currentSentenceIndex + 1) / (lesson.sentences.length || 1)) * 100}%` }}
                                />
                              </div>

                              <span className="text-[9px] font-mono text-zinc-500 min-w-[32px] text-right block">
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
                        {lesson.sentences.map((sentence, sIdx) => {
                          const isFocussed = sIdx === currentSentenceIndex;
                          
                          return (
                            <div 
                              key={sentence.id}
                              className={`transition-all duration-500 py-6 pr-4 relative border-b border-white/5 ${isFocussed ? "opacity-100 py-8" : "opacity-25"}`}
                              onClick={() => {
                                playSynthBeep('click');
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
                                      } ${customUnderline} ${textAccentColor}`}
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

                              {/* Focussed Chinese helper line, faded if Zen Mode active to support pure immersion */}
                              <AnimatePresence>
                                {isFocussed && !isZenMode && (
                                  <motion.p 
                                    className={`text-neutral-400 mt-3 font-semibold leading-relaxed tracking-wide transition-all ${
                                      fontSizeFactor === 'md' 
                                        ? "text-xs" 
                                        : fontSizeFactor === 'lg' 
                                        ? "text-sm" 
                                        : "text-base"
                                    }`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                  >
                                    {sentence.translation}
                                  </motion.p>
                                )}
                              </AnimatePresence>

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
                            <div className="text-[9px] font-mono text-[#D4FF00] font-black uppercase tracking-wider">声联动力音频解码 L1</div>
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
              onClick={() => selectActiveLesson(lessons[0]?.id || "jobs-commencement")}
              className="mt-4 bg-[#111113] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden box-glow cursor-pointer group active:scale-98 transition-all"
            >
              {/* Soft neon core glow filter */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4FF00]/15 rounded-full filter blur-[50px] pointer-events-none" />

              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-[#D4FF00]/10 border border-[#D4FF00]/30 rounded-full text-[9px] font-mono font-bold text-[#D4FF00] tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#D4FF00]"></span> 继续脑语回圈
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">已连续学习 {stats.streak} 天</span>
              </div>

              <h2 className="text-white text-3xl font-black leading-tight mb-2 tracking-tight group-hover:text-[#D4FF00] transition-colors">
                继续沉浸<br />原声语境。
              </h2>
              <p className="text-neutral-500 text-xs mb-6 font-medium">点击继续，让极简声音科技抚平传统背词压力。</p>

              {/* Holographic start play button */}
              <button className="w-full bg-[#D4FF00] hover:bg-[#cbf500] text-black font-black py-4.5 rounded-2xl flex justify-center items-center gap-2 transition-colors text-sm">
                初始化声波破译中枢 <Zap className="w-4 h-4 fill-black" />
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
                      setShowLoginModal(true);
                    } else {
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
                      setActiveImportTab('media');
                      setShowImport舱(true);
                    }}
                    className="flex-1 bg-[#111113] hover:bg-[#161619] border border-white/5 hover:border-[#D4FF00]/50 rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all active:scale-98 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
                    id="local-media-tile"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-emerald-400 group-hover:shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all">
                      <FileAudio className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-white text-[12px] font-black leading-tight">导入本地视频</span>
                      <span className="block text-neutral-500 text-[8px] font-mono leading-none mt-0.5">支持 MP4 视频或 MP3 音频转录</span>
                    </div>
                  </button>

                  {/* EPUB/PDF Reader (Digital Books Shelf) */}
                  <button 
                    onClick={() => {
                      playSynthBeep('click');
                      setActiveImportTab('epub');
                      setShowImport舱(true);
                    }}
                    className="flex-1 bg-[#111113] hover:bg-[#161619] border border-white/5 hover:border-[#D4FF00]/50 rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all active:scale-98 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
                    id="epub-reader-tile"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-white text-[12px] font-black leading-tight">导入电纸书小说</span>
                      <span className="block text-neutral-500 text-[8px] font-mono leading-none mt-0.5">支持 EPUB / PDF / TXT精读</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Captured resources database lists */}
            <div className="mt-8 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4 pl-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black">学习频道</span>
                <button 
                  onClick={() => { playSynthBeep('click'); setShowAllLessonsModal(true); }}
                  className="px-2.5 py-1 text-[10px] font-bold text-black bg-[#D4FF00] hover:bg-[#cbf500] rounded-xl tracking-wider transition-all uppercase flex items-center gap-1 active:scale-95"
                >
                  全部 ({lessons.length})
                </button>
              </div>

              <div className="space-y-4">
                {lessons.slice(0, 3).map(lesson => (
                  <div 
                    key={lesson.id}
                    onClick={() => selectActiveLesson(lesson.id)}
                    className="bg-[#111113]/80 border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors relative overflow-hidden active:scale-98"
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-white shrink-0 relative overflow-hidden">
                        <img src={lesson.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                        <div className="relative z-10 text-lime-400">
                          {lesson.contentType === "video" ? <Play className="w-4 h-4 fill-current" /> : lesson.contentType === "epub" ? <BookOpen className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-white text-sm font-bold block truncate max-w-[170px]">{lesson.title}</span>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500 mt-1 uppercase">
                          <span>{lesson.contentType}</span>
                          <span>•</span>
                          <span>{lesson.durationOrPages}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 bg-white/5 px-2 py-1 rounded">
                        {lesson.progress}%
                      </span>
                      {/* Left Swipe sliding delete simulation */}
                      <button 
                        onClick={(e) => deleteLesson(lesson.id, e)}
                        className="w-8 h-8 rounded-lg bg-red-950/20 text-rose-400 flex items-center justify-center hover:bg-rose-900/30 font-bold"
                        title="Delete source block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">Neural Loot</span>
                <h2 className="text-3xl font-black text-white tracking-tight">精选生词库</h2>
              </div>
              <div className="text-right">
                <span className="text-[20px] font-mono font-black text-[#D4FF00] block">{vocabularies.length}</span>
                <span className="text-[9px] font-mono text-neutral-600 block uppercase font-bold">已收录字词</span>
              </div>
            </div>

            {/* known known/core/hard stats block matrix */}
            <div className="grid grid-cols-3 gap-2.5 mt-4">
              <button 
                onClick={() => { playSynthBeep('click'); setVaultFilter('all'); }}
                className={`py-2 px-3 rounded-xl border text-center transition-colors ${vaultFilter === 'all' ? "bg-white/10 text-white border-white/20" : "bg-neutral-900 text-neutral-500 border-neutral-800"}`}
              >
                <span className="text-xs font-bold block">全部 ALL</span>
                <span className="text-[10px] font-mono">{vocabularies.length}</span>
              </button>
              <button 
                onClick={() => { playSynthBeep('click'); setVaultFilter('green'); }}
                className={`py-2 px-3 rounded-xl border text-center transition-colors ${vaultFilter === 'green' ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "bg-neutral-900 text-neutral-500 border-neutral-800"}`}
              >
                <div className="flex justify-center items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold block">熟识 KNOWN</span>
                </div>
                <span className="text-[10px] font-mono">{vocabularies.filter(v => v.color === 'green').length}</span>
              </button>
              <button 
                onClick={() => { playSynthBeep('click'); setVaultFilter('yellow'); }}
                className={`py-2 px-3 rounded-xl border text-center transition-colors ${vaultFilter === 'yellow' ? "bg-lime-400/10 text-[#D4FF00] border-lime-400/40 shadow-[0_0_10px_rgba(212,255,0,0.1)]" : "bg-neutral-900 text-neutral-500 border-neutral-800"}`}
              >
                <div className="flex justify-center items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]"></span>
                  <span className="text-xs font-bold block">精读 CORE</span>
                </div>
                <span className="text-[10px] font-mono">{vocabularies.filter(v => v.color === 'yellow').length}</span>
              </button>
            </div>

            <div className="w-full h-px bg-white/5 my-4"></div>

            {/* Empty stats state with high-end Ghost illustration */}
            {filteredVocabCollection.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-neutral-600 transform rotate-12 mb-4 animate-bounce">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-white font-black text-md">这里空空如也</h3>
                <p className="text-neutral-500 text-xs px-8 mt-2 leading-relaxed">
                  开始扫描粘贴文章、点击原声字幕，或长按电子书生词句子来进行高光收录收藏。
                </p>
                <button 
                  onClick={() => { playSynthBeep('click'); setCurrentTab('listen'); }}
                  className="mt-6 px-5 py-2.5 bg-lime-400 text-black text-xs font-black rounded-lg active:scale-95 transition-transform"
                >
                  去学习频道精读 
                </button>
              </div>
            ) : (
              /* Immersive phrase waterfall timeline list */
              <div className="space-y-4">
                {filteredVocabCollection.map(v => (
                  <div 
                    key={v.id}
                    onClick={() => {
                      playSynthBeep('click');
                      setExpandedVocabId(expandedVocabId === v.id ? null : v.id);
                    }}
                    className={`bg-[#111113]/80 border rounded-2xl p-5 relative overflow-hidden group hover:border-[#D4FF00]/40 transition-all ${expandedVocabId === v.id ? "border-[#D4FF00]/40 bg-zinc-950 shadow-2xl" : "border-white/5 cursor-pointer"}`}
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

                        {/* Direct HUD trigger check if they want deep dictionary analyze */}
                        <button 
                          onClick={() => { playSynthBeep('click'); initiateWordLookup(v.word); }}
                          className="w-full bg-[#D4FF00]/10 hover:bg-[#D4FF00]/20 border border-[#D4FF00]/30 py-3 rounded-2xl text-[11px] font-black text-[#D4FF00] active:scale-98 transition-transform"
                        >
                          🔍 呼起 AI 多维度语篇拆解 HUD
                        </button>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tab 3: ⚙️ 禅庭后勤系统 (System) Dashboard L1 */}
          <div className={`flex-1 flex flex-col px-5 overflow-y-auto no-scrollbar pb-24 ${currentTab === 'system' ? "" : "hidden"}`}>
            
            <div className="py-4">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">System Logistics</span>
              <h2 className="text-3xl font-black text-white tracking-tight">系统后勤部</h2>
            </div>

            {/* User credentials ID (Silent auto assigned) */}
            <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 flex items-center justify-between mt-4">
              <div>
                <div className="text-[9px] font-mono text-[#D4FF00] tracking-widest uppercase font-black mb-1">ANON_NEURAL_LINK</div>
                <div className="text-white text-base font-black font-mono">ANON_8F9A_V6.2</div>
                <span className="text-[10px] text-neutral-500 block">UUID 本机安全存储。无任何流转踪迹。</span>
              </div>
              <button 
                onClick={() => {
                  playSynthBeep('success');
                  setIsWechatBound(prev => {
                    const next = !prev;
                    localStorage.setItem("lingua_wechat_bound", next ? "true" : "false");
                    return next;
                  });
                }}
                className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${isWechatBound ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-white text-black active:scale-95"}`}
              >
                {isWechatBound ? (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> 已同步云备份
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" /> 关联微信同步
                  </>
                )}
              </button>
            </div>

            {/* Dynamic SM-2 Flashcard Roulette Blindbox drawer block */}
            <div className="mt-6 bg-[#111113] border border-white/5 rounded-3xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/10 filter blur-3xl rounded-full"></div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">Memory SM-2 Flash Card</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              </div>

              <h3 className="text-white font-black text-lg mb-1">语感记忆闪卡</h3>
              <p className="text-neutral-500 text-xs mb-5 font-normal">基于 SM-2 复习算法，随机检索一个记忆薄弱词条进行专注速记。</p>

              {blindCard ? (
                <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 mb-5 relative min-h-[100px] flex flex-col justify-between">
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#D4FF00] box-glow"></div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block">{blindCard.partOfSpeech === 'noun' ? '名词 ' : blindCard.partOfSpeech === 'verb' ? '动词 ' : blindCard.partOfSpeech === 'adj' ? '形容词 ' : '副词 '}{blindCard.partOfSpeech}</span>
                    <span className="text-xl font-black text-white block mt-0.5">{blindCard.word}</span>
                    <span className="text-neutral-400 text-xs font-mono block mt-1">[{blindCard.phonetic}]</span>
                    <p className="text-white text-sm font-bold mt-2 font-mono leading-relaxed">{blindCard.definitionCn}</p>
                  </div>
                  {blindCard.example && (
                    <p className="text-neutral-400 text-xs italic mt-3 bg-zinc-900 py-1.5 px-3 rounded-lg border border-neutral-800">"{blindCard.example}"</p>
                  )}
                </div>
              ) : (
                <div className="bg-zinc-950/50 text-center p-8 rounded-2xl border border-dashed border-white/5 mb-5">
                  <span className="text-zinc-600 text-xs font-mono">当前暂无收录闪卡。请点击下方抽取。</span>
                </div>
              )}

              <button 
                onClick={rollInspirationBlindBox}
                disabled={isRouletteRolling || vocabularies.length === 0}
                className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 py-3 rounded-xl text-xs font-black text-[#D4FF00] uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-40"
              >
                {isRouletteRolling ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin text-[#D4FF00]" /> 正在检索生词库节点...
                  </>
                ) : (
                  <>
                    <span>🎲 随机抽取温习闪卡</span>
                  </>
                )}
              </button>
            </div>

            {/* Revamped Review Planner & VIP Subscription (Replacing cognitive preferences switches) */}
            <div className="mt-8 space-y-6">
              {/* Part 1: Review Planner */}
              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black mb-3 pl-1 block">Review Planner - 智能复习温习计划</span>
                
                <div className="bg-[#111113] border border-white/5 rounded-2xl p-4 space-y-4">
                  {/* Selector of Plan Tiers */}
                  <div className="grid grid-cols-3 gap-2">
                    {(['ebbinghaus', 'flash', 'deep'] as const).map(plan => {
                      const label = plan === 'ebbinghaus' ? '艾宾浩斯' : plan === 'flash' ? '快速精记' : '听力影子';
                      const desc = plan === 'ebbinghaus' ? '抗遗忘曲线' : plan === 'flash' ? '高密集冲刺' : '声波影子复刻';
                      const isSel = activeReviewPlan === plan;
                      return (
                        <button 
                          key={plan}
                          onClick={() => { playSynthBeep('click'); setActiveReviewPlan(plan); }}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${isSel ? "bg-[#D4FF00]/10 border-[#D4FF00]" : "bg-neutral-900 border-transparent text-zinc-500 hover:text-zinc-300"}`}
                        >
                          <span className={`text-[11px] font-black tracking-tight ${isSel ? "text-white" : "text-zinc-400"}`}>{label}</span>
                          <span className="text-[7.5px] font-medium leading-none block text-zinc-500 tracking-tight">{desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Target Adjuster */}
                  <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4FF00] uppercase font-bold tracking-wider block">每日单词温习目标</span>
                      <span className="text-zinc-400 text-xs mt-0.5 block">今日进度: {reviewWordsCompletedToday} / {reviewWordsDailyTarget} 词</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          playSynthBeep('click');
                          setReviewWordsDailyTarget(prev => Math.max(5, prev - 5));
                        }}
                        className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center text-white active:scale-90"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-black text-white w-6 text-center">{reviewWordsDailyTarget}</span>
                      <button 
                        onClick={() => {
                          playSynthBeep('click');
                          setReviewWordsDailyTarget(prev => Math.min(100, prev + 5));
                        }}
                        className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center text-white active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

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
                      粘贴流媒体
                    </button>
                    <button 
                      onClick={() => { playSynthBeep('click'); setActiveImportTab('media'); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${activeImportTab === 'media' ? "bg-white/10 text-white shadow-md font-bold" : "text-neutral-500 hover:text-white"}`}
                    >
                      本地音视频
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
                        <h3 className="text-white text-xl font-black mb-1">导入本地媒体原电控文件</h3>
                        <p className="text-neutral-505 text-xs mb-6">支持 MP3, WAV, M4A, MP4 等本地方便自动 Whisper 转录文字翻译极速破译。</p>

                        {!localMediaFile ? (
                          <div className="relative border border-dashed border-zinc-805 bg-[#111113]/20 hover:bg-[#111113]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[160px]">
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
                            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 duration-300">
                              <Volume2 className="w-5 h-5" />
                            </div>
                            <span className="block text-white text-xs font-bold">轻点或拖曳放入本地音视频</span>
                            <span className="block text-neutral-500 text-[9px] font-mono mt-1">SUPPORT AUDIO VIDEO DRAG & DROP</span>
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
                          <div>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                              {activeBlock.role === 'subject' ? '主语 Subject' : activeBlock.role === 'verb' ? '谓语动词 Verb' : activeBlock.role === 'object' ? '宾语 Object' : '修饰成分 Modifier'} ({activeBlock.roleCn})
                            </span>
                            <h4 className="text-white text-lg font-black my-1">{activeBlock.token}</h4>
                          </div>
                          <p className="text-neutral-400 text-xs leading-relaxed font-semibold mt-2">{activeBlock.explanation}</p>
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
                            <button 
                              onClick={() => saveWordToNexus(currentDef.word)}
                              className="flex-1 bg-white hover:bg-neutral-100 text-black rounded-[1.5rem] font-black text-base flex justify-center items-center gap-2 active:scale-95 shadow-xl select-none"
                            >
                              <Zap className="w-5 h-5 fill-black" /> Save to Nexus
                            </button>
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
                  <h3 className="text-xl font-black text-white">全部学习资源</h3>
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

                  return filtered.map(lesson => (
                    <div 
                      key={lesson.id}
                      onClick={() => {
                        playSynthBeep('click');
                        selectActiveLesson(lesson.id);
                        setShowAllLessonsModal(false);
                      }}
                      className="bg-[#111113]/80 border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors relative overflow-hidden active:scale-98"
                    >
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-white shrink-0 relative overflow-hidden">
                          <img src={lesson.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                          <div className="relative z-10 text-lime-400">
                            {lesson.contentType === "video" ? <Play className="w-4 h-4 fill-current" /> : lesson.contentType === "epub" ? <BookOpen className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
                          </div>
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-white text-sm font-bold block truncate max-w-[220px]">{lesson.title}</span>
                          <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500 mt-1 uppercase">
                            <span>{lesson.contentType}</span>
                            <span>•</span>
                            <span>{lesson.durationOrPages}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
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
                className="w-full max-w-sm bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4FF00]/5 filter blur-3xl rounded-full" />
                
                <h3 className="text-xl font-black text-white flex items-center gap-2 mb-1.5">
                  <MessageCircle className="w-5 h-5 text-emerald-400" /> 微信极速登录
                </h3>
                <p className="text-zinc-500 text-xs mb-6">绑定手机号，完成全平台云端数据实时同步防丢失</p>

                <div className="space-y-4">
                  {/* Phone Input */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-1.5 block">手机号码 Phone Number</label>
                    <input 
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="11 位中国大陆手机号"
                      className="w-full bg-zinc-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] font-mono"
                    />
                  </div>

                  {/* Verification Code */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-1.5 block">短信验证码 verification code</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="6 位验证码"
                        className="flex-1 bg-zinc-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4FF00] font-mono"
                      />
                      <button 
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
                        className="px-3.5 py-3 rounded-xl text-xs font-bold bg-[#D4FF00] text-black hover:bg-[#cbf500] disabled:bg-neutral-900 disabled:text-zinc-500 disabled:border disabled:border-neutral-800 transition-colors shrink-0"
                      >
                        {codeCountdown > 0 ? `${codeCountdown}s` : "获取验证码"}
                      </button>
                    </div>
                  </div>

                  {/* Bound Action buttons */}
                  <div className="flex gap-2.5 pt-4">
                    <button 
                      onClick={() => { playSynthBeep('click'); setShowLoginModal(false); }}
                      className="flex-1 bg-neutral-950 text-zinc-400 hover:text-white border border-neutral-850 py-3.5 rounded-2xl text-xs font-bold transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      onClick={() => {
                        if (loginPhone.length < 11) {
                          playSynthBeep('block');
                          setApiErrorMessage("请输入完整的 11 位手机号码");
                          return;
                        }
                        if (loginCode.length < 4) {
                          playSynthBeep('block');
                          setApiErrorMessage("请输入验证码");
                          return;
                        }
                        playSynthBeep('success');
                        setIsWechatBound(true);
                        localStorage.setItem("lingua_wechat_bound", "true");
                        setShowLoginModal(false);
                        setShowRewardParticles(true);
                        setTimeout(() => setShowRewardParticles(false), 2000);
                      }}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-bold flex justify-center items-center gap-1 active:scale-95 transition-transform shadow-lg shadow-emerald-950/40"
                    >
                      <span>绑定并登录</span>
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
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => { playSynthBeep('click'); setSelectedPaymentTier('monthly'); }}
                        className={`p-4 rounded-2xl text-left border flex flex-col justify-between transition-all ${selectedPaymentTier === 'monthly' ? "bg-amber-400/10 border-amber-400" : "bg-neutral-900/60 border-white/5 text-zinc-400 hover:border-zinc-850"}`}
                      >
                        <div>
                          <span className={`text-[9px] font-mono font-black uppercase block ${selectedPaymentTier === 'monthly' ? "text-amber-400" : "text-zinc-500"}`}>Monthly Pass</span>
                          <span className="text-white text-sm font-black block mt-1">月度极简特权</span>
                        </div>
                        <span className="text-white font-mono text-base font-black mt-4">¥19.00 <span className="text-[10px] font-sans font-normal text-zinc-500">/ 月</span></span>
                      </button>

                      <button 
                        onClick={() => { playSynthBeep('click'); setSelectedPaymentTier('lifetime'); }}
                        className={`p-4 rounded-2xl text-left border flex flex-col justify-between transition-all relative overflow-hidden ${selectedPaymentTier === 'lifetime' ? "bg-amber-400/10 border-amber-400" : "bg-neutral-900/60 border-white/5 text-zinc-400 hover:border-zinc-850"}`}
                      >
                        <div className="absolute top-0 right-0 bg-[#D4FF00] text-black text-[7px] font-black tracking-widest px-1.5 py-0.5 uppercase transform rotate-12 origin-top-right mt-1">SAVE</div>
                        <div>
                          <span className={`text-[9px] font-mono font-black uppercase block ${selectedPaymentTier === 'lifetime' ? "text-amber-400" : "text-zinc-500"}`}>Lifetime VIP</span>
                          <span className="text-white text-sm font-black block mt-1">年度终身无忧</span>
                        </div>
                        <span className="text-white font-mono text-base font-black mt-4">¥129.00 <span className="text-[10px] font-sans font-normal text-zinc-500">/ 年</span></span>
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
                      <span className="text-[10px] text-zinc-500 block mt-1">订单金额: ¥{selectedPaymentTier === 'monthly' ? "19.00" : "129.00"} (沙盒安全测试模式)</span>
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
