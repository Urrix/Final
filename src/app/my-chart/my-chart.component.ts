import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-my-chart',
  template: `
    <div id="chart"></div>
  `,
  styleUrls: ['./my-chart.component.css']
})
export class MyChartComponent implements OnInit {
  ngOnInit() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  drawChart() {
    const data = google.visualization.arrayToDataTable([
      ['año', 'ventas', 'Rentas'],
      ['2020', 1000, 400],
      ['2021', 1170, 460],
      ['2022', 660, 1120],
      ['2023', 1030, 540]
    ]);

    const options = {
      title: 'Company Performance',
      hAxis: { title: 'Year', titleTextStyle: { bold: true } },
      vAxis: { title: 'Revenue', titleTextStyle: { bold: true } }
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('chart'));
    chart.draw(data, options);
  }
}
