// ============================================================================
// Exploration Mode Type Definitions
// ============================================================================

export enum SceneType {
  GAME_INTRO = 'GAME_INTRO',
  STARMAP = 'STARMAP',
  INTRO = 'INTRO',
  OBSERVATION = 'OBSERVATION',
  CHARACTER_INTRO_TYCHO = 'CHARACTER_INTRO_TYCHO',
  DIALOGUE_TYCHO = 'DIALOGUE_TYCHO',
  HEIST = 'HEIST',
  CHARACTER_INTRO_KEPLER = 'CHARACTER_INTRO_KEPLER',
  DIALOGUE_KEPLER = 'DIALOGUE_KEPLER',
  CALCULATION = 'CALCULATION',
  CINEMATIC_REVEAL = 'CINEMATIC_REVEAL',
  CONCLUSION = 'CONCLUSION',
}

export enum Character {
  TYCHO = '第谷·布拉赫',
  KEPLER = '约翰内斯·开普勒',
  AI = '档案馆中枢',
}

export interface DialogueMessage {
  sender: Character | '玩家';
  text: string;
}

export interface HeistOption {
  id: string;
  text: string;
  risk: number;
  requiredTrust?: number;
}
