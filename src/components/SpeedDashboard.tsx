import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Speedometer } from './Speedometer';
import { SpeedGraph } from './SpeedGraph';
import { SpeedStats } from './SpeedStats';
import { SpeedControls } from './SpeedControls';
import { RPMGauge } from './RPMGauge';
import { FuelGauge } from './FuelGauge';
import { RPMGraph } from './RPMGraph';

export interface SpeedData {
  speed: number;
  rpm: number;
  fuel: number;
  timestamp: number;
}

export interface VehicleData {
  speed: number;
  rpm: number;
  fuel: number;
}

export const SpeedDashboard = () => {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    speed: 0,
    rpm: 800, // Idle RPM
    fuel: 85 // Start with 85% fuel
  });
  const [dataHistory, setDataHistory] = useState<SpeedData[]>([]);
  const [maxSpeed] = useState(200); // km/h
  const [maxRPM] = useState(8000); // RPM
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fuelConsumptionRef = useRef<NodeJS.Timeout | null>(null);

  // Update data history every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setDataHistory(prev => {
        const newHistory = [...prev, { 
          speed: vehicleData.speed, 
          rpm: vehicleData.rpm,
          fuel: vehicleData.fuel,
          timestamp: now 
        }];
        // Keep only last 30 data points (30 seconds)
        return newHistory.slice(-30);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [vehicleData]);

  // Fuel consumption effect
  useEffect(() => {
    if (fuelConsumptionRef.current) {
      clearInterval(fuelConsumptionRef.current);
    }

    fuelConsumptionRef.current = setInterval(() => {
      setVehicleData(prev => {
        const consumptionRate = prev.speed > 0 ? 0.001 + (prev.speed * 0.00005) : 0;
        const newFuel = Math.max(0, prev.fuel - consumptionRate);
        return { ...prev, fuel: newFuel };
      });
    }, 100);

    return () => {
      if (fuelConsumptionRef.current) {
        clearInterval(fuelConsumptionRef.current);
      }
    };
  }, [vehicleData.speed]);

  /**
   * Calculate RPM based on speed
   */
  const calculateRPM = (speed: number): number => {
    const idleRPM = 800;
    const maxSpeedRPM = 6500;
    if (speed === 0) return idleRPM;
    return Math.min(idleRPM + (speed / maxSpeed) * (maxSpeedRPM - idleRPM), maxRPM);
  };

  /**
   * Accelerate the vehicle by a given amount
   * @param amount - Amount to increase speed by (km/h)
   */
  const accelerate = (amount: number = 10) => {
    if (amount < 0) {
      console.error('Acceleration amount cannot be negative');
      return;
    }

    setVehicleData(prev => {
      const newSpeed = Math.min(prev.speed + amount, maxSpeed);
      const newRPM = calculateRPM(newSpeed);
      return { ...prev, speed: newSpeed, rpm: newRPM };
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

    setVehicleData(prev => {
      const newSpeed = Math.max(prev.speed - amount, 0);
      const newRPM = calculateRPM(newSpeed);
      return { ...prev, speed: newSpeed, rpm: newRPM };
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

    let currentSpeedValue = vehicleData.speed;
    intervalRef.current = setInterval(() => {
      currentSpeedValue = Math.max(currentSpeedValue - 25, 0);
      const newRPM = calculateRPM(currentSpeedValue);
      setVehicleData(prev => ({ 
        ...prev, 
        speed: currentSpeedValue, 
        rpm: newRPM 
      }));
      
      if (currentSpeedValue <= 0) {
        clearInterval(intervalRef.current!);
      }
    }, 100);

    setIsBraking(true);
    setTimeout(() => setIsBraking(false), 1000);
  };

  /**
   * Reset fuel to full
   */
  const resetFuel = () => {
    setVehicleData(prev => ({ ...prev, fuel: 100 }));
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Advanced Vehicle Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time speed, RPM, and fuel monitoring system
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gauges */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Speedometer 
              speed={vehicleData.speed} 
              maxSpeed={maxSpeed}
              isAccelerating={isAccelerating}
              isBraking={isBraking}
            />
            <RPMGauge 
              rpm={vehicleData.rpm}
              maxRPM={maxRPM}
              isAccelerating={isAccelerating}
            />
            <FuelGauge 
              fuel={vehicleData.fuel}
              onResetFuel={resetFuel}
            />
            <SpeedStats
              vehicleData={vehicleData}
              maxSpeed={maxSpeed}
              dataHistory={dataHistory}
            />
          </div>

          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <SpeedControls
              onAccelerate={accelerate}
              onBrake={brake}
              onEmergencyBrake={emergencyBrake}
              vehicleData={vehicleData}
              maxSpeed={maxSpeed}
            />
          </div>
        </div>

        {/* Performance Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Speed Over Time</h3>
            <SpeedGraph dataHistory={dataHistory} />
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">RPM Over Time</h3>
            <RPMGraph dataHistory={dataHistory} />
          </Card>
        </div>
      </div>
    </div>
  );
};
