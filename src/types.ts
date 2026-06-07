export interface SyntaxBlock {
  id: string;
  token: string;
  role: 'subject' | 'verb' | 'object' | 'modifier' | 'other';
  roleCn: string;
  explanation: string;
}

export interface Sentence {
  id: string;
  text: string;
  translation: string;
  syntaxBlocks: SyntaxBlock[];
}

export interface Lesson {
  id: string;
  title: string;
  contentType: 'podcast' | 'video' | 'epub';
  durationOrPages: string;
  coverImage: string;
  sentences: Sentence[];
  progress: number; // percentage completed
}

export interface Vocabulary {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  definition: string;
  definitionCn: string;
  example: string;
  color: 'green' | 'yellow' | 'red' | null;
  sentenceId?: string;
  nestedWords?: string[]; // keywords in definition to look up next
  createdAt: number;
}

export interface UserStats {
  streak: number;
  totalTokens: number;
  wordCounts: {
    green: number; // known
    yellow: number; // core
    red: number; // hard
  };
}

export interface UserSettings {
  zenModeDefault: boolean;
  whiteNoise: boolean;
  oledContrast: boolean;
}
