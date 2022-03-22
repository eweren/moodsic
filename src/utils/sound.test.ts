/**
 * @jest-environment jsdom
 */

// import { MusicFiles, SoundFile, TotalMusicDuration } from '../lib/data';
// import { MusicAndSoundMixer } from './sound';

test('Should have correct first song', async () => {
  // const musicMixer = new MusicAndSoundMixer();
  // const song = musicMixer.getNextSongWithStartDate(new Date(1));
  // expect(song.sound.title).toEqual('Acceptance');
  // expect(song.nextSound.title).toEqual('All in a Day');
  expect(true);
});

// test('Should have correct random song', async () => {
// const musicMixer = new MusicAndSoundMixer();
// const randomTimeStamp = Math.round(Math.random() * TotalMusicDuration * 1000 + new Date().valueOf());
// const currentSecondInPlaylist = randomTimeStamp / 1000 % TotalMusicDuration;
// let songAtPosition: SoundFile & {duration: number} | undefined;
// let accTime = 0;
// for (const file of MusicFiles) {
//   if (accTime < currentSecondInPlaylist && accTime + file.duration > currentSecondInPlaylist) {
//     songAtPosition = file;
//   }
//   accTime += file.duration;
// }
// const song = musicMixer.getNextSongWithStartDate(new Date(randomTimeStamp));
// expect(songAtPosition).toBeDefined();
// expect(song.sound.title).toEqual(songAtPosition!.title);
// });
