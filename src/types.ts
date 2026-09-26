export type LanguageKey = 'ne' | 'hi' | 'en' | 'auto';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male';
  nepaliTitle: string;
  englishTitle: string;
  descriptionNe: string;
  descriptionEn: string;
  tag: string;
  tagColor: string;
}

export interface StyleOption {
  id: string;
  labelNe: string;
  labelEn: string;
  descriptionNe: string;
  descriptionEn: string;
  iconName: string;
}

export interface GeneratedClip {
  id: string;
  text: string;
  voice: string;
  style: string;
  language: LanguageKey;
  audioUrl: string;
  audioBase64: string;
  durationEstimated: number;
  timestamp: number;
  isDialogue?: boolean;
}

export interface DialogueSpeakerConfig {
  name: string;
  voice: string;
  style: string;
  lines: string[];
}
