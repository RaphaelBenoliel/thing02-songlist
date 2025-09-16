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
    const A = a[orderBy].toString();
    const B = b[orderBy].toString();
    return direction === "asc" ? A.localeCompare(B) : B.localeCompare(A);
  });

  const toggle = (key: OrderKey) => {
    if (orderBy === key) setDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(key);
      setDirection("asc");
    }
  };

  return (
    <div className="table-wrapper">
      <div className="table-responsive">
        <table className="songs-table">
          <colgroup>
            <col className="col-idx" />
            <col className="col-name" />
            <col className="col-band" />
            <col className="col-year" />
          </colgroup>

          
<caption className="sr-only">Songs table — sortable by Song, Band, or Year</caption>

<thead>
  <tr>
    <th className="th-idx" scope="col">#</th>
    <th
      className="th-name sortable"
      scope="col"
      aria-sort={orderBy === "name" ? (direction === "asc" ? "ascending" : "descending") : "none"}
      onClick={() => toggle("name")}
    >
      Song {orderBy === "name" && (direction === "asc" ? "⬆" : "⬇")}
    </th>
    <th
      className="th-band sortable"
      scope="col"
      aria-sort={orderBy === "band" ? (direction === "asc" ? "ascending" : "descending") : "none"}
      onClick={() => toggle("band")}
    >
      Band {orderBy === "band" && (direction === "asc" ? "⬆" : "⬇")}
    </th>
    <th
      className="th-year sortable"
      scope="col"
      aria-sort={orderBy === "year" ? (direction === "asc" ? "ascending" : "descending") : "none"}
      onClick={() => toggle("year")}
    >
      Year {orderBy === "year" && (direction === "asc" ? "⬆" : "⬇")}
    </th>
  </tr>
</thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={`${s.name}-${s.band}-${i}`}>
                <td className="td-idx">{i + 1}</td>
                <td className="td-name">{s.name}</td>
                <td className="td-band">{s.band}</td>
                <td className="td-year">{s.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <div className="no-songs">
          <div>🎶</div>
          No songs uploaded yet. Upload a CSV to get started!
        </div>
      )}
    </div>
  );
}
