import * as Tone from 'tone';
import '@tensorflow/tfjs-core';
import * as music_rnn from '@magenta/music/es6/music_rnn';
import '@magenta/music/es6/core';
import '@magenta/music/es6';
// ************************************
//           Constants
// ************************************

export const uiLoadingScreen = document.getElementById('loading');
export const startButton = document.getElementById('start');
export const loadingScreen = document.getElementById('loading');
export const loadingText = document.getElementById('loading-text');
export const stopButton = document.getElementById('stop');
export const toneWaves = new Tone.Waveform;

// ************************************
//           Instruments
// ************************************

export const chordSampler = new Tone.Sampler({
    urls: {
        'A1': '/patterns/audio/A1v10.mp3',
        'A2': '/patterns/audio/A2v10.mp3',
        'A3': '/patterns/audio/A3v10.mp3',
        // 'A4': '/patterns/audio/A4v10.mp3',
        // 'A4': '/patterns/piano/piano-A4.mp3',
        // 'A5': '/patterns/piano/piano-A5.mp3',
        // 'A6': '/patterns/piano/piano-A6.mp3'
    }
});

export const guitarSampler = new Tone.Sampler({
    urls: {
        'A5': '/patterns/pianov2/A5v8.mp3',
        'A6': '/patterns/pianov2/A6v8.mp3',
        'A7': '/patterns/pianov2/A7v8.mp3',
        'C6': '/patterns/pianov2/C6v8.mp3',
        'C7': '/patterns/pianov2/C7v8.mp3',
        'C8': '/patterns/pianov2/C8v8.mp3',
        'D6': '/patterns/pianov2/Ds6v8.mp3',
        'D7': '/patterns/pianov2/Ds7v8.mp3',
        'F6': '/patterns/pianov2/Fs6v8.mp3',
        'F7': '/patterns/pianov2/Fs7v8.mp3',
        // 'A3': '/patterns/guitar/guitar-A3.mp3',
        // 'C4': '/patterns/guitar/guitar-C4.mp3'
    }
});

export const drumPlayers = new Tone.Players({
    urls: {
        'Clap': '/patterns/drumkit/clap.wav',
        'HatClosed': '/patterns/drumkit/hatclosed.wav',
        'HatOpen': '/patterns/drumkit/hatopen.wav',
        'Kick': '/patterns/drumkit/kick2.wav',
        'Snare': '/patterns/drumkit/snare.wav',
        'Tom1': '/patterns/drumkit/tom1.wav',
        'Tom2': '/patterns/drumkit/tom2.wav',
        'Tom3': '/patterns/drumkit/tom3.wav',
        'Tom4': '/patterns/drumkit/tom4.wav',
    }
});

export const drumPatterns = [
    ['0:0:0', 'Kick'],
    ['0:0:0', 'HatClosed'],
    ['0:1:0', 'HatClosed'],
    ['0:2:0', 'HatClosed'],
    ['0:3:0', 'HatClosed'],
    ['0:4:0', 'Snare'],
    ['0:4:0', 'HatClosed'],
    ['0:5:0', 'HatClosed'],
    ['0:6:0', 'HatClosed'],
    ['0:7:0', 'Kick'],
    ['0:7:0', 'HatClosed'],
    ['0:8:0', 'Kick'],
    ['0:8:0', 'HatClosed'],
    ['0:9:0', 'HatClosed'],
    ['0:10:0', 'Snare'],
    ['0:10:0', 'HatClosed'],
    ['0:11:0', 'HatClosed'],
    ['0:12:0', 'Kick'],
    ['0:12:0', 'HatClosed'],
    ['0:12:2', 'Kick'],
    ['0:13:0', 'Kick'],
    ['0:13:2', 'Kick'],
    ['0:13:0', 'HatClosed'],
    ['0:14:0', 'HatClosed'],
    ['0:15:0', 'HatClosed'],
    ['4:0:0', 'Kick'],
    ['4:0:0', 'Tom1'],
    ['4:1:0', 'Tom2'],
    ['4:2:0', 'Tom3'],
    ['4:3:0', 'Tom4'],
    ['4:4:0', 'Snare'],
    ['4:4:0', 'HatClosed'],
    ['4:5:0', 'HatOpen'],
    ['4:6:0', 'HatClosed'],
    ['4:7:0', 'Kick'],
    ['4:7:0', 'HatOpen'],
    ['4:8:0', 'Kick'],
    ['4:8:0', 'HatClosed'],
    ['4:9:0', 'HatOpen'],
    ['4:10:0', 'Snare'],
    ['4:10:0', 'HatClosed'],
    ['4:11:0', 'HatOpen'],
    ['4:12:0', 'Kick'],
    ['4:12:0', 'HatClosed'],
    ['4:12:2', 'Kick'],
    ['4:13:0', 'Kick'],
    ['4:13:2', 'Kick'],
    ['4:13:0', 'HatClosed'],
    ['4:14:0', 'HatOpen'],
    ['4:15:0', 'HatClosed']
];

// ************************************
//             Effects
// ************************************

export const chordsVol = new Tone.Volume(-4);
export const chordsReverb = new Tone.Reverb(1.5);
chordSampler.chain(chordsVol, chordsReverb, Tone.Destination);

export const drumsVol = new Tone.Volume(4);
export const drumsReverb = new Tone.Reverb(1.5);
drumPlayers.chain(drumsVol, drumsReverb, Tone.Destination);

export const guitarVol = new Tone.Volume(10);
export const guitarReverb = new Tone.Reverb(1.5);
guitarSampler.chain(guitarVol, guitarReverb, Tone.Destination);

// ************************************
//            Patterns
// ************************************


export const chordPatterns = [
    ['0:0:0', 'D4'],
    ['0:0:0', 'F4'],
    ['0:0:0', 'A4'],
    ['0:0:0', 'C5'],
    ['0:0:0', 'E5'],
    ['0:0:0', 'G5'],

    ['0:0:4', 'D4'],
    ['0:0:6', 'F4'],
    ['0:0:8', 'A4'],
    ['0:0:10', 'C5'],
    ['0:0:12', 'E5'],
    ['0:0:14', 'G5'],

    ['1:0:0', 'D4'],
    ['1:0:0', 'G4'],
    ['1:0:0', 'Bb4'],
    ['1:0:0', 'D5'],
    ['1:0:0', 'F5'],
    ['1:0:0', 'Bb5'],

    ['1:0:8', 'D4'],
    ['1:0:6', 'G4'],
    ['1:0:4', 'Bb4'],
    ['1:0:12', 'D5'],
    ['1:0:14', 'F5'],
    ['1:0:10', 'Bb5'],

    ['2:0:0', 'D4'],
    ['2:0:0', 'F4'],
    ['2:0:0', 'A4'],
    ['2:0:0', 'C5'],
    ['2:0:0', 'E5'],
    ['2:0:0', 'G5'],

    ['2:0:4', 'D4'],
    ['2:0:5', 'F4'],
    ['2:0:5', 'A4'],
    ['2:0:4', 'C5'],
    ['2:0:9', 'E5'],
    ['2:0:9', 'G5'],

    // ['3:0:0', 'D#4'],
    // ['3:0:0', 'F#4'],
    // ['3:0:0', 'Bb4'],
    // ['3:0:0', 'C#5'],
    // ['3:0:0', 'F5'],
    // ['3:0:0', 'G#5'],

    ['2:0:0', 'D4'],
    ['2:0:0', 'F4'],
    ['2:0:0', 'A4'],
    ['2:0:0', 'C5'],
    ['2:0:0', 'E5'],
    ['2:0:0', 'G5'],

    // ['4:0:0', 'C#4'],
    // ['4:0:0', 'E4'],
    // ['4:0:0', 'G4'],
    // ['4:0:0', 'Bb4'],
    // ['4:0:0', 'C#5'],
    // ['4:0:0', 'E5'],
    // ['4:0:0', 'G5'],

    ['4:0:0', 'D4'],
    ['4:0:0', 'F4'],
    ['4:0:0', 'A4'],
    ['4:0:0', 'C5'],
    ['4:0:0', 'E5'],
    ['4:0:0', 'G5'],

    // new part
    ['5:0:0', 'D4'],
    ['5:0:0', 'F4'],
    ['5:0:0', 'A4'],
    ['5:0:0', 'C5'],
    ['5:0:0', 'E5'],
    ['5:0:0', 'G5'],

    ['5:0:4', 'D4'],
    ['5:0:6', 'F4'],
    ['5:0:8', 'A4'],
    ['5:0:10', 'C5'],
    ['5:0:12', 'E5'],
    ['5:0:14', 'G5'],

    ['6:0:0', 'D4'],
    ['6:0:0', 'G4'],
    ['6:0:0', 'Bb4'],
    ['6:0:0', 'D5'],
    ['6:0:0', 'F5'],
    ['6:0:0', 'Bb5'],

    ['6:0:8', 'D4'],
    ['6:0:6', 'G4'],
    ['6:0:4', 'Bb4'],
    ['6:0:12', 'D5'],
    ['6:0:14', 'F5'],
    ['6:0:10', 'Bb5'],

    ['7:0:0', 'D4'],
    ['7:0:0', 'F4'],
    ['7:0:0', 'A4'],
    ['7:0:0', 'C5'],
    ['7:0:0', 'E5'],
    ['7:0:0', 'G5'],

    ['7:0:4', 'D4'],
    ['7:0:5', 'F4'],
    ['7:0:5', 'A4'],
    ['7:0:4', 'C5'],
    ['7:0:9', 'E5'],
    ['7:0:9', 'G5'],

    // ['8:0:0', 'D#4'],
    // ['8:0:0', 'F#4'],
    // ['8:0:0', 'Bb4'],
    // ['8:0:0', 'C#5'],
    // ['8:0:0', 'F5'],
    // ['8:0:0', 'G#5'],

    ['8:0:0', 'D4'],
    ['8:0:0', 'F4'],
    ['8:0:0', 'A4'],
    ['8:0:0', 'C5'],
    ['8:0:0', 'E5'],
    ['8:0:0', 'G5'],

    // ['9:0:0', 'C#4'],
    // ['9:0:0', 'E4'],
    // ['9:0:0', 'G4'],
    // ['9:0:0', 'Bb4'],
    // ['9:0:0', 'C#5'],
    // ['9:0:0', 'E5'],
    // ['9:0:0', 'G5'],

    ['9:0:0', 'D4'],
    ['9:0:0', 'F4'],
    ['9:0:0', 'A4'],
    ['9:0:0', 'C5'],
    ['9:0:0', 'E5'],
    ['9:0:0', 'G5'],
];

export const guitarPatterns = [
    ["0:1:0", "G3"],
    ["0:1:2", "D3"],
    ["0:1:3", "D4"],
    ["2:1:0", "A3"],
    ["2:1:1", "G3"],
    ["2:1:2", "A3"],
    ["2:1:3", "D4"],
];

export const guitarChords = ['Dm11', 'Em11', 'Gm11', 'Am11']; // 'Dm11', 'Ebm11', 'C#dim7' ['Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'G7', 'Am7'],

export class SoundGenerator {
  private improvRNN: music_rnn.MusicRNN;
  private improvRNNLoaded: Promise<void>;

  constructor() {
    console.log("SoundGenerator loaded");
    this.improvRNN = new music_rnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
    this.improvRNNLoaded = this.improvRNN.initialize();
  }

  public generateSamples = async () => {
      const samples = [];
      for (let i = 0; i < 4; i++) {
          const sample = await this.generateNewSolo();
          samples.push(sample);
      }
      return samples;
  }

//   public generateSamplesPiano = async (pianoPart: keyof typeof chordPatterns) => {
//       const samples = [];
//       for (let i = 0; i < 2; i++) {
//           const sample = await this.generateNewSoloPiano(pianoPart);
//           samples.push(sample);
//       }
//       return samples;
//   }

  public generateNewSolo = async () => {
      await this.improvRNNLoaded;

      let sixteenthNoteTicks = Tone.Time('16n').toTicks();

      let original = {
          notes: chordPatterns.map(([time, note]) => ({
              pitch: Tone.Frequency(note).toMidi(),
              quantizedStartStep: Tone.Time(time).toTicks() / sixteenthNoteTicks,
              quantizedEndStep: Tone.Time(time).toTicks() / sixteenthNoteTicks + 1
          })),
          totalQuantizedSteps: 8,
          quantizationInfo: { stepsPerQuarter: 4 }
      }

      let steps = 64;       // can be used to control the chord duration
      let temperature = 1.05;    // anything above 1.5 will essentially result in random results
      let chordProgression = guitarChords;

      let result = await this.improvRNN.continueSequence(original, steps, temperature, chordProgression);

      let newPart = this.convertNotesToTone(result.notes);
      return newPart;
  }

//   public generateNewSoloPiano = async () => {
//       await this.improvRNNLoaded;

//       let sixteenthNoteTicks = Tone.Time('16n').toTicks();

//       let original = {
//           notes: chordPatterns.map(([time, note]) => ({
//               pitch: Tone.Frequency(note).toMidi(),
//               quantizedStartStep: Tone.Time(time).toTicks() / sixteenthNoteTicks,
//               quantizedEndStep: Tone.Time(time).toTicks() / sixteenthNoteTicks + 1
//           })),
//           totalQuantizedSteps: 32,
//           quantizationInfo: { stepsPerQuarter: 4 }
//       }

//       let steps = 64;
//       let temperature = 1.05;
//       let chordProgression = guitarChords;

//       let result = await this.improvRNN.continueSequence(original, steps, temperature, chordProgression);

//       let newPart = this.convertNotesToTone(result.notes);
//       return newPart;
//   }

  private convertNotesToTone(notes) {
      let newPattern = []
      for (let i = 0; i < notes.length; i++) {
          let toneTime = Tone.Time(notes[i].quantizedStartStep / 8).toBarsBeatsSixteenths();
          let toneNote = Tone.Frequency(notes[i].pitch, 'midi').toNote();
          newPattern.push([toneTime, toneNote]);
      }
      return newPattern;
  }


  // ************************************
  //          Music Controls
  // ************************************

  public async triggerSampleGeneration() {
      const samples = await this.generateSamples();
    //   const pianoSamples = await this.generateSamplesPiano(pianoPart);
      return [samples];
  };

  // set up tone transport for selected loops
  public loadLoops() {

      let chordPart = new Tone.Part((time, note) => {
          chordSampler.triggerAttackRelease(note, 6.0, time);
      }, chordPatterns).start();
      chordPart.loop = true;
      chordPart.loopStart = 0;
      chordPart.loopEnd = '8';

      let drumPart = new Tone.Part((time, drum) => {
          drumPlayers.player(drum).start(time);
      }, drumPatterns).start();
      drumPart.loop = true;
      drumPart.loopStart = 0;
      drumPart.loopEnd = '16';
  }
}
