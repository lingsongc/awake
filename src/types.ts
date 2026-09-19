export type Mode = 'hallucination' | 'clean';

export type CharacterId = 'jun' | 'mum' | 'ravi' | 'aisyah';

export type CharacterVariant = 'monster' | 'human';

export type Position = 'left' | 'center' | 'right';

export type SceneType =
  | 'title'
  | 'dialogue'
  | 'search'
  | 'question_menu'
  | 'choice'
  | 'deduction'
  | 'cutscene'
  | 'casefile'
  | 'end';

export interface CharacterPortraitConfig {
  id: CharacterId;
  variant: CharacterVariant;
  position: Position;
  name: string;
  identifyingItem: string;
  imageSrc: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  characterId?: CharacterId;
}

export interface SceneChoice {
  id: string;
  text: string;
  nextSceneId: string;
  setFlags?: {
    shoved?: boolean;
    [key: string]: boolean | undefined;
  };
  addClue?: string;
}

export interface SceneCharacter {
  id: CharacterId;
  position: Position;
  variant?: CharacterVariant;
}

export interface Scene {
  id: string;
  type: SceneType;
  bg: 'bg_bedroom' | 'bg_living' | 'bg_hallway';
  mode: Mode;
  characters: SceneCharacter[];
  lines: DialogueLine[];
  nextSceneId?: string;
  choices?: SceneChoice[];
  choicePrompt?: string;
  titleData?: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  placeholderInfo?: string;
}

export interface GameFlags {
  steppedBack: boolean;
  shoved?: boolean;
}

export interface GameState {
  currentSceneId: string;
  currentLineIndex: number;
  mode: Mode;
  clues: string[];
  questioned: ('mum' | 'ravi' | 'aisyah')[];
  flags: GameFlags;
}

export interface AssetItem {
  filename: string;
  label: string;
  type: 'background' | 'character' | 'prop';
  expectedPath: string;
  requiredFor: string;
}

