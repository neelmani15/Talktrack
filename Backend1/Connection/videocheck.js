require('dotenv').config();

const { S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-provider-env');

// Configure AWS SDK
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv() // Automatically fetch credentials from environment variables
});

/**
 * Function to check if a video exists in S3 and return its URL
 * @param {string} bucketName - The name of the S3 bucket
 * @param {string} meetingId - The ID of the meeting
 * @returns {object} - An object containing `exists` (boolean) and `url` (string|null)
 */
const checkVideoExists = async (bucketName, meetingId) => {
  const videoKey = `videos/recorded_video_MeetingId_${meetingId}.webm`;
  const params = {
    Bucket: bucketName,
    Key: videoKey
  };

  try {
    await s3Client.send(new HeadObjectCommand(params));
    const videoUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${videoKey}`;
    return { exists: true, url: videoUrl };
  } catch (error) {
    if (error.name === 'NotFound') {
      return { exists: false, url: null };
    } else {
      console.error("Error checking video existence:", error);
      throw error;
    }
  }
};

module.exports = checkVideoExists;
