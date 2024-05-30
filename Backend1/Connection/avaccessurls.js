require('dotenv').config();
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { fromEnv } = require('@aws-sdk/credential-provider-env');

// Configure AWS SDK
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv()
});


async function handleAudioStream(meetingId) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `audio/recorded_audio_MeetingId_${meetingId}.mp3`
  };
  
  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
}

async function HandleVideoStream(meetingId){

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `videos/recorded_video_MeetingId_${meetingId}.webm`
    };
    try {
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration
      // res.json({ url });
      return url
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      // res.status(500).json({ error: "Error generating presigned URL" });
    }
  }

module.exports = {
  handleAudioStream,
  HandleVideoStream};
