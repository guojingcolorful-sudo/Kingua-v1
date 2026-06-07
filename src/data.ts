import { Lesson, Vocabulary } from "./types";

export const DEFAULT_LESSONS: Lesson[] = [
  {
    id: "jobs-commencement",
    title: "Steve Jobs 2005 Stanford",
    contentType: "video",
    durationOrPages: "14:50",
    coverImage: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=600&q=80",
    progress: 34,
    sentences: [
      {
        id: "jobs-s1",
        text: "Today I want to tell you three stories.",
        translation: "今天我想给你们讲三个故事。",
        syntaxBlocks: [
          { id: "b1", token: "Today", role: "modifier", roleCn: "修饰语/前置介词", explanation: "时间副词，作状语修饰整个句子" },
          { id: "b2", token: "I", role: "subject", roleCn: "主语", explanation: "主格代词作主语" },
          { id: "b3", token: "want to tell", role: "verb", roleCn: "谓语", explanation: "复合谓语结构，表达想做动作" },
          { id: "b4", token: "you", role: "object", roleCn: "间接宾语", explanation: "间代宾语" },
          { id: "b5", token: "three stories", role: "object", roleCn: "直接宾语", explanation: "名词短语作直代宾语" }
        ]
      },
      {
        id: "jobs-s2",
        text: "I never graduated from college. Truth be told, this is the closest I've ever gotten to a college graduation.",
        translation: "我大学从未毕业。说实话，这是我离大学毕业最近的一刻了。",
        syntaxBlocks: [
          { id: "b6", token: "I", role: "subject", roleCn: "主语", explanation: "主宾结构，代词I作主格" },
          { id: "b7", token: "never graduated", role: "verb", roleCn: "谓语", explanation: " graduated为一般过去时，never副词作否定修饰" },
          { id: "b8", token: "from college", role: "modifier", roleCn: "修饰语/介宾", explanation: "from介词短语修饰主句动作，指代来源" },
          { id: "b9", token: "Truth be told", role: "modifier", roleCn: "独立修饰", explanation: "插入语习惯用法，意为‘说实话’" },
          { id: "b10", token: "this is", role: "subject", roleCn: "主语+系动词", explanation: "指示代词作主，系动词连系后文表主表关系" },
          { id: "b11", token: "the closest", role: "object", roleCn: "表语", explanation: "形容词最高级作表语，后接省略that的定语从句" },
          { id: "b12", token: "I've ever gotten", role: "verb", roleCn: "谓语(从句)", explanation: "现在完成时 'have gotten'，ever作修饰语" },
          { id: "b13", token: "to a college graduation", role: "modifier", roleCn: "修饰链/介词", explanation: "修饰gotten/closest，to指向具体终点状态" }
        ]
      },
      {
        id: "jobs-s3",
        text: "The first story is about connecting the dots.",
        translation: "第一个故事是关于串联起生命中的点点滴滴（生命痕迹）。",
        syntaxBlocks: [
          { id: "b14", token: "The first story", role: "subject", roleCn: "主语", explanation: "定冠词限定最高级序数词加名词" },
          { id: "b15", token: "is", role: "verb", roleCn: "系动词", explanation: "一般现在时单三主系关系" },
          { id: "b16", token: "about connecting", role: "modifier", roleCn: "修饰/介宾", explanation: "连接动名词connecting作系表成分" },
          { id: "b17", token: "the dots", role: "object", roleCn: "宾语(动名词)", explanation: "名词作为动名词连接动作的承受者" }
        ]
      }
    ]
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits CH.3",
    contentType: "epub",
    durationOrPages: "12 Pages",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    progress: 10,
    sentences: [
      {
        id: "habits-s1",
        text: "Whenever you want to change your behavior, you can simply ask yourself: How can I make it obvious?",
        translation: "每当你想要改变你的行为习惯时，你可以简单地问问自己：我怎样才能让它变得显而易见？",
        syntaxBlocks: [
          { id: "b18", token: "Whenever", role: "modifier", roleCn: "引接状语", explanation: "引导时间状语从句" },
          { id: "b19", token: "you want to change", role: "verb", roleCn: "谓语", explanation: "want+to动词不定式" },
          { id: "b20", token: "your behavior", role: "object", roleCn: "宾语", explanation: "名词属性作直接宾语" },
          { id: "b21", token: "you can simply ask", role: "verb", roleCn: "主谓修饰", explanation: "情态动词can + 副词simply作动作修饰" },
          { id: "b22", token: "yourself", role: "object", roleCn: "反身代词", explanation: "作代词宾物，指代主语本身" },
          { id: "b23", token: "How can I make", role: "verb", roleCn: "疑问结构", explanation: "特殊疑问词引起的从句" },
          { id: "b24", token: "it obvious", role: "object", roleCn: "宾语+宾补", explanation: "代词it作宾语，形容词obvious作宾语补足语" }
        ]
      },
      {
        id: "habits-s2",
        text: "How can I make it attractive? How can I make it easy? How can I make it satisfying?",
        translation: "我怎样才能让它更有吸引力？怎样让它变得简单？怎样让它令人满足？",
        syntaxBlocks: [
          { id: "b25", token: "How can I make it", role: "subject", roleCn: "主谓动向", explanation: "特殊疑问主宾架构" },
          { id: "b26", token: "attractive / easy / satisfying", role: "object", roleCn: "宾语补足语", explanation: "形容词补足词，描述宾语状态" }
        ]
      }
    ]
  },
  {
    id: "huberman-labs",
    title: "Huberman Lab: Dopamine",
    contentType: "podcast",
    durationOrPages: "45:20",
    coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
    progress: 80,
    sentences: [
      {
        id: "podcast-s1",
        text: "Dopamine is a molecule of motivation and surprise.",
        translation: "多巴胺是一种代表动机和惊喜的神经分子。",
        syntaxBlocks: [
          { id: "b27", token: "Dopamine", role: "subject", roleCn: "主语", explanation: "专有名词多巴胺作句主" },
          { id: "b28", token: "is a molecule", role: "verb", roleCn: "主系表", explanation: "系表单数名词结构" },
          { id: "b29", token: "of motivation and surprise", role: "modifier", roleCn: "介词/形容词", explanation: "介词短语作后置修饰，说明分子属性" }
        ]
      }
    ]
  }
];

export const DEFAULT_VOCABULARIES: Vocabulary[] = [
  {
    id: "vocab-1",
    word: "graduated",
    phonetic: "/ˈɡrædʒueɪtɪd/",
    partOfSpeech: "v.",
    definition: "to successfully complete a degree at a university, college, or school.",
    definitionCn: "毕业；获得学位",
    example: "I never graduated from college.",
    color: "yellow",
    sentenceId: "jobs-s2",
    nestedWords: ["complete", "degree", "university", "college"],
    createdAt: 1780771200000
  },
  {
    id: "vocab-2",
    word: "obvious",
    phonetic: "/ˈɑːbviəs/",
    partOfSpeech: "adj.",
    definition: "easy to see, recognize, or understand without doubt.",
    definitionCn: "明显的；显然的",
    example: "How can I make it obvious?",
    color: "yellow",
    sentenceId: "habits-s1",
    nestedWords: ["easy", "recognize", "understand", "doubt"],
    createdAt: 1780771230000
  },
  {
    id: "vocab-3",
    word: "commencement",
    phonetic: "/kəˈmensmənt/",
    partOfSpeech: "n.",
    definition: "a ceremony at which academic degrees or diplomas are given to people who have graduated.",
    definitionCn: "毕业典礼",
    example: "Truth be told, this is the closest I've ever gotten to a college graduation.",
    color: "red",
    sentenceId: "jobs-s2",
    nestedWords: ["ceremony", "academic", "diploma", "graduated"],
    createdAt: 1780771260000
  },
  {
    id: "vocab-4",
    word: "satisfying",
    phonetic: "/ˈsætɪsfaɪɪŋ/",
    partOfSpeech: "adj.",
    definition: "giving pleasure because it provides something you need or want.",
    definitionCn: "令人满足的",
    example: "How can I make it satisfying?",
    color: "green",
    sentenceId: "habits-s2",
    nestedWords: ["pleasure", "provides", "need", "want"],
    createdAt: 1780771290000
  }
];
