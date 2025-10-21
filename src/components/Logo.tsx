import { motion } from 'motion/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Logo({ 
  size = 'md', 
  variant = 'full', 
  animated = false,
  className = '',
  onClick
}: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg', container: 'h-8' },
    md: { icon: 32, text: 'text-xl', container: 'h-10' },
    lg: { icon: 48, text: 'text-3xl', container: 'h-16' },
    xl: { icon: 64, text: 'text-5xl', container: 'h-20' }
  };

  const currentSize = sizes[size];

  // Main Logo Icon - AI Brain + Calendar + Upward Arrow (Automation + Scheduling + Growth)
  const LogoIcon = () => (
    <motion.svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animated ? { scale: 0, rotate: -180 } : undefined}
      animate={animated ? { scale: 1, rotate: 0 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Outer Circle - Represents Automation & Continuous Process */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="283"
        initial={animated ? { strokeDashoffset: 283 } : undefined}
        animate={animated ? { strokeDashoffset: 0 } : undefined}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* AI Brain Neural Network */}
      <g opacity="0.9">
        {/* Left Brain Hemisphere */}
        <motion.path
          d="M 30 35 Q 25 45 30 55 Q 35 50 30 45 Q 28 40 30 35"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : undefined}
          animate={animated ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        
        {/* Right Brain Hemisphere */}
        <motion.path
          d="M 70 35 Q 75 45 70 55 Q 65 50 70 45 Q 72 40 70 35"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : undefined}
          animate={animated ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Neural Connections */}
        <motion.line x1="30" y1="45" x2="45" y2="45" stroke="url(#accentGradient)" strokeWidth="2" strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : undefined}
          animate={animated ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.4, delay: 0.6 }}
        />
        <motion.line x1="55" y1="45" x2="70" y2="45" stroke="url(#accentGradient)" strokeWidth="2" strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : undefined}
          animate={animated ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.4, delay: 0.7 }}
        />
        
        {/* Neural Nodes */}
        {[
          { cx: 30, cy: 40 },
          { cx: 30, cy: 50 },
          { cx: 70, cy: 40 },
          { cx: 70, cy: 50 },
          { cx: 50, cy: 45 }
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r="2.5"
            fill="url(#logoGradient)"
            initial={animated ? { scale: 0 } : undefined}
            animate={animated ? { scale: 1 } : undefined}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
          />
        ))}
      </g>

      {/* Calendar Grid (Bottom) - Represents Scheduling */}
      <g transform="translate(35, 60)">
        <motion.rect
          width="30"
          height="24"
          rx="2"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
          initial={animated ? { scale: 0 } : undefined}
          animate={animated ? { scale: 1 } : undefined}
          transition={{ duration: 0.4, delay: 0.8 }}
        />
        {/* Calendar dots */}
        {[0, 1, 2, 0, 1, 2].map((x, i) => (
          <motion.circle
            key={i}
            cx={6 + x * 9}
            cy={8 + Math.floor(i / 3) * 8}
            r="1.5"
            fill="url(#accentGradient)"
            initial={animated ? { opacity: 0 } : undefined}
            animate={animated ? { opacity: 1 } : undefined}
            transition={{ duration: 0.2, delay: 1 + i * 0.05 }}
          />
        ))}
      </g>

      {/* Upward Arrow - Represents Career Growth & Automation */}
      <motion.g
        initial={animated ? { y: 10, opacity: 0 } : undefined}
        animate={animated ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <path
          d="M 50 25 L 45 30 M 50 25 L 55 30 M 50 25 L 50 35"
          stroke="url(#accentGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>

      {/* Automation Sparkles */}
      {[
        { x: 20, y: 25, delay: 1.3 },
        { x: 80, y: 25, delay: 1.4 },
        { x: 15, y: 70, delay: 1.5 },
        { x: 85, y: 70, delay: 1.6 }
      ].map((sparkle, i) => (
        <motion.g
          key={i}
          transform={`translate(${sparkle.x}, ${sparkle.y})`}
          initial={animated ? { scale: 0, rotate: 0 } : undefined}
          animate={animated ? { 
            scale: [0, 1.2, 1],
            rotate: [0, 180, 360]
          } : undefined}
          transition={{ duration: 0.6, delay: sparkle.delay }}
        >
          <path
            d="M 0 -3 L 0.5 -0.5 L 3 0 L 0.5 0.5 L 0 3 L -0.5 0.5 L -3 0 L -0.5 -0.5 Z"
            fill="url(#logoGradient)"
          />
        </motion.g>
      ))}
    </motion.svg>
  );

  // Logo Text
  const LogoText = () => (
    <motion.div
      className={`${currentSize.text} tracking-tight flex items-center gap-1`}
      initial={animated ? { opacity: 0, x: -20 } : undefined}
      animate={animated ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        Career
      </span>
      <span className="text-slate-800">Agent</span>
      <span className="text-xs text-slate-500 self-start mt-1">AI</span>
    </motion.div>
  );

  const wrapperClasses = `${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`;

  if (variant === 'icon') {
    return (
      <div className={wrapperClasses} onClick={onClick}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={wrapperClasses} onClick={onClick}>
        <LogoText />
      </div>
    );
  }

  // Full logo (icon + text)
  return (
    <div 
      className={`flex items-center gap-3 ${currentSize.container} ${className} ${wrapperClasses}`}
      onClick={onClick}
    >
      <LogoIcon />
      <LogoText />
    </div>
  );
}

// Alternative Minimalist Logo
export function LogoMinimal({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* C for Career */}
      <path
        d="M 70 30 A 25 25 0 1 0 70 70"
        stroke="url(#minimalGradient)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* A for Agent */}
      <path
        d="M 30 70 L 45 30 L 60 70 M 35 55 L 55 55"
        stroke="url(#minimalGradient)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* AI dot */}
      <circle cx="80" cy="20" r="5" fill="#8b5cf6" />
    </svg>
  );
}

// Alternative Badge/Emblem Style Logo
export function LogoBadge({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      
      {/* Shield Shape */}
      <path
        d="M 50 10 L 80 25 L 80 55 Q 80 75 50 90 Q 20 75 20 55 L 20 25 Z"
        fill="url(#badgeGradient)"
        opacity="0.1"
      />
      <path
        d="M 50 10 L 80 25 L 80 55 Q 80 75 50 90 Q 20 75 20 55 L 20 25 Z"
        stroke="url(#badgeGradient)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Graduation Cap */}
      <path
        d="M 50 35 L 70 42 L 50 49 L 30 42 Z"
        fill="url(#badgeGradient)"
      />
      <rect x="48" y="49" width="4" height="12" fill="url(#badgeGradient)" />
      
      {/* Upward Arrow */}
      <path
        d="M 50 60 L 50 75 M 50 60 L 45 65 M 50 60 L 55 65"
        stroke="url(#badgeGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
