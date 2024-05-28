require('dotenv').config();
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const { promisify } = require('util');
const OpenAI = require("openai");
const stat = promisify(fs.stat);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

const MAX_SEGMENT_SIZE_MB = 24 * 1024 * 1024; // 24MB

const getAudioFileSize = async (filePath) => {
  const stats = await stat(filePath);
  return stats.size;
};

const getAudioDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata.format.duration);
    });
  });
};

const splitAudioFile = async (filePath, segmentSizeMB) => {
  const segments = [];
  const segmentDuration = (segmentSizeMB / (await getAudioFileSize(filePath))) * (await getAudioDuration(filePath));
  const outputTemplate = `${filePath}_segment_%03d.wav`;

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions('-f segment')
      .outputOptions(`-segment_time ${segmentDuration}`)
      .outputOptions('-c copy')
      .on('end', () => {
        // Collect generated segments
        let index = 0;
        while (true) {
          const segmentPath = outputTemplate.replace('%03d', String(index).padStart(3, '0'));
          if (fs.existsSync(segmentPath)) {
            segments.push(segmentPath);
            index++;
          } else {
            break;
          }
        }
        resolve(segments);
      })
      .on('error', (err) => reject(err))
      .save(outputTemplate);
  });
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const GetTranscript = async (audiopath) => {
  const fileSize = await getAudioFileSize(audiopath);
  console.log("Audio file size: ", fileSize);

  if (fileSize > MAX_SEGMENT_SIZE_MB) {
    console.log("Splitting audio file...");
    const segments = await splitAudioFile(audiopath, MAX_SEGMENT_SIZE_MB);
    let combinedTranscription = '';

    console.log("Processing segments: ", segments);
    for (const segment of segments) {
      try {
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(segment),
          model: 'whisper-1',
          language: 'en',
        });
        console.log("Transcription for segment: ", segment, transcription.text);
        combinedTranscription += transcription.text + ' ';
      } catch (err) {
        console.error("Error transcribing segment: ", segment, err);
      } finally {
        fs.unlinkSync(segment); // Clean up the segment file
      }
    }

    // Post-process to remove excessive dots and whitespace
    combinedTranscription = combinedTranscription.replace(/\.+/g, ' ').trim();

    console.log("Combined transcription: ", combinedTranscription);
    return combinedTranscription;
  } else {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audiopath),
        model: 'whisper-1',
        language: 'en',
      });
      console.log("Transcription: ", transcription.text);
      
      // Post-process to remove excessive dots
      const cleanedTranscription = transcription.text.replace(/\.+/g, ' ').trim();
      return cleanedTranscription;
    } catch (err) {
      console.error("Error transcribing audio file: ", err);
      throw err;
    }
  }
};



module.exports = GetTranscript;
