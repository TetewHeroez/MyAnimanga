import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isDetailPage =
    location.pathname.startsWith("/anime/") ||
    location.pathname.startsWith("/manga/") ||
    location.pathname.startsWith("/lightnovel/");

  // Transparent navbar for pages with hero banner
  const useTransparentNav = isHomePage || isDetailPage;

  // Scroll to top on route change (instant)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        transparent={useTransparentNav}
        scrollThreshold={isHomePage ? "full" : "small"}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
