import { useEffect, useRef } from "react";

// Image imports - sesuaikan path dengan struktur project React kamu
const bgImage = "/images/frieren4.png";
const mountainImage = "/images/frieren3.png";
const midImage = "/images/frieren2.png";
const frontImage = "/images/frieren1.png";

export default function ParallaxScroll() {
  const bgRef = useRef<HTMLImageElement>(null);
  const mountainRef = useRef<HTMLImageElement>(null);
  const midRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const value = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Parallax effects
      if (bgRef.current) bgRef.current.style.top = value * 0.5 + "px";
      if (mountainRef.current)
        mountainRef.current.style.top = -value * 0.15 + "px";
      if (midRef.current) midRef.current.style.top = value * 0.03 + "px";
      if (frontRef.current) frontRef.current.style.top = value * 0.5 + "px";
      // Text moves down slower than scroll for smooth parallax effect
      if (textRef.current)
        textRef.current.style.transform = `translateY(${value * 0.8}px)`;

      // Hide/show scrollbar based on scroll position
      if (value < viewportHeight * 0.9) {
        document.documentElement.classList.add("hide-scrollbar");
      } else {
        document.documentElement.classList.remove("hide-scrollbar");
      }
    };

    // Initial state - hide scrollbar
    document.documentElement.classList.add("hide-scrollbar");

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.classList.remove("hide-scrollbar");
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Main parallax container - full screen, no margins */}
      <section className="relative w-full h-full overflow-hidden flex justify-center items-center">
        {/* Background Image */}
        <img
          ref={bgRef}
          src={bgImage}
          alt="frieren"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Mountain Image */}
        <img
          ref={mountainRef}
          src={mountainImage}
          alt="frieren"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Mid Image */}
        <img
          ref={midRef}
          src={midImage}
          alt="frieren"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-2"
        />

        {/* Front Image */}
        <img
          ref={frontRef}
          src={frontImage}
          alt="frieren"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-2"
        />

        {/* Text - positioned near top, below navbar */}
        <h2
          ref={textRef}
          className="absolute top-[12%] md:top-[14%] text-white text-[4rem] md:text-[6rem] xl:text-[8rem] font-bold drop-shadow-2xl z-5"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          Frieren
        </h2>

        {/* Bottom gradient overlay - blend into cream */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-cream via-cream/80 to-transparent z-10 pointer-events-none" />
      </section>
    </div>
  );
}
