import { motion, MotionValue } from "framer-motion";

interface BackgroundOrbsProps {
  orb1Y: MotionValue<number>;
  orb2Y: MotionValue<number>;
  orb3Y: MotionValue<number>;
  orb4Y: MotionValue<number>;
}

export function BackgroundOrbs({ orb1Y, orb2Y, orb3Y, orb4Y }: BackgroundOrbsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform" style={{ perspective: '1000px' }}>
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.3) 50%, transparent 100%)',
          transformStyle: 'preserve-3d',
          y: orb1Y,
        }}
        animate={{
          x: [0, 150, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
          rotateX: [0, 15, 0],
          rotateY: [0, 15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(148, 163, 184, 0.3) 0%, rgba(100, 116, 139, 0.2) 50%, transparent 100%)',
          transformStyle: 'preserve-3d',
          y: orb2Y,
        }}
        animate={{
          x: [0, -120, 0],
          y: [0, 120, 0],
          scale: [1, 1.4, 1],
          rotateX: [0, -20, 0],
          rotateZ: [0, 10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(71, 85, 105, 0.25) 50%, transparent 100%)',
          transformStyle: 'preserve-3d',
          y: orb3Y,
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -80, 0],
          scale: [1, 1.2, 1],
          rotateY: [0, 20, 0],
          rotateZ: [0, -15, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 100%)',
          transformStyle: 'preserve-3d',
          transform: 'translate(-50%, -50%)',
          y: orb4Y,
        }}
        animate={{
          scale: [1, 1.5, 1],
          rotateX: [0, 360, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
