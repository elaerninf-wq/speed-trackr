import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SpeedControlsProps {
  onAccelerate: (amount: number) => void;
  onBrake: (amount: number) => void;
  onEmergencyBrake: () => void;
  vehicleData: {
    speed: number;
    rpm: number;
    fuel: number;
  };
  maxSpeed: number;
}

export const SpeedControls: React.FC<SpeedControlsProps> = ({
  onAccelerate,
  onBrake,
  onEmergencyBrake,
  vehicleData,
  maxSpeed,
}) => {
  const [customAccelAmount, setCustomAccelAmount] = useState(10);
  const [customBrakeAmount, setCustomBrakeAmount] = useState(15);

  const handleCustomAccelerate = () => {
    if (customAccelAmount > 0) {
      onAccelerate(customAccelAmount);
    }
  };

  const handleCustomBrake = () => {
    if (customBrakeAmount > 0) {
      onBrake(customBrakeAmount);
    }
  };

  const isAtMaxSpeed = vehicleData.speed >= maxSpeed;
  const isStopped = vehicleData.speed <= 0;
  const isLowFuel = vehicleData.fuel < 5;

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Vehicle Controls</h3>
        <p className="text-sm text-muted-foreground">
          Control your vehicle's speed with precision
        </p>
      </div>

      {/* Vehicle Status Display */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="p-3 bg-card/50 rounded-lg">
          <div className="text-primary font-bold text-lg">{vehicleData.speed.toFixed(0)}</div>
          <div className="text-muted-foreground">km/h</div>
        </div>
        <div className="p-3 bg-card/50 rounded-lg">
          <div className="text-rpm-needle font-bold text-lg">{Math.round(vehicleData.rpm).toLocaleString()}</div>
          <div className="text-muted-foreground">RPM</div>
        </div>
        <div className="p-3 bg-card/50 rounded-lg">
          <div className={`font-bold text-lg ${vehicleData.fuel < 20 ? 'text-fuel-low' : 'text-fuel-needle'}`}>
            {vehicleData.fuel.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">Fuel</div>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => onAccelerate(5)}
            disabled={isAtMaxSpeed || isLowFuel}
            variant="default"
            className="flex-1 min-w-[120px] bg-success hover:bg-success/90 text-white"
          >
            +5 km/h
          </Button>
          <Button
            onClick={() => onAccelerate(10)}
            disabled={isAtMaxSpeed || isLowFuel}
            variant="default"
            className="flex-1 min-w-[120px] bg-success hover:bg-success/90 text-white"
          >
            +10 km/h
          </Button>
          <Button
            onClick={() => onBrake(10)}
            disabled={isStopped}
            variant="default"
            className="flex-1 min-w-[120px] bg-warning hover:bg-warning/90 text-white"
          >
            -10 km/h
          </Button>
          <Button
            onClick={() => onBrake(20)}
            disabled={isStopped}
            variant="default"
            className="flex-1 min-w-[120px] bg-warning hover:bg-warning/90 text-white"
          >
            -20 km/h
          </Button>
        </div>
      </div>

      <Separator />

      {/* Custom Controls */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Custom Amount</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Accelerate */}
          <div className="space-y-3">
            <Label htmlFor="accel-amount">Accelerate (km/h)</Label>
            <div className="flex gap-2">
              <Input
                id="accel-amount"
                type="number"
                min="1"
                max="50"
                value={customAccelAmount}
                onChange={(e) => setCustomAccelAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1"
              />
              <Button
                onClick={handleCustomAccelerate}
                disabled={isAtMaxSpeed || customAccelAmount <= 0 || isLowFuel}
                className="px-6 bg-success hover:bg-success/90 text-white"
              >
                Accelerate
              </Button>
            </div>
          </div>

          {/* Custom Brake */}
          <div className="space-y-3">
            <Label htmlFor="brake-amount">Brake (km/h)</Label>
            <div className="flex gap-2">
              <Input
                id="brake-amount"
                type="number"
                min="1"
                max="100"
                value={customBrakeAmount}
                onChange={(e) => setCustomBrakeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1"
              />
              <Button
                onClick={handleCustomBrake}
                disabled={isStopped || customBrakeAmount <= 0}
                className="px-6 bg-warning hover:bg-warning/90 text-white"
              >
                Brake
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Emergency Controls */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-destructive">Emergency Controls</h4>
        <Button
          onClick={onEmergencyBrake}
          disabled={isStopped}
          variant="destructive"
          className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold text-lg py-6"
        >
          🚨 EMERGENCY BRAKE 🚨
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Emergency brake will rapidly reduce speed to 0 km/h
        </p>
      </div>

      {/* Status Messages */}
      <div className="space-y-2">
        {isAtMaxSpeed && (
          <div className="text-center p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive font-medium">⚠️ Maximum speed reached!</p>
          </div>
        )}
        {isStopped && (
          <div className="text-center p-3 bg-muted/10 border border-muted/20 rounded-md">
            <p className="text-muted-foreground">🛑 Vehicle stopped</p>
          </div>
        )}
        {isLowFuel && (
          <div className="text-center p-3 bg-fuel-low/10 border border-fuel-low/20 rounded-md">
            <p className="text-fuel-low font-medium">⛽ Low fuel - refuel required!</p>
          </div>
        )}
      </div>
    </Card>
  );
};