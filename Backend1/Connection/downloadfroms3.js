require('dotenv').config();

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
const fs = require('fs');
const path = require('path');

// Configure AWS SDK
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv() // Automatically fetch credentials from environment variables
});

const downloadvideoFromS3 = async (bucketName, meetingId, downloadPath) => {
  const downloadParams = {
    Bucket: bucketName,
    Key: `videos/recorded_video_MeetingId_${meetingId}.webm`,
  };

  const localFilePath = path.join(downloadPath, `recorded_video_MeetingId_${meetingId}.webm`);
  const localDirPath = path.dirname(localFilePath);

  // Ensure the directory exists
  fs.mkdirSync(localDirPath, { recursive: true });

  try {
    const data = await s3Client.send(new GetObjectCommand(downloadParams));
    const fileStream = fs.createWriteStream(localFilePath);

    return new Promise((resolve, reject) => {
      data.Body.pipe(fileStream);
      data.Body.on('error', (err) => {
        reject(err);
      });
      fileStream.on('close', () => {
        console.log(`File downloaded successfully to ${localFilePath}`);
        resolve(localFilePath);
      });
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

module.exports = downloadvideoFromS3;
