import { useState, useEffect } from "react";
import UploadButton from "./components/UploadButton";
import SongsTable from "./components/SongsTable";
import type { Song } from "./types";
import "./App.css";

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/songs");
      const data = await res.json();
      setSongs(data);
    } catch (err: unknown) {
      console.error("Failed to load songs:", err);
      setError("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);
      await fetch("http://localhost:3000/api/songs/upload", {
        method: "POST",
        body: formData,
      });
      await fetchSongs();
    } catch (err: unknown) {
      console.error("Upload failed:", err);
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Song List</h1>
        <small>Thing or Two Assignment</small>
      </header>

      <UploadButton onFileSelect={handleUpload} />

      {error && <div className="error">{error}</div>}
      {loading ? <div className="spinner" /> : <SongsTable songs={songs} />}
    </div>
  );
}

export default App;
