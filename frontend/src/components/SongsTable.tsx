import { useState } from "react";
import type { Song } from "../types";
import "./SongsTable.css";

interface Props {
  songs: Song[];
}

type OrderKey = "name" | "band" | "year";

export default function SongsTable({ songs }: Props) {
  const [orderBy, setOrderBy] = useState<OrderKey>("band");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const sorted = [...songs].sort((a, b) => {
    const valA = a[orderBy].toString();
    const valB = b[orderBy].toString();
    return direction === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const handleSort = (key: OrderKey) => {
    if (orderBy === key) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(key);
      setDirection("asc");
    }
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSort("name")}>
              Song {orderBy === "name" && (direction === "asc" ? "⬆" : "⬇")}
            </th>
            <th onClick={() => handleSort("band")}>
              Band {orderBy === "band" && (direction === "asc" ? "⬆" : "⬇")}
            </th>
            <th onClick={() => handleSort("year")}>
              Year {orderBy === "year" && (direction === "asc" ? "⬆" : "⬇")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((song, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{song.name}</td>
              <td>{song.band}</td>
              <td>{song.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
