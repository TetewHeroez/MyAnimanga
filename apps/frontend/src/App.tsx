import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import MangaDetailPage from "./pages/MangaDetailPage";
import TrendingPage from "./pages/TrendingPage";
import MyListPage from "./pages/MyListPage";
import SchedulePage from "./pages/SchedulePage";
import SearchPage from "./pages/SearchPage";
import GenrePage from "./pages/GenrePage";
import RandomAnimePage from "./pages/RandomAnimePage";
import SeasonArchivePage from "./pages/SeasonArchivePage";
import ProfilePage from "./pages/ProfilePage";
import CharactersPage from "./pages/CharactersPage";
import CharacterDetailPage from "./pages/CharacterDetailPage";
import StudiosPage from "./pages/StudiosPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ReviewsPage from "./pages/ReviewsPage";
import QuotesPage from "./pages/QuotesPage";
import WatchlistPage from "./pages/WatchlistPage";
import TopMangaPage from "./pages/TopMangaPage";
import UpcomingPage from "./pages/UpcomingPage";
import StatisticsPage from "./pages/StatisticsPage";
import ClubsPage from "./pages/ClubsPage";
import ComparePage from "./pages/ComparePage";
import NewsPage from "./pages/NewsPage";
import ForumPage from "./pages/ForumPage";
import ExportImportPage from "./pages/ExportImportPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="anime/:id" element={<AnimeDetailPage />} />
          <Route path="manga/:id" element={<MangaDetailPage />} />
          <Route path="lightnovel/:id" element={<MangaDetailPage />} />
          <Route path="trending" element={<TrendingPage />} />
          <Route path="my-list" element={<MyListPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="genre" element={<GenrePage />} />
          <Route path="genre/:genreId" element={<GenrePage />} />
          <Route path="random" element={<RandomAnimePage />} />
          <Route path="seasons" element={<SeasonArchivePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="characters" element={<CharactersPage />} />
          <Route path="character/:id" element={<CharacterDetailPage />} />
          <Route path="studios" element={<StudiosPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="top-manga" element={<TopMangaPage />} />
          <Route path="upcoming" element={<UpcomingPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="clubs" element={<ClubsPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="export-import" element={<ExportImportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
