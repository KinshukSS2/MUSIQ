import express from "express";
import Room from "../models/Room.js";
import Song from "../models/Song.js";

const router = express.Router();

// Get random song for profile music player
router.get("/random", async (req, res) => {
  try {
    // Get total count of songs with videoId
    const count = await Song.countDocuments({ videoId: { $exists: true, $ne: null } });
    
    if (count === 0) {
      return res.status(200).json({ 
        message: "No songs in database", 
        song: null,
        useDemoTracks: true 
      });
    }

    // Get a random song
    const random = Math.floor(Math.random() * count);
    const randomSong = await Song.findOne({ videoId: { $exists: true, $ne: null } }).skip(random);

    if (!randomSong) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json({ song: randomSong });
  } catch (err) {
    console.error("Error fetching random song:", err);
    res.status(500).json({ message: "Error fetching random song" });
  }
});

router.get("/by-index", async (req, res) => {
  const roomCode = req.query.roomCode;
  const index = parseInt(req.query.index);

  console.log("GET /by-index", roomCode, index);

  try {
    const room = await Room.findOne({ code: roomCode });
    if (!room) {
      console.log("Room not found");
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.playlist || !room.playlist[index]) {
      console.log("Song not found at index:", index, "in room:", roomCode);
      return res.status(404).json({ message: "Song not found" });
    }
    res.json({ song: room.playlist[index] });
  } catch (err) {
    console.error("Error fetching song by index:", err);
    res.status(500).json({ message: "Error fetching song by index" });
  }
});

export default router;
