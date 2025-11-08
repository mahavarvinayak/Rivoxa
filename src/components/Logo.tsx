import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#blueGradient)" opacity="0.1" />
        <path
          d="M 70 30 C 70 20, 60 15, 50 15 C 35 15, 25 25, 25 40 C 25 50, 30 58, 38 63 M 70 70 C 70 80, 60 85, 50 85 C 35 85, 25 75, 25 60"
          stroke="url(#blueGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
