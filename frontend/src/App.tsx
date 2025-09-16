import { useState, useEffect } from "react";
import UploadButton from "./components/UploadButton";
import SongsTable from "./components/SongsTable";
import type { Song } from "./types";
import "./App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/songs");
      if (!res.ok) throw new Error("Failed to load songs");
      const data = await res.json();
      setSongs(data);
    } catch (e) {
      toast.error("Failed to load songs");
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
      const res = await fetch("http://localhost:3000/api/songs/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Upload failed");
      }
      toast.success("Songs uploaded successfully!");
      await fetchSongs();
    } catch (e) {
      toast.error("Upload failed. Please check the file.");
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
          <SongsTable songs={songs} />
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;