// components/NotificationBadge.tsx
import { useEffect, useState } from 'react';

interface NotificationBadgeProps {
  count: number;
  color?: string;
  className?: string;
}

export default function NotificationBadge({ 
  count, 
  color = "bg-blue-600", 
  className = "" 
}: NotificationBadgeProps) {
  const [animate, setAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState(count);
  
  useEffect(() => {
    if (count !== prevCount) {
     // setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 600);
      setPrevCount(count);
      
      return () => clearTimeout(timeout);
    }
  }, [count, prevCount]);
  
  if (count === 0) return null;
  
  return (
    <span 
      className={`absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold text-white 
        ${color} ${animate ? 'animate-bounce' : ''} ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}