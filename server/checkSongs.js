import mongoose from 'mongoose';
import Song from './models/Song.js';

const checkSongs = async () => {
  try {
    await mongoose.connect('mongodb+srv://kinshuk:kinshuk2005@cluster0.h77u8.mongodb.net/musiq?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');
    
    const songs = await Song.find({}).limit(5);
    console.log('Sample songs:');
    songs.forEach((song, i) => {
      console.log(`Song ${i+1}:`);
      console.log(`  Title: ${song.song}`);
      console.log(`  Movie: ${song.movie}`);
      console.log(`  Composer: ${song.composer}`);
      console.log(`  VideoId: ${song.videoId || 'MISSING'}`);
      console.log('---');
    });
    
    const songsWithVideo = await Song.countDocuments({ videoId: { $exists: true, $ne: null, $ne: '' } });
    const totalSongs = await Song.countDocuments();
    console.log(`Songs with VideoId: ${songsWithVideo}/${totalSongs}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkSongs();