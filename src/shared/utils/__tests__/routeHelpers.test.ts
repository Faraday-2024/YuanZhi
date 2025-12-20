import { describe, it, expect } from 'vitest';
import { pathToMode, modeToPath } from '../routeHelpers';
import { ModeType } from '../../types/common';
import { ROUTES } from '@/config/constants';

describe('routeHelpers', () => {
  describe('pathToMode', () => {
    it('should convert home path to HOME mode', () => {
      expect(pathToMode(ROUTES.HOME)).toBe(ModeType.HOME);
    });

    it('should convert exam-prep path to EXAM_PREP mode', () => {
      expect(pathToMode(ROUTES.EXAM_PREP)).toBe(ModeType.EXAM_PREP);
    });

    it('should convert topic path to TOPIC mode', () => {
      expect(pathToMode(ROUTES.TOPIC)).toBe(ModeType.TOPIC);
    });

    it('should convert exploration path to EXPLORATION mode', () => {
      expect(pathToMode(ROUTES.EXPLORATION)).toBe(ModeType.EXPLORATION);
    });

    it('should return HOME for unknown paths', () => {
      expect(pathToMode('/unknown')).toBe(ModeType.HOME);
    });
  });

  describe('modeToPath', () => {
    it('should convert HOME mode to home path', () => {
      expect(modeToPath(ModeType.HOME)).toBe(ROUTES.HOME);
    });

    it('should convert EXAM_PREP mode to exam-prep path', () => {
      expect(modeToPath(ModeType.EXAM_PREP)).toBe(ROUTES.EXAM_PREP);
    });

    it('should convert TOPIC mode to topic path', () => {
      expect(modeToPath(ModeType.TOPIC)).toBe(ROUTES.TOPIC);
    });

    it('should convert EXPLORATION mode to exploration path', () => {
      expect(modeToPath(ModeType.EXPLORATION)).toBe(ROUTES.EXPLORATION);
    });
  });
});
