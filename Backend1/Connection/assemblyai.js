// // transcriptionService.js

// const axios = require('axios');
// const fs = require('fs');
// const FormData = require('form-data');



// async function uploadAudio(filePath) {
//     const form = new FormData();
//     form.append('audio', fs.createReadStream(filePath));

//     const response = await axios.post('https://api.assemblyai.com/v2/upload', form, {
//         headers: {
//             'authorization': process.env.assembly_api_key,
//             ...form.getHeaders()
//         }
//     });

//     return response.data.upload_url;
// }

// async function transcribeAudio(audioUrl) {
//     const response = await axios.post('https://api.assemblyai.com/v2/transcript', {
//         audio_url: audioUrl,
//         speaker_labels: true
//     }, {
//         headers: {
//             'authorization': process.env.assembly_api_key,
//             'Content-Type': 'application/json'
//         }
//     });

//     return response.data.id;
// }

// async function getTranscriptionResult(transcriptionId) {
//     let status = 'processing';
//     let response;

//     while (status === 'processing') {
//         response = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptionId}`, {
//             headers: {
//                 'authorization': process.env.assembly_api_key
//             }
//         });

//         status = response.data.status;

//         if (status === 'completed') {
//             return response.data;
//         } else if (status === 'failed') {
//             throw new Error('Transcription failed');
//         }

//         // Wait for a few seconds before checking again
//         await new Promise(resolve => setTimeout(resolve, 5000));
//     }
// }

// async function generateMultiSpeakerTranscription(audioPath) {
//     try {
//         console.log('Uploading audio...');
//         const audioUrl = await uploadAudio(audioPath);
//         console.log('Audio uploaded. URL:', audioUrl);

//         console.log('Requesting transcription...');
//         const transcriptionId = await transcribeAudio(audioUrl);
//         console.log('Transcription requested. ID:', transcriptionId);

//         console.log('Waiting for transcription to complete...');
//         const transcriptionResult = await getTranscriptionResult(transcriptionId);
//         console.log('Transcription completed.');
//         const formattedTranscription = transcriptionResult.utterances.map(utterance => ({
//             speaker: utterance.speaker,
//             text: utterance.text,
//             confidence: utterance.confidence
//         }));

//         return formattedTranscription;

//         // return transcriptionResult;
//     } catch (error) {
//         console.error('Error generating transcription:', error.message);
//         throw error;
//     }
// }

// module.exports = {
//     generateMultiSpeakerTranscription
// };



const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { log } = require('console');

async function uploadAudio(filePath) {
    const form = new FormData();
    form.append('audio', fs.createReadStream(filePath));

    const response = await axios.post('https://api.assemblyai.com/v2/upload', form, {
        headers: {
            'authorization': process.env.assembly_api_key,
            ...form.getHeaders()
        }
    });

    return response.data.upload_url;
}

async function transcribeAudio(audioUrl,speakerLength) {
    console.log("Transcribe Audio Speaker Length",speakerLength);
    const response = await axios.post('https://api.assemblyai.com/v2/transcript', {
        audio_url: audioUrl,
        speaker_labels: true,
        speakers_expected: speakerLength
    }, {
        headers: {
            'authorization': process.env.assembly_api_key,
            'Content-Type': 'application/json'
        }
    });

    return response.data.id;
}

async function getTranscriptionResult(transcriptionId) {
    let status = 'processing';
    let response;

    while (status === 'processing') {
        response = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptionId}`, {
            headers: {
                'authorization': process.env.assembly_api_key
            }
        });

        status = response.data.status;

        if (status === 'completed') {
            return response.data;
        } else if (status === 'failed') {
            throw new Error('Transcription failed');
        }

        // Wait for a few seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

async function generateMultiSpeakerTranscription(audioPath,speakerLength) {
    try {
        console.log('Uploading audio...');
        const audioUrl = await uploadAudio(audioPath);
        console.log('Audio uploaded. URL:', audioUrl);

        console.log('Requesting transcription...');
        const transcriptionId = await transcribeAudio(audioUrl,speakerLength);
        console.log('Transcription requested. ID:', transcriptionId);

        console.log('Waiting for transcription to complete...');
        const transcriptionResult = await getTranscriptionResult(transcriptionId);
        console.log('Transcription completed.');

        // Format the transcription result to include timestamps
        const formattedTranscription = transcriptionResult.utterances.map(utterance => ({
            speaker: utterance.speaker,
            text: utterance.text,
            confidence: utterance.confidence,
            start: utterance.start,
            end: utterance.end
        }));

        // Generate plain text transcription
        const plainTextTranscription = formattedTranscription.map(u => u.text).join(' ');

        return {
            plainTextTranscription,
            transcriptionData: formattedTranscription
        };
    } catch (error) {
        console.error('Error generating transcription:', error.message);
        throw error;
    }
}

module.exports = {
    generateMultiSpeakerTranscription
};
