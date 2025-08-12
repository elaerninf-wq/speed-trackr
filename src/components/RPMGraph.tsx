import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { SpeedData } from './SpeedDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RPMGraphProps {
  dataHistory: SpeedData[];
}

export const RPMGraph: React.FC<RPMGraphProps> = ({ dataHistory }) => {
  const data = {
    labels: dataHistory.map((_, index) => {
      const secondsAgo = dataHistory.length - 1 - index;
      return secondsAgo === 0 ? 'Now' : `-${secondsAgo}s`;
    }),
    datasets: [
      {
        label: 'RPM',
        data: dataHistory.map(d => d.rpm),
        borderColor: 'hsl(var(--rpm-needle))',
        backgroundColor: 'hsl(var(--rpm-needle) / 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(var(--rpm-needle))',
        pointBorderColor: 'hsl(var(--background))',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--card-foreground))',
        bodyColor: 'hsl(var(--card-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            const secondsAgo = dataHistory.length - 1 - index;
            return secondsAgo === 0 ? 'Current' : `${secondsAgo} seconds ago`;
          },
          label: (context) => `RPM: ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(var(--border) / 0.3)',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          color: 'hsl(var(--border) / 0.3)',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: (value) => `${value}`,
        },
        min: 0,
        max: 8000,
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: 'hsl(var(--rpm-needle))',
        hoverBorderColor: 'hsl(var(--background))',
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="h-64 w-full">
      {dataHistory.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p>No RPM data yet</p>
            <p className="text-sm mt-1">Start driving to see RPM graph</p>
          </div>
        </div>
      )}
    </div>
  );
};