# MyAnimanga 🎌

A modern anime and manga tracking application built with React and Bun.

## 📋 Features

- 🔍 Search anime and manga from Jikan API (MyAnimeList)
- 📝 Create and manage your personal watchlist
- 👤 User authentication (register/login)
- 📊 Track your anime/manga progress
- 🎨 Beautiful and responsive UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router DOM 7

### Backend

- Bun Runtime
- Elysia.js
- MongoDB (Mongoose)
- JWT Authentication

## 📁 Project Structure

```
MyAnimanga/
├── apps/
│   ├── frontend/          # React frontend application
│   └── backend/           # Elysia.js backend API
├── packages/
│   └── shared-types/      # Shared TypeScript types
├── docs/                  # Documentation
└── package.json           # Root package.json (workspaces)
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/myanimanga.git
cd myanimanga
```

2. Install dependencies

```bash
bun install
```

3. Set up environment variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
```

4. Start the development servers

```bash
# Run both frontend and backend
bun run dev

# Or run them separately
bun run dev:frontend
bun run dev:backend
```

### Available Scripts

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `bun run dev`          | Start both frontend and backend in development mode |
| `bun run dev:frontend` | Start only the frontend                             |
| `bun run dev:backend`  | Start only the backend                              |
| `bun run build`        | Build both applications for production              |

## 🔧 Configuration

### Environment Variables

See [.env.example](.env.example) for all available environment variables.

## 📝 API Endpoints

The backend API runs on `http://localhost:3000` by default.

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Anime

- `GET /anime/search` - Search anime
- `GET /anime/:id` - Get anime details

### Manga

- `GET /manga/search` - Search manga
- `GET /manga/:id` - Get manga details

### User List

- `GET /list` - Get user's anime/manga list
- `POST /list` - Add item to list
- `PUT /list/:id` - Update list item
- `DELETE /list/:id` - Remove item from list

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) - Unofficial MyAnimeList API
- [MyAnimeList](https://myanimelist.net/) - Anime/Manga database
