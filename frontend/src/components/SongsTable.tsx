import { useMemo, useState, useEffect } from "react";
import type { Song } from "../types";
import "./SongsTable.css";

interface Props {
  songs: Song[];
}

type OrderKey = "name" | "band" | "year";

export default function SongsTable({ songs }: Props) {
  // Sorting
  const [orderBy, setOrderBy] = useState<OrderKey>("band");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  // Search + pagination
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Normalize query
  const q = query.trim().toLowerCase();

  // Filter
  const filtered = useMemo(() => {
    if (!q) return songs;
    return songs.filter((s) => {
      const yearStr = String(s.year ?? "");
      return (
        s.name.toLowerCase().includes(q) ||
        s.band.toLowerCase().includes(q) ||
        yearStr.includes(q)
      );
    });
  }, [songs, q]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const A = String(a[orderBy]).toLowerCase();
      const B = String(b[orderBy]).toLowerCase();
      if (A === B) return 0;
      const cmp = A < B ? -1 : 1;
      return direction === "asc" ? cmp : -1 * cmp;
    });
    return arr;
  }, [filtered, orderBy, direction]);

  // Pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    // reset page if query/pageSize change
    setPage(1);
  }, [q, pageSize]);

  // clamp page if source changed (safety)
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const visible = sorted.slice(start, end);

  const toggleSort = (key: OrderKey) => {
    if (orderBy === key) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setDirection("asc");
    }
  };

  return (
    <div className="table-wrapper">
      {/* Controls row */}
      <div className="table-controls">
        <input
          className="search-input"
          type="search"
          placeholder="Search by song, band or year…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="controls-right">
          <div className="results-count">
            Results: <b>{total}</b>
          </div>

          <label className="page-size">
            Rows per page:&nbsp;
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      {/* Scroll container */}
      <div className="table-responsive">
        <table className="songs-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => toggleSort("name")}>
                Song {orderBy === "name" && (direction === "asc" ? "⬆" : "⬇")}
              </th>
              <th onClick={() => toggleSort("band")}>
                Band {orderBy === "band" && (direction === "asc" ? "⬆" : "⬇")}
              </th>
              <th onClick={() => toggleSort("year")}>
                Year {orderBy === "year" && (direction === "asc" ? "⬆" : "⬇")}
              </th>
            </tr>
          </thead>

          <tbody>
            {visible.length > 0 ? (
              visible.map((s, idx) => (
                <tr key={`${s.name}-${s.band}-${start + idx}`}>
                  <td>{start + idx + 1}</td>
                  <td className="td-name">{s.name}</td>
                  <td className="td-band">{s.band}</td>
                  <td className="td-year">{s.year}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-songs">
                  🎶 No matching songs. Try a different search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="pagination">
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ‹ Prev
        </button>

        <span className="page-status">
          Page <b>{Math.min(page, totalPages)}</b> of <b>{totalPages}</b>
        </span>

        <button
          className="page-btn"
          disabled={page >= totalPages || total === 0}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
