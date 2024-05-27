require('dotenv').config();

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
const fs = require('fs');

// Configure AWS SDK
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv() // Automatically fetch credentials from environment variables
});



const uploadAudioToS3 = async (filePath, bucketName, meetingId) => {
    const fileStream = fs.createReadStream(filePath);
  
    const uploadParams = {
      Bucket: bucketName,
      Key: `audio/recorded_audio_MeetingId_${meetingId}.mp3`, // Adjust the extension based on your audio file type
      Body: fileStream,
    };
  
    try {
      const parallelUploads3 = new Upload({
        client: s3Client,
        params: uploadParams
      });
  
      parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
      });
  
      const data = await parallelUploads3.done();
      console.log(`Audio file uploaded successfully. ${data.Location}`);
      return data.Location;
    } catch (error) {
      console.error("Error uploading audio file:", error);
      throw error;
    }
  };


  module.exports =uploadAudioToS3;