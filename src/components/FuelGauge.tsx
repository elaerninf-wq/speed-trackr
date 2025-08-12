import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fuel, AlertTriangle } from 'lucide-react';

interface FuelGaugeProps {
  fuel: number; // Percentage (0-100)
  onResetFuel: () => void;
}

export const FuelGauge: React.FC<FuelGaugeProps> = ({ fuel, onResetFuel }) => {
  // Calculate needle rotation (0-180 degrees for half circle)
  const needleRotation = (fuel / 100) * 180;
  
  // Determine color based on fuel level
  const getFuelColor = (level: number) => {
    if (level < 20) return 'text-fuel-low';
    if (level < 40) return 'text-gauge-yellow';
    return 'text-fuel-needle';
  };

  const fuelColor = getFuelColor(fuel);
  const isLowFuel = fuel < 20;

  return (
    <Card className="p-6 bg-gradient-speedometer border-border/50 shadow-panel">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gauge-text flex items-center justify-center gap-2">
          <Fuel className="w-5 h-5" />
          Fuel Level
        </h3>
        
        {/* Fuel Gauge */}
        <div className="relative w-48 h-32 mx-auto">
          <svg
            width="192"
            height="128"
            viewBox="0 0 192 128"
            className="transform"
          >
            {/* Outer arc */}
            <path
              d="M 16 112 A 80 80 0 0 1 176 112"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            
            {/* Inner background arc */}
            <path
              d="M 24 108 A 72 72 0 0 1 168 108"
              fill="none"
              stroke="hsl(var(--gauge-background))"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Fuel level arc */}
            <path
              d="M 24 108 A 72 72 0 0 1 168 108"
              fill="none"
              stroke={`hsl(var(--${fuel < 20 ? 'fuel-low' : fuel < 40 ? 'gauge-yellow' : 'fuel-needle'}))`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="226"
              strokeDashoffset={226 - (fuel / 100) * 226}
              className="transition-all duration-500"
            />

            {/* Tick marks */}
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i * 180) / 5;
              const fuelValue = i * 20;
              
              const x1 = 96 + 60 * Math.cos(((angle - 180) * Math.PI) / 180);
              const y1 = 112 + 60 * Math.sin(((angle - 180) * Math.PI) / 180);
              const x2 = 96 + 70 * Math.cos(((angle - 180) * Math.PI) / 180);
              const y2 = 112 + 70 * Math.sin(((angle - 180) * Math.PI) / 180);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--gauge-text))"
                  strokeWidth="1"
                />
              );
            })}

            {/* Needle */}
            <line
              x1="96"
              y1="112"
              x2="96"
              y2="42"
              stroke={`hsl(var(--${fuel < 20 ? 'fuel-low' : 'fuel-needle'}))`}
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                transform: `rotate(${needleRotation - 180}deg)`,
                transformOrigin: '96px 112px',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isLowFuel ? 'drop-shadow(0 0 8px hsl(var(--fuel-low)))' : undefined
              }}
            />

            {/* Center dot */}
            <circle
              cx="96"
              cy="112"
              r="4"
              fill={`hsl(var(--${fuel < 20 ? 'fuel-low' : 'fuel-needle'}))`}
            />
          </svg>

          {/* Fuel percentage labels */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i * 180) / 5 - 180;
              const percentage = i * 20;
              const distance = 45;
              
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;

              return (
                <div
                  key={i}
                  className="absolute text-xs text-gauge-text"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(100% + ${y}px - 16px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {percentage}%
                </div>
              );
            })}
          </div>
        </div>

        {/* Digital Fuel Display */}
        <div className="space-y-2">
          <div className={`text-3xl font-bold font-mono ${fuelColor} transition-colors duration-300`}>
            {fuel.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Fuel Remaining
          </div>
        </div>

        {/* Low Fuel Warning */}
        {isLowFuel && (
          <div className="flex items-center justify-center space-x-2 text-fuel-low">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">LOW FUEL</span>
          </div>
        )}

        {/* Refuel Button */}
        <Button 
          onClick={onResetFuel}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Fuel className="w-4 h-4 mr-2" />
          Refuel Tank
        </Button>
      </div>
    </Card>
  );
};