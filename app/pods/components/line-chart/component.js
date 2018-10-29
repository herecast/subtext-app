import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';
/* global Chart */

export default Component.extend({
  chartClass: '',
  metricType: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      labels: [],
      data: []
    });
  },

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

    this.$('canvas').remove();
    this.$().append(`<canvas class='${get(this, 'chartClass')}'></canvas>`);

    var ctx = this.$('canvas')[0].getContext("2d");

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
