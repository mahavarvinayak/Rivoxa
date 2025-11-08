import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
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
          <linearGradient id="lightBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* Container/Box */}
        <rect x="25" y="20" width="50" height="8" rx="2" fill="url(#lightBlueGradient)" />
        <rect x="25" y="28" width="50" height="52" rx="4" fill="url(#lightBlueGradient)" opacity="0.9" />
        
        {/* Character Body */}
        <path
          d="M 35 45 L 50 35 L 65 45 L 65 65 L 50 75 L 35 65 Z"
          fill="url(#blueGradient)"
        />
        
        {/* Eyes */}
        <circle cx="45" cy="50" r="2.5" fill="white" />
        <circle cx="55" cy="50" r="2.5" fill="white" />
        
        {/* Smile */}
        <path
          d="M 43 57 Q 50 60 57 57"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Left Arm/Drop */}
        <path
          d="M 35 55 Q 28 60 30 70 Q 32 75 35 73 L 35 60 Z"
          fill="url(#lightBlueGradient)"
        />
        
        {/* Right Arm/Drop */}
        <path
          d="M 65 55 Q 72 60 70 70 Q 68 75 65 73 L 65 60 Z"
          fill="url(#lightBlueGradient)"
        />
      </svg>
    </motion.div>
  );
}