import { set, get } from '@ember/object';
import { A } from '@ember/array';
import $ from 'jquery';
import Component from '@ember/component';
/* global Chart */

export default Component.extend({
  chartClass: '',
  metricType: null,

  labels: A(),
  data: A(),

  didRender() {
    this._super(...arguments);
    this._setupChart();
  },

  _setupChart() {
    this._super(...arguments);

    const labels = get(this, 'labels');
    const data = get(this, 'data');

    var chartData = {
      labels: labels,
      datasets: [
        {
          label: "",
          fillColor: "rgba(0,0,0,0.0)",
          strokeColor: "red",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: data
        }
      ]
    };

    $(this.element).find('canvas').remove();
    $(this.element).append(`<canvas class='${get(this, 'chartClass')}'></canvas>`);

    var ctx = $(this.element).find('canvas')[0].getContext("2d");

    const options = {
      tooltipTemplate: "<%= value %>",
      scaleBeginAtZero: true
    };

    set(this, 'chart', new Chart(ctx).Line(chartData, options));
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.rerender();
  }
});
