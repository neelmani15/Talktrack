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
let count=0
const uploadToS3 = async (filePath, bucketName,meetingId) => {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Key: `recorded_video_MeetingId_${meetingId}.webm`,
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
    count=count+1
    console.log("i am executed for the first time",count)
    console.log(`File uploaded successfully. ${data.Location}`);
    return data.Location;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

module.exports = uploadToS3;
