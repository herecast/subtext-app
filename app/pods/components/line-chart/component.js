import Ember from 'ember';

/* global Chart */

const {
  get,
  set
} = Ember;

export default Ember.Component.extend({
  chartClass: '',
  labels: [],
  data: [],
  metricType: null,

  setupChart: function() {
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
  }.on('didRender'),

  updateChart: function() {
    this.rerender();
  }.on('didUpdateAttrs')
});
