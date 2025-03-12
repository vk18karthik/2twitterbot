require('dotenv').config(); // Load environment variables
const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Twitter clients for both bots
const twitterClient1 = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY_1,
  appSecret: process.env.TWITTER_API_SECRET_1,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_1,
  accessSecret: process.env.TWITTER_ACCESS_SECRET_1,
});

const twitterClient2 = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY_2,
  appSecret: process.env.TWITTER_API_SECRET_2,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_2,
  accessSecret: process.env.TWITTER_ACCESS_SECRET_2,
});

const rwClient1 = twitterClient1.readWrite;
const rwClient2 = twitterClient2.readWrite;

// Paths to video files
const videoPath1 = './video.mp4'; // Video for Bot 1
const videoPath2 = './video2.mp4'; // Video for Bot 2

// Tweet content for Bot 1
const tweetContent1 = "Daily dosage #salaar #DailyDosageOfSalaar #Prabhas 🔥";

// Tweet content for Bot 2
const tweetContent2 = "Hello PeeKu Nation,\nDaily Dosage of PeeKu 💦";

// Function to upload media and post tweet for Bot 1
const postTweetWithVideo1 = async () => {
  try {
    const mediaId = await rwClient1.v1.uploadMedia(videoPath1, { type: 'video/mp4' });
    const response = await rwClient1.v2.tweet({
      text: tweetContent1,
      media: { media_ids: [mediaId] }
    });
    console.log(`Bot 1: Tweet posted successfully! Tweet ID: ${response.data.id}`);
  } catch (error) {
    console.error('Bot 1: Error posting tweet:', error.message);
  }
};

// Function to upload media and post tweet for Bot 2
const postTweetWithVideo2 = async () => {
  try {
    const mediaId = await rwClient2.v1.uploadMedia(videoPath2, { mimeType: 'video/mp4' });
    const response = await rwClient2.v2.tweet({
      text: tweetContent2,
      media: { media_ids: [mediaId] }
    });
    console.log(`Bot 2: Tweet posted successfully! Tweet ID: ${response.data.id}`);
  } catch (error) {
    console.error('Bot 2: Error posting tweet:', error.message);
  }
};

// Schedule tweets
cron.schedule('25 19 * * *', postTweetWithVideo2); // Bot 2: Post at 7:25 PM
cron.schedule('00 20 * * *', postTweetWithVideo1); // Bot 1: Post at 8:00 PM

// Add a /ping endpoint to keep the server active
app.get('/ping', (req, res) => {
  console.log('Ping received at:', new Date().toISOString());
  res.status(200).send('Pong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});