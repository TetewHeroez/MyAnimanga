import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

const Logo = ({ variant = "dark", className = "" }: LogoProps) => {
  // Stroke color - black outline for visibility
  const strokeColor = variant === "light" ? "#000000" : "#1a1a1a";

  return (
    <Link to="/" className={`flex items-center gap-2 shrink-0 ${className}`}>
      <span className="font-logo leading-none">
        {/* MyList - My and List on same line */}
        <span className="flex items-baseline">
          {/* "My" - solid color with black stroke */}
          <span
            className="text-2xl sm:text-3xl lg:text-4xl transition-colors duration-300"
            style={{
              color: variant === "light" ? "#ffffff" : "#005456",
              WebkitTextStroke: `1.5px ${strokeColor}`,
              paintOrder: "stroke fill",
              textShadow:
                variant === "light"
                  ? "2px 2px 4px rgba(0,0,0,0.5)"
                  : "1px 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            My
          </span>
          {/* "List" - gradient fill with black stroke */}
          <span
            className="text-2xl sm:text-3xl lg:text-4xl transition-colors duration-300"
            style={{
              backgroundImage:
                variant === "light"
                  ? "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)"
                  : "linear-gradient(135deg, #FF8C42 0%, #BC7040 50%, #8B4513 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: `1.5px ${strokeColor}`,
              paintOrder: "stroke fill",
              filter:
                variant === "light"
                  ? "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))"
                  : "drop-shadow(1px 1px 2px rgba(0,0,0,0.2))",
            }}
          >
            List
          </span>
        </span>
        {/* Animanga - second line, larger size */}
        <span
          className="text-lg sm:text-xl lg:text-2xl block transition-colors duration-300 -mt-1"
          style={{
            color: variant === "light" ? "#ffffff" : "#005456",
            WebkitTextStroke: `1px ${strokeColor}`,
            paintOrder: "stroke fill",
            textShadow:
              variant === "light"
                ? "1px 1px 3px rgba(0,0,0,0.5)"
                : "1px 1px 2px rgba(0,0,0,0.15)",
          }}
        >
          Animanga
        </span>
      </span>
    </Link>
  );
};

export default Logo;
