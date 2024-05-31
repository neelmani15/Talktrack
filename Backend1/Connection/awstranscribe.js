require('dotenv').config();
const { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand,ListTranscriptionJobsCommand} = require('@aws-sdk/client-transcribe');
const { fromEnv } = require('@aws-sdk/credential-provider-env');

// Configure AWS Transcribe Client
const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv() 
});

const startTranscriptionJob = async (audioFileUri, meetingId) => {
  const jobName = `transcription-job-${meetingId}`;
  
  const params = {
    TranscriptionJobName: jobName,
    LanguageCode: 'en-US', // Adjust based on your audio language
    Media: {
      MediaFileUri: audioFileUri // S3 URI of the uploaded audio file
    },
    OutputBucketName: process.env.S3_BUCKET_NAME, // The bucket where transcription output will be stored
    OutputKey: `transcriptions/${meetingId}.json`,
    Settings: {
        "ShowSpeakerLabels": true,
        "MaxSpeakerLabels": 15,  // Max speaker in meeetings
        "ChannelIdentification": false,
        "ShowAlternatives": false
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

const getTranscriptionResult = async (jobName) => {
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
      return transcriptUri;
    } else {
      throw new Error(`Transcription job failed with status: ${response.TranscriptionJob.TranscriptionJobStatus}`);
    }
  } catch (error) {
    console.error("Error fetching transcription result:", error);
    throw error;
  }
};

const checkTranscriptionJobExists = async (jobName) => {
    try {
      const command = new ListTranscriptionJobsCommand({});
      const response = await transcribeClient.send(command);
  
      // Check if the job name exists in the list of transcription jobs
      const jobExists = response.TranscriptionJobSummaries.some(summary => summary.TranscriptionJobName === jobName);

    //   console.log(jobExists);
      return jobExists;
    } catch (error) {
      console.error("Error checking transcription job existence:", error);
      throw error;
    }
  };

module.exports = {
  startTranscriptionJob,
  getTranscriptionResult,
  checkTranscriptionJobExists
};