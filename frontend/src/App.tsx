import { useState, useEffect } from "react";
import { fetchSongs, uploadSongs, clearSongs } from "./services/songsApi";
import SongsTable from "./components/SongsTable";
import UploadButton from "./components/UploadButton";
import type { Song } from "./types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const data = await fetchSongs();
      setSongs(data);
    } catch (e) {
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      await uploadSongs(file);
      toast.success("Songs uploaded successfully!");
      await loadSongs();
    } catch (e) {
      toast.error("Upload failed. Please check the file.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setLoading(true);
      await clearSongs();
      setSongs([]); // reset locally
      toast.success("Song list cleared!");
    } catch (e) {
      toast.error("Failed to clear songs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <span className="brand">Thing or Two.</span>
      </div>

      <div className="container">
        <header>
          <h1>Song List</h1>
          <small>Thing or Two Assignment</small>
        </header>

        <div className="toolbar">
          <UploadButton onFileSelect={handleUpload} />
        </div>

        {loading ? (
          <div className="spinner" />
        ) : songs.length === 0 ? (
          <div className="empty-frame">
            🎶 No songs uploaded yet. <b>Upload a CSV to get started!</b>
          </div>
        ) : (
          <SongsTable songs={songs} onClear={handleClear} />
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
