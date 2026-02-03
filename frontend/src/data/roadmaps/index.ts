

import fiqhsyafii from "./fiqh-syafii.json";
import usulfiqh from "./usul-fiqh.json";
import nahwu from "./nahwu.json";
import sharaf from "./sharaf.json";
import balaghah from "./balaghah.json";
import hadits from "./hadits.json";
import aqidah from "./aqidah.json";
import tafsir from "./tafsir.json";
import ulumulquran from "./ulumul-quran.json";
import others from "./others.json";
import type { Roadmap } from "../../types/roadmap";

/**
 * JSON → re-type di boundary
 */
export const roadmaps = [
  fiqhsyafii,
  usulfiqh,
  nahwu,
  sharaf,
  balaghah,
  hadits,
  aqidah,
  tafsir,
  ulumulquran,
  others
] as Roadmap[];

/**
 * Helper
 */
export const getRoadmapByFieldId = (fieldId?: string) =>
  roadmaps.find(r => r.id === fieldId);
