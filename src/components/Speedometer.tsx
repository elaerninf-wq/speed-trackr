import React from 'react';
import { Card } from '@/components/ui/card';

interface SpeedometerProps {
  speed: number;
  maxSpeed: number;
  isAccelerating?: boolean;
  isBraking?: boolean;
}

export const Speedometer: React.FC<SpeedometerProps> = ({ 
  speed, 
  maxSpeed, 
  isAccelerating = false,
  isBraking = false 
}) => {
  // Calculate needle rotation (0-270 degrees)
  const rotation = (speed / maxSpeed) * 270;
  
  // Calculate speed zones for color coding
  const getSpeedZoneColor = () => {
    const percentage = (speed / maxSpeed) * 100;
    if (percentage < 30) return 'text-success';
    if (percentage < 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="p-6 bg-gradient-speedometer border-border/50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Current Speed</h2>
        
        {/* Speedometer Circle */}
        <div className="relative w-64 h-64 mx-auto">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-border bg-dashboard-speedometer-bg shadow-panel">
            {/* Speed Markings */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Major tick marks */}
              {Array.from({ length: 11 }, (_, i) => {
                const angle = -135 + (i * 27); // -135 to 135 degrees (270 total)
                const x1 = 100 + 80 * Math.cos((angle * Math.PI) / 180);
                const y1 = 100 + 80 * Math.sin((angle * Math.PI) / 180);
                const x2 = 100 + 85 * Math.cos((angle * Math.PI) / 180);
                const y2 = 100 + 85 * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    className="opacity-60"
                  />
                );
              })}
              
              {/* Minor tick marks */}
              {Array.from({ length: 54 }, (_, i) => {
                if (i % 5 === 0) return null; // Skip major ticks
                const angle = -135 + (i * 5); // Every 5 degrees
                const x1 = 100 + 82 * Math.cos((angle * Math.PI) / 180);
                const y1 = 100 + 82 * Math.sin((angle * Math.PI) / 180);
                const x2 = 100 + 85 * Math.cos((angle * Math.PI) / 180);
                const y2 = 100 + 85 * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="1"
                    className="opacity-40"
                  />
                );
              })}

              {/* Speed Numbers */}
              {Array.from({ length: 11 }, (_, i) => {
                const speedValue = (i * maxSpeed) / 10;
                const angle = -135 + (i * 27);
                const x = 100 + 70 * Math.cos((angle * Math.PI) / 180);
                const y = 100 + 70 * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-primary text-xs font-semibold"
                  >
                    {Math.round(speedValue)}
                  </text>
                );
              })}

              {/* Needle */}
              <g transform={`rotate(${rotation - 135} 100 100)`}>
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke={isBraking ? "hsl(var(--destructive))" : isAccelerating ? "hsl(var(--success))" : "hsl(var(--dashboard-speedometer-needle))"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={`transition-all duration-300 ${isBraking || isAccelerating ? 'drop-shadow-glow' : ''}`}
                />
                {/* Needle Center */}
                <circle
                  cx="100"
                  cy="100"
                  r="6"
                  fill={isBraking ? "hsl(var(--destructive))" : isAccelerating ? "hsl(var(--success))" : "hsl(var(--dashboard-speedometer-needle))"}
                  className="transition-all duration-300"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Digital Speed Display */}
        <div className={`space-y-2 transition-all duration-300 ${isAccelerating ? 'scale-110' : isBraking ? 'scale-95' : ''}`}>
          <div className={`text-6xl font-mono font-bold ${getSpeedZoneColor()} ${isBraking || isAccelerating ? 'drop-shadow-glow' : ''}`}>
            {Math.round(speed)}
          </div>
          <div className="text-xl text-muted-foreground">km/h</div>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center space-x-4">
          {isAccelerating && (
            <div className="flex items-center space-x-2 text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">ACCELERATING</span>
            </div>
          )}
          {isBraking && (
            <div className="flex items-center space-x-2 text-destructive">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">BRAKING</span>
            </div>
          )}
          {!isAccelerating && !isBraking && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <span className="text-sm font-medium">STEADY</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};