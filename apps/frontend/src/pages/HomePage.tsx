import ParallaxScroll from "../components/ParallaxScroll";
import MediaShowcase from "../components/MediaShowcase";

const HomePage = () => {
  return (
    <div className="bg-cream">
      {/* Full-width Parallax Hero - no padding */}
      <ParallaxScroll />

      {/* Content sections */}
      <MediaShowcase />
    </div>
  );
};

export default HomePage;
