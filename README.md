# 🎵 Thing or Two – Full Stack Developer Assignment

This project was developed as part of the **Junior Full Stack Developer test** at **Thing or Two**.  
It implements a full-stack application that imports a CSV of songs, stores them in a SQL database, and displays them in a clean React UI.

---

## 🚀 Features
- **CSV Upload** – Upload a list of songs directly from a `.csv` file.
- **Data Processing** – All song fields (name, band, year) are normalized to lowercase before insertion.
- **Database Storage** – Songs are stored in a PostgreSQL database with proper schema using **TypeORM**.
- **API (NestJS)** – Backend provides REST endpoints to upload songs and retrieve them sorted by **band name**.
- **Frontend (React + TypeScript)** – Simple, modern, responsive table UI with clean styling.
- **Dockerized Setup** – Uses `docker-compose` for easy startup without installing PostgreSQL locally.

---

## 🛠️ Tech Stack
- **Backend:** [NestJS](https://nestjs.com/) + [TypeORM](https://typeorm.io/) + PostgreSQL  
- **Frontend:** [React](https://react.dev/) + TypeScript + Vite  
- **Infrastructure:** Docker & Docker Compose  

---

## 📂 Project Structure
```
thing02-songlist/
│── backend/        # NestJS backend
│   ├── src/
│   │   ├── songs/  # Songs module (entity, service, controller)
│   │   └── app.module.ts
│   └── Dockerfile
│
│── frontend/       # React + Vite frontend
│   ├── src/
│   │   ├── components/   # UI components (UploadButton, SongsTable)
│   │   ├── types/        # TypeScript interfaces
│   │   └── App.tsx
│   └── Dockerfile
│
│── docker-compose.yml    # Orchestrates backend + DB
│── README.md             # Project documentation
```

---

## ⚙️ Setup & Run

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/thing02-songlist.git
cd thing02-songlist
```

### 2️⃣ Run with Docker Compose
Make sure Docker is running, then start the stack:
```bash
docker compose up --build
```

- **Backend API** → [http://localhost:3000/api/songs](http://localhost:3000/api/songs)  
- **Frontend App** → [http://localhost:5173](http://localhost:5173)  

### 3️⃣ Upload CSV
- Use the **Upload** button in the UI to upload a `.csv` file (must include columns: `name, band, year`).  
- The data will be normalized, stored in PostgreSQL, and displayed in the table.

---

## 📌 API Endpoints
| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| `GET`  | `/api/songs`          | Fetch all songs (ordered by band)|
| `POST` | `/api/songs/upload`   | Upload CSV file and insert songs |

---

## 🧑‍💻 Development Notes
- **Best Practices:**  
  - Code organized in modules (NestJS `SongsModule`, React `components/`).  
  - Error handling with `try/catch`.  
  - TypeScript interfaces (`Song`) for type safety.  
  - Configurable via `.env` and Docker environment variables.  

- **Scalability:**  
  - Easy to extend with more endpoints (e.g., search, pagination).  
  - React components modular and reusable.  

---

## 🎨 Frontend UI
- Clean, modern design with responsive table.  
- Styled with plain CSS for simplicity (no external UI framework).  
- Hover effects, error states, and loading spinner included.  

---

## ✅ Assignment Requirements
✔ CSV parsing and normalization  
✔ Songs stored in PostgreSQL  
✔ API built with NestJS  
✔ React frontend with clean table  
✔ Docker & Docker Compose setup  
✔ Clean code, TypeScript, documentation  

---

## 📧 Author
Developed by **Raphael Ben Oliel**  
📍 Israel  
✉️ raphael2gb@gmail.com  
