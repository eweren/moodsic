import { readable, writable } from 'svelte/store';
import type { SoundFile } from './data';
import { MusicAndSoundMixer } from '../utils/sound';

export const currentMusic = writable<SoundFile>(null);
export const soundAndMusicMixer = readable(new MusicAndSoundMixer());
