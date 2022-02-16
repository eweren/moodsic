import { readable, writable } from 'svelte/store';
import { MusicAndSoundMixer } from '../utils/sound';
import type { SoundFile } from './data';

export const currentMusic = writable<SoundFile>(null);
export const soundAndMusicMixer = readable(new MusicAndSoundMixer());
