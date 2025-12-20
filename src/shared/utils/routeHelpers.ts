// ============================================================================
// Route Helper Utilities
// ============================================================================

import { ModeType } from '../types/common';
import { ROUTES } from '@/config/constants';

/**
 * Maps a route path to a ModeType
 */
export const pathToMode = (path: string): ModeType => {
  switch (path) {
    case ROUTES.EXAM_PREP:
      return ModeType.EXAM_PREP;
    case ROUTES.TOPIC:
      return ModeType.TOPIC;
    case ROUTES.EXPLORATION:
      return ModeType.EXPLORATION;
    case ROUTES.HOME:
    default:
      return ModeType.HOME;
  }
};

/**
 * Maps a ModeType to a route path
 */
export const modeToPath = (mode: ModeType): string => {
  switch (mode) {
    case ModeType.EXAM_PREP:
      return ROUTES.EXAM_PREP;
    case ModeType.TOPIC:
      return ROUTES.TOPIC;
    case ModeType.EXPLORATION:
      return ROUTES.EXPLORATION;
    case ModeType.HOME:
    default:
      return ROUTES.HOME;
  }
};

/**
 * Checks if a path is a valid route
 */
export const isValidRoute = (path: string): boolean => {
  return Object.values(ROUTES).includes(path as any);
};

/**
 * Gets the current mode from the window location
 */
export const getCurrentMode = (): ModeType => {
  if (typeof window === 'undefined') {
    return ModeType.HOME;
  }
  return pathToMode(window.location.pathname);
};

/**
 * Navigates to a specific mode
 */
export const navigateToMode = (mode: ModeType): void => {
  if (typeof window !== 'undefined') {
    const path = modeToPath(mode);
    window.history.pushState({}, '', path);
  }
};
