import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DepartmentPerformanceChart = ({ data }) => {

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return null;

        return {
            labels: data.map(item => item._id.charAt(0).toUpperCase() + item._id.slice(1)), // Capitalize category
            datasets: [
                {
                    label: 'Avg Resolution Time (Hours)',
                    data: data.map(item => item.avgTime),
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.6)',   // Indigo
                        'rgba(16, 185, 129, 0.6)',   // Emerald
                        'rgba(245, 158, 11, 0.6)',   // Amber
                        'rgba(59, 130, 246, 0.6)',   // Blue
                        'rgba(239, 68, 68, 0.6)',    // Red
                        'rgba(139, 92, 246, 0.6)',   // Violet
                    ],
                    borderColor: [
                        'rgb(99, 102, 241)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(59, 130, 246)',
                        'rgb(239, 68, 68)',
                        'rgb(139, 92, 246)',
                    ],
                    borderWidth: 1,
                    borderRadius: 6,
                },
            ],
        };
    }, [data]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false // Hide legend for single dataset if preferred
            },
            title: {
                display: true,
                text: 'Department Efficiency (Avg. Hours to Resolve)',
                font: {
                    family: 'Inter',
                    size: 16,
                    weight: 'bold'
                },
                color: '#1e293b'
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                padding: 12,
                titleFont: { family: 'Inter', size: 14 },
                bodyFont: { family: 'Inter', size: 13 },
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter' } }
            },
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: { font: { family: 'Inter' } },
                title: {
                    display: true,
                    text: 'Hours',
                    font: { size: 12, weight: 'bold' }
                }
            }
        }
    };

    if (!chartData) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-soft border border-slate-100 flex items-center justify-center h-80">
                <p className="text-slate-400">Not enough data to calculate performance.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

            <div className="relative z-10">
                <Bar options={options} data={chartData} />
            </div>
        </div>
    );
};

export default DepartmentPerformanceChart;
