import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { SpeedData } from './SpeedDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SpeedGraphProps {
  speedHistory: SpeedData[];
}

export const SpeedGraph: React.FC<SpeedGraphProps> = ({ speedHistory }) => {
  // Prepare data for Chart.js
  const labels = speedHistory.map((_, index) => {
    const secondsAgo = speedHistory.length - 1 - index;
    return secondsAgo === 0 ? 'Now' : `-${secondsAgo}s`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Speed (km/h)',
        data: speedHistory.map(item => item.speed),
        borderColor: 'hsl(186 100% 50%)',
        backgroundColor: 'hsl(186 100% 50% / 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(186 100% 50%)',
        pointBorderColor: 'hsl(218 23% 5%)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'hsl(180 100% 65%)',
        pointHoverBorderColor: 'hsl(218 23% 5%)',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(218 23% 8%)',
        titleColor: 'hsl(186 100% 94%)',
        bodyColor: 'hsl(186 100% 94%)',
        borderColor: 'hsl(186 100% 50%)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex;
            const secondsAgo = speedHistory.length - 1 - index;
            return secondsAgo === 0 ? 'Current Speed' : `${secondsAgo} seconds ago`;
          },
          label: (context: any) => `${context.parsed.y} km/h`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(218 23% 15%)',
          borderColor: 'hsl(218 23% 15%)',
        },
        ticks: {
          color: 'hsl(186 50% 70%)',
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        max: 200,
        grid: {
          color: 'hsl(218 23% 15%)',
          borderColor: 'hsl(218 23% 15%)',
        },
        ticks: {
          color: 'hsl(186 50% 70%)',
          stepSize: 20,
          callback: (value: any) => `${value} km/h`,
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  if (speedHistory.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>Speed data will appear here...</p>
          <p className="text-sm">Drive to start recording!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
};