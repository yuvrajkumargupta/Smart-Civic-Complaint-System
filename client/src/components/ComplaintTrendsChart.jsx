import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

const ComplaintTrendsChart = ({ complaints = [] }) => {

    // Process data for chart
    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        // Initialize counts
        const monthlyTotal = new Array(12).fill(0);
        const monthlyResolved = new Array(12).fill(0);

        complaints.forEach(complaint => {
            const date = new Date(complaint.createdAt);
            if (date.getFullYear() === currentYear) {
                const monthIndex = date.getMonth();
                monthlyTotal[monthIndex]++;
                if (complaint.status === 'resolved') {
                    monthlyResolved[monthIndex]++;
                }
            }
        });

        // Filter out future months (optional, or just show up to current month)
        const currentMonthIndex = new Date().getMonth();
        const activeLabels = months.slice(0, currentMonthIndex + 1);
        const activeTotal = monthlyTotal.slice(0, currentMonthIndex + 1);
        const activeResolved = monthlyResolved.slice(0, currentMonthIndex + 1);

        // If no data, show at least last 6 months placeholder or empty
        if (complaints.length === 0) {
            return {
                labels: months.slice(0, 6),
                datasets: [
                    {
                        label: 'Complaints Filed',
                        data: [0, 0, 0, 0, 0, 0],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        fill: true,
                    }
                ]
            }
        }

        return {
            labels: activeLabels,
            datasets: [
                {
                    label: 'Complaints Filed',
                    data: activeTotal,
                    borderColor: '#4f46e5', // brand-indigo
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Resolved',
                    data: activeResolved,
                    borderColor: '#10b981', // emerald-500
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    }, [complaints]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { family: 'Inter', size: 12 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                padding: 12,
                titleFont: { family: 'Inter', size: 14 },
                bodyFont: { family: 'Inter', size: 13 },
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { font: { family: 'Inter' } }
            },
            y: {
                grid: { color: 'rgba(241, 245, 249, 1)', drawBorder: false },
                ticks: { font: { family: 'Inter' }, precision: 0 },
                beginAtZero: true
            }
        },
        elements: {
            point: { radius: 4, hoverRadius: 6 }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft border border-slate-100 h-96">
            <h3 className="font-bold text-lg text-brand-slate mb-4">Complaint Trends ({new Date().getFullYear()})</h3>
            <div className="h-80">
                <Line options={options} data={chartData} />
            </div>
        </div>
    );
};

export default ComplaintTrendsChart;
