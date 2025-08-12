import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Speedometer } from './Speedometer';
import { SpeedGraph } from './SpeedGraph';
import { SpeedStats } from './SpeedStats';
import { SpeedControls } from './SpeedControls';

export interface SpeedData {
  speed: number;
  timestamp: number;
}

export const SpeedDashboard = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState<SpeedData[]>([]);
  const [maxSpeed] = useState(200); // km/h
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update speed history every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSpeedHistory(prev => {
        const newHistory = [...prev, { speed: currentSpeed, timestamp: now }];
        // Keep only last 30 data points (30 seconds)
        return newHistory.slice(-30);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSpeed]);

  /**
   * Accelerate the vehicle by a given amount
   * @param amount - Amount to increase speed by (km/h)
   */
  const accelerate = (amount: number = 10) => {
    if (amount < 0) {
      console.error('Acceleration amount cannot be negative');
      return;
    }

    setCurrentSpeed(prevSpeed => {
      const newSpeed = Math.min(prevSpeed + amount, maxSpeed);
      return newSpeed;
    });

    setIsAccelerating(true);
    setTimeout(() => setIsAccelerating(false), 300);
  };

  /**
   * Brake the vehicle by a given amount
   * @param amount - Amount to decrease speed by (km/h)
   */
  const brake = (amount: number = 15) => {
    if (amount < 0) {
      console.error('Brake amount cannot be negative');
      return;
    }

    setCurrentSpeed(prevSpeed => {
      const newSpeed = Math.max(prevSpeed - amount, 0);
      return newSpeed;
    });

    setIsBraking(true);
    setTimeout(() => setIsBraking(false), 300);
  };

  /**
   * Emergency brake - rapidly decrease speed to 0
   */
  const emergencyBrake = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let currentSpeedValue = currentSpeed;
    intervalRef.current = setInterval(() => {
      currentSpeedValue = Math.max(currentSpeedValue - 25, 0);
      setCurrentSpeed(currentSpeedValue);
      
      if (currentSpeedValue <= 0) {
        clearInterval(intervalRef.current!);
      }
    }, 100);

    setIsBraking(true);
    setTimeout(() => setIsBraking(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Vehicle Speed Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time speed monitoring and control system
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Speedometer */}
          <div className="lg:col-span-1">
            <Speedometer 
              speed={currentSpeed} 
              maxSpeed={maxSpeed}
              isAccelerating={isAccelerating}
              isBraking={isBraking}
            />
          </div>

          {/* Controls and Stats */}
          <div className="lg:col-span-2 space-y-6">
            <SpeedControls
              onAccelerate={accelerate}
              onBrake={brake}
              onEmergencyBrake={emergencyBrake}
              currentSpeed={currentSpeed}
              maxSpeed={maxSpeed}
            />

            <SpeedStats
              currentSpeed={currentSpeed}
              maxSpeed={maxSpeed}
              speedHistory={speedHistory}
            />
          </div>
        </div>

        {/* Speed Graph */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Speed Over Time</h3>
          <SpeedGraph speedHistory={speedHistory} />
        </Card>
      </div>
    </div>
  );
};
