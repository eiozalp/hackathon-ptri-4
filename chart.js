import { Chart, PieController, LinearScale, ArcElement } from 'chart.js';

Chart.register(LinearScale, PieController, ArcElement)

var ctx = document.getElementById('myChart');
export default function makeChart(sorted, total) {
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
							label: 'Sites by total usage',
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
					legend: {
						display: true,
						position: 'bottom',
						align: 'center'
					}
				}
      }
	});
}