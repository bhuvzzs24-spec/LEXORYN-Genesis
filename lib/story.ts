import { storyScenes, type StoryScene, type StoryVector } from '@/data/story';

export interface StoryFrame {
  readonly sceneIndex: number;
  readonly localProgress: number;
  readonly scene: StoryScene;
  readonly start: number;
  readonly end: number;
}
export const normalizeStoryProgress = (value: number): number => Number.isNaN(value) ? 0 : Math.max(0, Math.min(1, value));
export const smoothStoryProgress = (value: number): number => { const t = normalizeStoryProgress(value); return t * t * (3 - 2 * t); };
export function getStoryDuration(scenes: readonly StoryScene[] = storyScenes): number {
  return scenes.reduce((sum, scene) => sum + scene.duration, 0);
}
export const totalStoryDuration = getStoryDuration();
/** All bounds are normalized, so scroll measurements can change without changing story timing. */
export const storyBounds = storyScenes.map((scene, index) => {
  const start = storyScenes.slice(0, index).reduce((sum, item) => sum + item.duration, 0) / totalStoryDuration;
  const end = index === storyScenes.length - 1 ? 1 : start + scene.duration / totalStoryDuration;
  return { start, end };
});
export function getStoryFrame(globalProgress: number): StoryFrame {
  const p = normalizeStoryProgress(globalProgress);
  const sceneIndex = storyBounds.findIndex((bound, index) => p < bound.end || index === storyBounds.length - 1);
  const { start, end } = storyBounds[sceneIndex];
  return { sceneIndex, localProgress: normalizeStoryProgress((p - start) / (end - start)), scene: storyScenes[sceneIndex], start, end };
}
/** Index is zero-based. Default lands just inside a beat, preserving its entrance choreography. */
export function progressForScene(index: number, localProgress = .08): number {
  const i = Math.floor(Math.max(0, Math.min(storyScenes.length - 1, Number.isNaN(index) ? 0 : index)));
  const { start, end } = storyBounds[i];
  return start + (end - start) * normalizeStoryProgress(localProgress);
}
const mixVector = (a: StoryVector, b: StoryVector, t: number): StoryVector => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
/** Stateless sampling makes camera motion exactly reversible at the same scroll position. */
export function sampleCamera(scene: StoryScene, progress: number): { position: StoryVector; target: StoryVector } {
  const p = normalizeStoryProgress(progress);
  const frames = scene.camera;
  if (frames.length === 0) return { position: [0, .2, 12], target: [0, 0, -8] };
  if (frames.length === 1 || p <= frames[0].at) return { position: frames[0].position, target: frames[0].target };
  let i = 0;
  while (i < frames.length - 2 && p > frames[i + 1].at) i += 1;
  const a = frames[i], b = frames[i + 1];
  const span = b.at - a.at;
  const t = span > 0 ? smoothStoryProgress((p - a.at) / span) : 1;
  return { position: mixVector(a.position, b.position, t), target: mixVector(a.target, b.target, t) };
}
