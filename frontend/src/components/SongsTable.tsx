// src/components/SongsTable.tsx
import React from "react";
import type { Song } from "../types";

interface SongsTableProps {
  songs: Song[];
}

export default function SongsTable({ songs }: SongsTableProps) {
  if (!songs.length) {
    return <div className="no-songs">No songs uploaded yet.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Band</th>
            <th>Song</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.band}</td>
              <td>{song.name}</td>
              <td>{song.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
