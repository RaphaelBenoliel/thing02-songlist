import type { Song } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchSongs(): Promise<Song[]> {
  const res = await fetch(`${API_URL}/api/songs`);
  if (!res.ok) throw new Error("Failed to fetch songs");
  return res.json();
}

export async function uploadSongs(file: File): Promise<Song[]> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/songs/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Upload failed");
  }

  return res.json();
}

// Clear list
export async function clearSongs(): Promise<void> {
  const res = await fetch(`${API_URL}/api/songs/clear`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to clear songs");
}
