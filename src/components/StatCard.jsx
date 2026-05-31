import React, { useEffect, useState, useRef } from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconBg = 'bg-green-100', 
  iconColor = 'text-green-600',
  prefix = '',
  suffix = '',
  delay = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);

  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 800;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numericValue);
      setDisplayValue(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(numericValue);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, numericValue]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {prefix}{displayValue.toLocaleString()}{suffix}
          </p>
        </div>
        <div className={`${iconBg} rounded-xl p-3 flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
