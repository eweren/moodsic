import { sleep } from './utils';
import {
  MusicFiles,
  SoundFile,
  Sounds,
  TotalMusicDuration,
} from '../lib/data';
import { currentMusic } from '../lib/stores';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext as AudioContext;
export const SavedGainKey = 'savedGain';
let audioContext: AudioContext | null = null;
let globalGainNode: GainNode | null = null;

/**
 * Returns the audio context. If non is present, it will create one.
 */
export function getAudioContext(): AudioContext {
  if (audioContext == null) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Returns the global gain node. If non is present, it will create one.
 */
export function getGlobalGainNode(): GainNode {
  if (globalGainNode == null) {
    const tempAudioContext = getAudioContext();
    globalGainNode = tempAudioContext.createGain();
    globalGainNode.gain.setValueAtTime(0.7, tempAudioContext.currentTime);
    globalGainNode.connect(tempAudioContext.destination);
  }

  return globalGainNode;
}

/**
 * A partly static and partly dynamic class for handling states of sounds and music. Since build as singleton, it should
 * be used as in example.
 * @example
 * const musicMixer = MusicAndSoundMixer.getMixerInstance();
 * await musicMixer.playMusic();
 */
export class MusicAndSoundMixer {
  public sounds = Sounds;
  public activeSounds: Array<string> = [];
  public get isPlayingMusic(): boolean {
    return this.musicNode?.isPlaying ?? false;
  }
  public soundNodes: Array<Sound> = [];
  public musicNode?: Sound;
  public musicVolume: number;
  private audio = document.createElement('audio');
  private playPromise: Promise<void> | null = null;

  private music: SoundFile;

  public constructor() {
    this.musicVolume = parseFloat(localStorage.getItem(SavedGainKey) ?? '0.5');
    currentMusic.subscribe((m) => {
      this.music = m;
    });
  }

  /**
   * Based on the local time, this method will play the current song of the playlist. For seamless playback, the next
   * song will already be preloaded. After the track has ended, this method will be invoked again and since the next
   * song was already cached, it will be played without any delay.
   */
  public async playMusic(next = false, prev = false, loop = true): Promise<void> {
    if (this.musicNode?.isPlaying && !loop) {
      return;
    }
    const { sound, nextSound, startDate } = next ? this.getNextSong() : prev ? this.getPrevSong() : this.getNextSongWithStartDate();
    currentMusic.set(sound);

    this.musicNode = await Sound.load(`music/${sound.src}`, this.musicVolume, 'music');
    // Preload next song asynchronously.
    Sound.load(`music/${nextSound.src}`, this.musicVolume, 'music');

    const offset = (new Date().valueOf() - startDate.valueOf()) / 1000;
    if (this.musicNode) {
      this.musicNode.setVolume(this.musicVolume);
      await this.musicNode.play(offset);
      this.playPromise = this._playFakeAudio();
      this.musicNode.source.addEventListener('ended', () => {
        if (!this.audio.paused) {
          this.playMusic(true);
        }
      });
    }
  }

  public async playNextSong(): Promise<void> {
    await this.playMusic(true);
  }

  public async playPreviousSong(): Promise<void> {
    await this.playMusic(false, true);
  }

  private async _playFakeAudio(): Promise<void> {
    this.audio.src = 'sounds/silence.ogg';
    this.audio.loop = true;
    await this.audio.play();
    this._updateMetadata();
  }

  private _updateMetadata() {
    navigator.mediaSession.metadata = new MediaMetadata({
      artist: this.music?.artist,
      title: this.music?.title,
    });
    navigator.mediaSession.setActionHandler('play', () => {
      this.playMusic();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      this.stopMusic();
    });

    // Media is loaded, set the duration.
    this._updatePositionState();
  }
  private _updatePositionState() {
    if ('setPositionState' in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: this.music?.duration,
        position: 0,
      });
    }
  }

  /**
   * Plays the sound at the given source with aa predefined volume.
   * @param src the source of the sound
   * @param volume the volume of the sound. Defaults to 0.3.
   */
  public async playSound(src: string, volume = 0.3): Promise<void> {
    this.activeSounds.push(src);
    if (this.soundNodes.find((n) => n.src === src)) {
      return;
    }
    const soundNode = await Sound.load(`sounds/${src}`);

    if (soundNode) {
      soundNode.setVolume(volume);
      await soundNode.play();
      this.soundNodes.push(soundNode);
    }
  }

  /**
   * Stops the currently playing music.
   */
  public async stopMusic(): Promise<void> {
    if (this.playPromise !== undefined) {
      currentMusic.set(null);
      await this.playPromise;
      this.audio.pause();
      this.musicNode?.stop();
    }
    navigator.mediaSession.playbackState = 'paused';
  }

  /**
   * Based on the local time, this method will return the current and next song of the playlist as well as the
   * calculated startDate of the currentSong.
   */
  public getNextSongWithStartDate(overrideStartDate?: Date): { sound: SoundFile, startDate: Date, nextSound: SoundFile } {
    const currentDateSeconds = (overrideStartDate ? overrideStartDate.valueOf() : new Date().valueOf()) / 1000;
    const currentSecondInPlaylist = currentDateSeconds % TotalMusicDuration;
    let relevantSong = MusicFiles[0];
    let accDuration = 0;
    let currentSongSecondOffset = 0;
    const startDate = new Date();
    for (const music of MusicFiles) {
      if (accDuration < currentSecondInPlaylist && accDuration + music.duration > currentSecondInPlaylist) {
        relevantSong = music;
        currentSongSecondOffset = currentSecondInPlaylist - accDuration;
        startDate.setSeconds(startDate.getSeconds() - currentSongSecondOffset);
        break;
      }
      accDuration += music.duration;
    }
    return { nextSound: MusicFiles[MusicFiles.indexOf(relevantSong) + 1] ?? MusicFiles[0], sound: relevantSong, startDate };
  }

  /**
   * Gets the next song in the playlist.
   */
  public getNextSong(): { sound: SoundFile, startDate: Date, nextSound: SoundFile } {
    let index = 0;
    for (const music of MusicFiles) {
      index++;
      if (music === this.music) {
        break;
      }
    }
    this.stopMusic();
    return { nextSound: MusicFiles[index + 1] ?? MusicFiles[0], sound: MusicFiles[index] ?? MusicFiles[0], startDate: new Date() };
  }

  /**
   * Gets the previous song in the playlist.
   */
  public getPrevSong(): { sound: SoundFile, startDate: Date, nextSound: SoundFile } {
    let index = 0;
    for (const music of MusicFiles) {
      if (music.src === this.music.src) {
        break;
      }
      index++;
    }
    this.stopMusic();
    return {
      nextSound: MusicFiles[index - 2] ?? MusicFiles[MusicFiles.length - 2],
      sound: MusicFiles[index - 1] ?? MusicFiles[MusicFiles.length - 1],
      startDate: new Date(),
    };
  }

  /** Sets the volume for the sound with the given src or the music if no src is given. */
  async setVolume(value: number, src?: string) {
    let nodeToAdjust;
    if (!src && this.musicNode) {
      this.musicVolume = value;
      localStorage.setItem(SavedGainKey, `${this.musicVolume}`);
      nodeToAdjust = this.musicNode;
    } else if (src) {
      if (!this.activeSounds.includes(src)) {
        await this.playSound(src, value);
        return;
      }
      nodeToAdjust = this.soundNodes.find((n) => n.src.includes(src));
    }
    nodeToAdjust?.setVolume(value);
  }
}

/**
 * A wrapper for the Web Audio API. It will load the given sound and play it.
 * To create a sound, use the static method Sound.load.
 * @example
 * const sound = await Sound.load('sounds/test.ogg');
 * sound.play();
 */
export class Sound {
  public readonly source: AudioBufferSourceNode;
  private gainNode: GainNode = new GainNode(getAudioContext());
  public isPlaying = false;

  private constructor(private readonly buffer: AudioBuffer, public src: string, volume?: number, type: 'sound' | 'music' = 'sound') {
    if (volume) {
      this.setVolume((volume));
    }
    this.gainNode.connect(getGlobalGainNode());
    this.source = getAudioContext().createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    if (type === 'sound') {
      this.source.loop = true;
    } else {
      this.source.loop = false;
    }
  }

  /**
   * Loads the sound at the given src.
   * @param src the src of the sound
   * @param volume the volume of the sound.
   * @param type can be either sound or music. If it is of type music, only one music can be played at a time.
   * @returns the newly created sound as a promise
   */
  public static async load(src: string, volume?: number, type?: 'sound' | 'music'): Promise<Sound> {
    const arrayBuffer = await (await fetch(src, { cache: 'force-cache' })).arrayBuffer();

    return new Promise((resolve, reject) => {
      getAudioContext().decodeAudioData(arrayBuffer,
        (buffer) => resolve(new Sound(buffer, src, volume, type)),
        (error) => reject(error));
    });
  }

  /**
   * Plays the sound with the given parameters.
   * @param offset The offset after which to play the sound in seconds.
   */
  public async play(offset?: number): Promise<void> {
    if (offset) {
      await sleep(offset);
    }
    if (!this.isPlaying) {
      this.source.start(undefined, offset);
      this.isPlaying = true;
    }
  }

  /** This will stop the sound from playing. */
  public stop(): void {
    if (this.source && this.isPlaying) {
      try {
        this.isPlaying = false;
        this.source.stop();
        this.source.disconnect();
      } catch (e) {
        console.log('COULD NOT BE STOPPED: ', e);
      }
    }
  }

  /**
   * Sets the volume and if given also the direction of a sound.
   */
  public setVolume(volume: number): void {
    this.gainNode.gain.value = volume;
    this.gainNode.gain.setValueAtTime(volume, this.source?.context.currentTime ?? 0);
  }
}
