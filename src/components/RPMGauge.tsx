import React from 'react';
import { Card } from '@/components/ui/card';

interface RPMGaugeProps {
  rpm: number;
  maxRPM: number;
  isAccelerating?: boolean;
}

export const RPMGauge: React.FC<RPMGaugeProps> = ({ 
  rpm, 
  maxRPM, 
  isAccelerating = false 
}) => {
  // Calculate needle rotation (0-270 degrees)
  const needleRotation = (rpm / maxRPM) * 270;
  
  // Determine color based on RPM zones
  const getZoneColor = (currentRPM: number) => {
    const percentage = (currentRPM / maxRPM) * 100;
    if (percentage > 85) return 'text-gauge-red';
    if (percentage > 70) return 'text-gauge-yellow';
    return 'text-gauge-green';
  };

  const zoneColor = getZoneColor(rpm);

  return (
    <Card className="p-6 bg-gradient-speedometer border-border/50 shadow-panel">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gauge-text">Tachometer</h3>
        
        {/* RPM Gauge */}
        <div className="relative w-48 h-48 mx-auto">
          <svg
            width="192"
            height="192"
            viewBox="0 0 192 192"
            className="transform -rotate-[135deg]"
          >
            {/* Outer circle */}
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            
            {/* Inner circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              fill="hsl(var(--gauge-background))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />

            {/* Tick marks and numbers */}
            {Array.from({ length: 9 }, (_, i) => {
              const angle = (i * 270) / 8;
              const rpmValue = (i * maxRPM) / 8;
              const isRedZone = rpmValue > maxRPM * 0.85;
              const isYellowZone = rpmValue > maxRPM * 0.7;
              
              const tickColor = isRedZone 
                ? 'hsl(var(--gauge-red))' 
                : isYellowZone 
                ? 'hsl(var(--gauge-yellow))' 
                : 'hsl(var(--gauge-green))';

              const x1 = 96 + 60 * Math.cos((angle * Math.PI) / 180);
              const y1 = 96 + 60 * Math.sin((angle * Math.PI) / 180);
              const x2 = 96 + 70 * Math.cos((angle * Math.PI) / 180);
              const y2 = 96 + 70 * Math.sin((angle * Math.PI) / 180);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={tickColor}
                  strokeWidth="2"
                />
              );
            })}

            {/* Needle */}
            <line
              x1="96"
              y1="96"
              x2="96"
              y2="30"
              stroke="hsl(var(--rpm-needle))"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                transform: `rotate(${needleRotation}deg)`,
                transformOrigin: '96px 96px',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isAccelerating ? 'drop-shadow(0 0 10px hsl(var(--rpm-needle)))' : undefined
              }}
            />

            {/* Center dot */}
            <circle
              cx="96"
              cy="96"
              r="6"
              fill="hsl(var(--rpm-needle))"
            />
          </svg>

          {/* RPM numbers overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center transform rotate-[135deg]">
              {Array.from({ length: 9 }, (_, i) => {
                const angle = (i * 270) / 8 - 135;
                const rpmValue = Math.round((i * maxRPM) / 8 / 1000);
                const distance = 45;
                
                const x = Math.cos((angle * Math.PI) / 180) * distance;
                const y = Math.sin((angle * Math.PI) / 180) * distance;

                return (
                  <div
                    key={i}
                    className="absolute text-xs font-medium text-gauge-text"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {rpmValue}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Digital RPM Display */}
        <div className="space-y-2">
          <div className={`text-3xl font-bold font-mono ${zoneColor} transition-colors duration-300`}>
            {Math.round(rpm).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            RPM
          </div>
        </div>

        {/* Status Indicator */}
        {isAccelerating && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-rpm-needle rounded-full animate-pulse"></div>
            <span className="text-sm text-rpm-needle font-medium">ACCELERATING</span>
          </div>
        )}
      </div>
    </Card>
  );
};