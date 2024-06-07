// const ffmpeg = require('fluent-ffmpeg');
// const path = require('path');

// const getAudio = (videoPath, outputDir) => {
//     return new Promise((resolve, reject) => {
//         const outputAudioPath = path.join(outputDir, `${path.basename(videoPath, path.extname(videoPath))}.mp3`);
//         ffmpeg(videoPath)
//             .noVideo()
//             .audioCodec('libmp3lame')
//             .audioBitrate('128k')
//             .on('end', () => {
//                 console.log('Audio extraction completed:', outputAudioPath);
//                 resolve(outputAudioPath);
//             })
//             .on('error', (err) => {
//                 console.error('Error extracting audio:', err);
//                 reject(err);
//             })
//             .save(outputAudioPath);
//     });
// };

// module.exports = getAudio;



const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const getAudio = (videoPath, outputDir) => {
    return new Promise((resolve, reject) => {
        const outputAudioPath = path.join(outputDir, `${path.basename(videoPath, path.extname(videoPath))}.mp3`);
        
        ffmpeg(videoPath)
            .noVideo()
            .audioCodec('libmp3lame')
            .audioBitrate('320k') // Increased bitrate for better quality
            .audioChannels(2) // Stereo sound
            .audioFrequency(44100) // CD quality sample rate
            .on('end', () => {
                console.log('Audio extraction completed:', outputAudioPath);
                resolve(outputAudioPath);
            })
            .on('error', (err) => {
                console.error('Error extracting audio:', err);
                reject(err);
            })
            .save(outputAudioPath);
    });
};

module.exports = getAudio;

