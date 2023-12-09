import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { ChartData } from "../../network/reportsApi";

interface BarChartProps {
  data: ChartData;
  currency?: boolean;
  showLabelInTitle?: boolean;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, currency, showLabelInTitle }: BarChartProps) => {
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItem: TooltipItem<"bar">[]) => {
            return showLabelInTitle
              ? tooltipItem[0].dataset.label
              : tooltipItem[0].label;
          },
          label: (tooltipItem: TooltipItem<"bar">) => {
            return currency
              ? "R$" + parseFloat(tooltipItem.formattedValue).toFixed(2)
              : `${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category" as const,
        labels: data.labels,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
