import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function DashboardCharts() {
  const [data, setData] = useState([]);

  // Function to generate random RGBA color
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  };

  useEffect(() => {
    // Fetch processed results on mount
    axios.get('http://localhost:5000/api/results')
      .then(res => {
        console.log('Fetched dashboard data:', res.data);
        setData(res.data);
      })
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, []);

  if (!data.length) {
    return <p className="text-center">Loading Dashboard...</p>;
  }

  const totalSKUs = data.length;
  const lowStockCount = data.filter(d => d.Stockout_Risk).length;
  const recycleCount = data.filter(d => d.Recycle_Recommendation).length;
  const stockoutRiskPercentage = ((lowStockCount / totalSKUs) * 100).toFixed(2);

  // Stock Levels Bar Chart
  const stockChartData = {
    labels: data.map(d => d.SKU),
    datasets: [{
      label: 'Predicted Stock Level',
      data: data.map(d => d.Predicted_Stock_Level),
      backgroundColor: data.map(d =>
        d.Stockout_Risk ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.5)'
      )
    }]
  };

  // Horizontal Bar Chart
  const topLowStockData = [...data].sort((a, b) => a.Predicted_Stock_Level - b.Predicted_Stock_Level).slice(0, 10);
  const horizontalBarData = {
    labels: topLowStockData.map(d => d.SKU),
    datasets: [{
      label: 'Predicted Stock Level',
      data: topLowStockData.map(d => d.Predicted_Stock_Level),
      backgroundColor: 'rgba(239,68,68,0.5)',
    }]
  };
  const horizontalBarOptions = {
    indexAxis: 'y',
    plugins: { title: { display: true, text: 'Top 10 Low Stock Products', font: { size: 20 }}, legend: { display: false } }
  };

  // Demand Levels Pie Chart
  const demandCounts = data.reduce((acc, item) => {
    acc[item.Demand_Level] = (acc[item.Demand_Level] || 0) + 1;
    return acc;
  }, {});
  const demandChartData = {
    labels: Object.keys(demandCounts),
    datasets: [{
      data: Object.values(demandCounts),
      backgroundColor: ['rgba(34,197,94,0.5)', 'rgba(239,68,68,0.5)', 'rgba(251,191,36,0.5)'],
    }]
  };

  // Recycle Recommendation Pie Chart
  const recycleChartData = {
    labels: ['Yes', 'No'],
    datasets: [{
      data: [recycleCount, totalSKUs - recycleCount],
      backgroundColor: ['rgba(239,68,68,0.5)', 'rgba(34,197,94,0.5)'],
    }]
  };

  // Average Stock by Product Type (Grouped Bar Chart)
  const productTypeStockMap = data.reduce((acc, item) => {
    if (!acc[item.Product_Type]) acc[item.Product_Type] = [];
    acc[item.Product_Type].push(item.Predicted_Stock_Level);
    return acc;
  }, {});
  const productTypes = Object.keys(productTypeStockMap);
  const avgStockLevels = productTypes.map(pt =>
    (productTypeStockMap[pt].reduce((sum, v) => sum + v, 0) / productTypeStockMap[pt].length).toFixed(2)
  );
  const productTypeStockChartData = {
    labels: productTypes,
    datasets: [{
      label: 'Avg Predicted Stock Level',
      data: avgStockLevels,
      backgroundColor: productTypes.map(() => getRandomColor()),
    }]
  };

  // Demand vs Stockout Scatter Plot
  const demandLevelToNum = { Low: 1, Medium: 2, High: 3 };
  const scatterData = {
    datasets: [{
      label: 'SKU Demand vs Stock',
      data: data.map(item => ({
        x: item.Predicted_Stock_Level,
        y: demandLevelToNum[item.Demand_Level] || 0,
      })),
      backgroundColor: data.map(item =>
        item.Stockout_Risk ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.5)'
      )
    }]
  };
  const scatterOptions = {
    plugins: {
      title: { display: true, text: 'Demand vs Predicted Stock Level', font: { size: 20 } },
      tooltip: {
        callbacks: {
          label: ctx => {
            const item = data[ctx.dataIndex];
            return `SKU: ${item.SKU}, Stock: ${ctx.parsed.x.toFixed(2)}, Demand: ${item.Demand_Level}`;
          }
        }
      },
      legend: { display: false }
    },
    elements: {
      point: { radius: 6 }
    },
    scales: {
      x: { title: { display: true, text: 'Predicted Stock Level' } },
      y: {
        title: { display: true, text: 'Demand Level' },
        ticks: {
          callback: v => ({1: 'Low', 2: 'Medium', 3: 'High'}[v] || v),
          stepSize: 1,
          min: 0.5,
          max: 3.5
        }
      }
    }
  };

  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Dynamic Supply Chain Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total SKUs</h2>
          <p className="text-2xl">{totalSKUs}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Low Stock Risk</h2>
          <p className="text-2xl">{lowStockCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Recycling Recommendation</h2>
          <p className="text-2xl">{recycleCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Stockout Risk %</h2>
          <p className="text-2xl">{stockoutRiskPercentage}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
          <Bar data={stockChartData} options={{ plugins: { title: { display: true, text: 'Stock Levels by SKU', font: { size: 20 } } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={horizontalBarData} options={horizontalBarOptions} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={productTypeStockChartData} options={{ plugins: { title: { display: true, text: 'Average Stock by Product Type', font: { size: 20 } } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-1">
          <Pie data={demandChartData} options={{ plugins: { title: { display: true, text: 'Demand Levels', font: { size: 20 } } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Pie data={recycleChartData} options={{ plugins: { title: { display: true, text: 'Recycling Recommendation', font: { size: 20 } } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;