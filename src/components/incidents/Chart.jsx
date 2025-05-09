import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register the required components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const Chart = ({ datas = [] }) => {
    const chartData = {
        labels: datas.map(data => data?.type),
        datasets: [
            {
                label: 'Incidents',
                data: datas.map(data => data?.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
            },
            // tooltip: {
            //     callbacks: {
            //         label: function(context) {
            //             const data = datas[context.dataIndex];
            //             return `${data.type}: ${data.count} (${data.percentage.toFixed(2)}%)`;
            //         }
            //     }
            // }
        },
        responsive: true,
        maintainAspectRatio: true,
    };

    return (
        <div className='h-[40vh] w-full'>
            <Doughnut
                data={chartData}
                options={chartOptions}
            />
        </div>
    );
};

export default Chart;