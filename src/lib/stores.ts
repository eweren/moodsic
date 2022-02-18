import { readable, writable } from 'svelte/store';
import type { SoundFile } from './data';
import { MusicAndSoundMixer } from '../utils/sound';
import { SoundGenerator } from '../utils/soundGenerator';

export const currentMusic = writable<SoundFile | boolean>(null);
export const soundAndMusicMixer = readable(new MusicAndSoundMixer());
export const soundGenerator = readable(new SoundGenerator());
