import { Chart, PieController, LinearScale, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(LinearScale, PieController, ArcElement, ChartDataLabels);

var ctx = document.getElementById('myChart');
export default function makeChart(sorted, total) {

  // const labels = sorted.reduce((acc, cur) => {
	// 	if (!cur in acc) acc[cur] = {}
	// 	return acc
	// }, {})
	console.log(sorted)
  return new Chart(ctx, {
			type: 'doughnut',
			size: {
				height: 200,
				width: 200
			},
			data: {
					labels: sorted,
					datasets: [{
							data: [
								total[sorted[0]],
								total[sorted[1]],
								total[sorted[2]],
								total[sorted[3]],
								total[sorted[4]],
							], 
							backgroundColor: [
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(153, 102, 255, 0.2)',
							],
							borderColor: [
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(153, 102, 255, 1)',
							],
							// hoverOffset: 2,
							borderWidth: 1
					}]
			},
			options: {
				plugins: {
					datalabels: {
						display: true,
						backgroundColor: '#ccc',
						borderRadius: 3,
						font: {
							color: 'red',
							weight: 'bold',
						},
                        formatter: function(value, context) {
                            return context.chart.data.labels[context.dataIndex];
                        }
					},
					doughnutlabel: {
						labels: [{
							text: '550',
							font: {
								size: 20,
								weight: 'bold'
							}
						}, {
							text: 'total'
						}]
					},
					legend: {
						display: true,
						position: 'bottom',
						labels: {},
						title: {
							display: true
						}
					}
				}
      }
	});
}