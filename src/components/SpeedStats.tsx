import React from 'react';
import { Card } from '@/components/ui/card';
import type { SpeedData } from './SpeedDashboard';

interface SpeedStatsProps {
  currentSpeed: number;
  maxSpeed: number;
  speedHistory: SpeedData[];
}

export const SpeedStats: React.FC<SpeedStatsProps> = ({ 
  currentSpeed, 
  maxSpeed, 
  speedHistory 
}) => {
  // Calculate statistics
  const speeds = speedHistory.map(data => data.speed);
  const maxRecordedSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
  const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
  const speedPercentage = (currentSpeed / maxSpeed) * 100;

  // Calculate acceleration (change in speed)
  const getAcceleration = () => {
    if (speedHistory.length < 2) return 0;
    const current = speedHistory[speedHistory.length - 1];
    const previous = speedHistory[speedHistory.length - 2];
    return current.speed - previous.speed;
  };

  const acceleration = getAcceleration();

  const stats = [
    {
      label: 'Current Speed',
      value: `${Math.round(currentSpeed)} km/h`,
      subtext: `${speedPercentage.toFixed(1)}% of max`,
      color: currentSpeed > maxSpeed * 0.8 ? 'text-destructive' : currentSpeed > maxSpeed * 0.5 ? 'text-warning' : 'text-success',
    },
    {
      label: 'Max Recorded',
      value: `${Math.round(maxRecordedSpeed)} km/h`,
      subtext: speedHistory.length > 0 ? 'This session' : 'No data yet',
      color: 'text-primary',
    },
    {
      label: 'Average Speed',
      value: `${avgSpeed.toFixed(1)} km/h`,
      subtext: speedHistory.length > 0 ? 'Over time' : 'No data yet',
      color: 'text-accent',
    },
    {
      label: 'Acceleration',
      value: `${acceleration > 0 ? '+' : ''}${acceleration.toFixed(1)} km/h/s`,
      subtext: acceleration > 0 ? 'Accelerating' : acceleration < 0 ? 'Decelerating' : 'Steady',
      color: acceleration > 0 ? 'text-success' : acceleration < 0 ? 'text-destructive' : 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 bg-card/50 border-border/50 hover:bg-card/70 transition-all duration-300">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </div>
            <div className={`text-xl font-bold ${stat.color} transition-colors duration-300`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.subtext}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};