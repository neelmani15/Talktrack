// // transcribeService.js
// require('dotenv').config();
// const { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');
// const { fromEnv } = require('@aws-sdk/credential-provider-env');

// // Configure AWS Transcribe Client
// const transcribeClient = new TranscribeClient({
//   region: process.env.AWS_REGION,
//   credentials: fromEnv() 
// });

// const startTranscriptionJob = async (audioFileUri, bucketName, meetingId) => {
//   const jobName = `transcription-job-${meetingId}`;
  
//   const params = {
//     TranscriptionJobName: jobName,
//     LanguageCode: 'en-US', // Adjust based on your audio language
//     Media: {
//       MediaFileUri: audioFileUri // S3 URI of the uploaded audio file
//     },
//     OutputBucketName: `${process.env.S3_BUCKET_NAME}/transcripts`, // The bucket where transcription output will be stored
//     Settings: {
//       ShowSpeakerLabels: true,
//       MaxSpeakerLabels: 2 // Adjust based on the number of speakers
//     }
//   };

//   try {
//     const command = new StartTranscriptionJobCommand(params);
//     const response = await transcribeClient.send(command);
//     console.log(`Transcription job started: ${response.TranscriptionJob.TranscriptionJobName}`);
//     return response.TranscriptionJob.TranscriptionJobName;
//   } catch (error) {
//     console.error("Error starting transcription job:", error);
//     throw error;
//   }
// };

// const getTranscriptionResult = async (jobName) => {
//   const params = {
//     TranscriptionJobName: jobName
//   };

//   try {
//     const command = new GetTranscriptionJobCommand(params);
//     let response = await transcribeClient.send(command);
//     while (response.TranscriptionJob.TranscriptionJobStatus === 'IN_PROGRESS') {
//       console.log('Transcription job is still in progress...');
//       await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
//       response = await transcribeClient.send(command);
//     }

//     if (response.TranscriptionJob.TranscriptionJobStatus === 'COMPLETED') {
//       console.log('Transcription job completed successfully.');
//       const transcriptUri = response.TranscriptionJob.Transcript.TranscriptFileUri;
//       return transcriptUri;
//     } else {
//       throw new Error(`Transcription job failed with status: ${response.TranscriptionJob.TranscriptionJobStatus}`);
//     }
//   } catch (error) {
//     console.error("Error fetching transcription result:", error);
//     throw error;
//   }
// };

// module.exports = {
//   startTranscriptionJob,
//   getTranscriptionResult
// };

// transcribeService.js
// require('dotenv').config();
// const { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');
// const { fromEnv } = require('@aws-sdk/credential-provider-env');

// // Configure AWS Transcribe Client
// const transcribeClient = new TranscribeClient({
//   region: process.env.AWS_REGION,
//   credentials: fromEnv() 
// });

// const startTranscriptionJob = async (audioFileUri, bucketName, meetingId) => {
//   const jobName = `transcription-job-${meetingId}`;
  
//   const params = {
//     TranscriptionJobName: jobName,
//     LanguageCode: 'en-US', // Adjust based on your audio language
//     Media: {
//       MediaFileUri: audioFileUri // S3 URI of the uploaded audio file
//     },
//     OutputBucketName: `${process.env.S3_BUCKET_NAME}`, // The bucket and folder where transcription output will be stored
//     OutputKey: `transcriptions/${meetingId}.json`,
//     Settings: {
//       ShowSpeakerLabels: true,
//       MaxSpeakerLabels: 2 // Adjust based on the number of speakers
//     }
//   };

//   try {
//     const command = new StartTranscriptionJobCommand(params);
//     const response = await transcribeClient.send(command);
//     console.log(`Transcription job started: ${response.TranscriptionJob.TranscriptionJobName}`);
//     return response.TranscriptionJob.TranscriptionJobName;
//   } catch (error) {
//     console.error("Error starting transcription job:", error);
//     throw error;
//   }
// };

// const getTranscriptionResult = async (jobName) => {
//   const params = {
//     TranscriptionJobName: jobName
//   };

//   try {
//     const command = new GetTranscriptionJobCommand(params);
//     let response = await transcribeClient.send(command);
//     while (response.TranscriptionJob.TranscriptionJobStatus === 'IN_PROGRESS') {
//       console.log('Transcription job is still in progress...');
//       await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
//       response = await transcribeClient.send(command);
//     }

//     if (response.TranscriptionJob.TranscriptionJobStatus === 'COMPLETED') {
//       console.log('Transcription job completed successfully.');
//       const transcriptUri = response.TranscriptionJob.Transcript.TranscriptFileUri;
//       return transcriptUri;
//     } else {
//       throw new Error(`Transcription job failed with status: ${response.TranscriptionJob.TranscriptionJobStatus}`);
//     }
//   } catch (error) {
//     console.error("Error fetching transcription result:", error);
//     throw error;
//   }
// };

// module.exports = {
//   startTranscriptionJob,
//   getTranscriptionResult
// };


require('dotenv').config();
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
const fs = require('fs');
const path = require('path');

// Configure AWS Clients
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv()
});

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv() 
});

const startTranscriptionJob = async (audioFileUri, bucketName, meetingId) => {
  const jobName = `transcription-job-${meetingId}`;
  
  const params = {
    TranscriptionJobName: jobName,
    LanguageCode: 'en-US', // Adjust based on your audio language
    Media: {
      MediaFileUri: audioFileUri // S3 URI of the uploaded audio file
    },
    OutputBucketName: `${process.env.S3_BUCKET_NAME}`, // The bucket and folder where transcription output will be stored
    OutputKey: `transcriptions/${meetingId}.json`,
    Settings: {
      ShowSpeakerLabels: true,
      MaxSpeakerLabels: 2 // Adjust based on the number of speakers
    }
  };

  try {
    const command = new StartTranscriptionJobCommand(params);
    const response = await transcribeClient.send(command);
    console.log(`Transcription job started: ${response.TranscriptionJob.TranscriptionJobName}`);
    return response.TranscriptionJob.TranscriptionJobName;
  } catch (error) {
    console.error("Error starting transcription job:", error);
    throw error;
  }
};

const getTranscriptionResult = async (jobName,meetingId) => {
  const params = {
    TranscriptionJobName: jobName
  };

  try {
    const command = new GetTranscriptionJobCommand(params);
    let response = await transcribeClient.send(command);
    while (response.TranscriptionJob.TranscriptionJobStatus === 'IN_PROGRESS') {
      console.log('Transcription job is still in progress...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
      response = await transcribeClient.send(command);
    }

    if (response.TranscriptionJob.TranscriptionJobStatus === 'COMPLETED') {
      console.log('Transcription job completed successfully.');
      const transcriptUri = response.TranscriptionJob.Transcript.TranscriptFileUri;
      const transcriptKey = `transcriptions/${meetingId}.json`;
      const downloadPath = path.join(__dirname, `${meetingId}.json`);

      await downloadTranscriptFromS3(process.env.S3_BUCKET_NAME, transcriptKey, downloadPath);
      const { transcriptText, speakerSegments } = parseTranscriptFile(downloadPath);
      return { transcriptText, speakerSegments };
    } else {
      throw new Error(`Transcription job failed with status: ${response.TranscriptionJob.TranscriptionJobStatus}`);
    }
  } catch (error) {
    console.error("Error fetching transcription result:", error);
    throw error;
  }
};
const downloadTranscriptFromS3 = async (bucketName, transcriptKey, downloadPath) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: transcriptKey
    };
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const fileStream = fs.createWriteStream(downloadPath);
    return new Promise((resolve, reject) => {
      response.Body.pipe(fileStream);
      response.Body.on('error', reject);
      fileStream.on('finish', resolve);
    });
  } catch (error) {
    console.error("Error downloading transcription file from S3:", error);
    throw error;
  }
};

// const parseTranscriptFile = (filePath) => {
//   const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//   const transcriptText = data.results.transcripts.map(t => t.transcript).join('\n');
//   const speakerSegments = data.results.speaker_labels.segments;

//   return { transcriptText, speakerSegments };
// };
const parseTranscriptFile = (filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const transcriptText = data.results.transcripts.map(t => t.transcript).join('\n');
  const speakerSegments = data.results.speaker_labels.segments;
  const items = data.results.items;

  // Combine the words with speaker labels based on timestamps
  const combinedSegments = speakerSegments.map(segment => {
    const words = items
      .filter(item => item.start_time && item.end_time && item.start_time >= segment.start_time && item.end_time <= segment.end_time)
      .map(item => ({
        start_time: item.start_time,
        end_time: item.end_time,
        content: item.alternatives[0].content
      }));

    return {
      start_time: segment.start_time,
      end_time: segment.end_time,
      speaker_label: segment.speaker_label,
      words: words
    };
  });

  return { transcriptText, combinedSegments };
};


module.exports = {
  startTranscriptionJob,
  getTranscriptionResult
};

