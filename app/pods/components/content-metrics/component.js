import Ember from 'ember';
import moment from 'moment';

const {
  computed,
  observer,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  sortBy: ['report_date'],
  views: [],
  clicks: [],
  hasViewData: computed.notEmpty('views'),
  hasClickData: computed.notEmpty('clicks'),
  metricType: 'views',
  cumulative: false,
  sortedViews: computed.sort('views', 'sortBy'),
  sortedClicks: computed.sort('clicks', 'sortBy'),
  calculatedStartDate: computed.oneWay('sortedViews.firstObject.report_date'),
  calculatedEndDate: computed.oneWay('sortedViews.lastObject.report_date'),

  viewLabels: computed('sortedViews.@each.view_count', function() {
    const viewCounts = get(this, 'sortedViews');

    return viewCounts.map((row) => {
      return moment(row.report_date).format('L');
    });
  }),

  viewData: computed('sortedViews.@each.view_count', function() {
    const viewCounts = get(this, 'sortedViews');

    return viewCounts.map((i) => {
      return isNaN(get(i, 'view_count')) ? 0 : get(i, 'view_count');
    });
  }),

  cumulativeViewData: computed('viewData', function() {
    const viewCounts = get(this, 'viewData');
    let count = 0;

    return viewCounts.map(function(i){
      count += i;
      return count;
    });
  }),

  clickLabels: computed('sortedClicks', function() {
    const clickCounts = get(this, 'sortedClicks');

    return clickCounts.map((row) => {
      return moment(row.report_date).format('L');
    });
  }),

  clickData: computed('sortedClicks', function() {
    const clickCounts = get(this, 'sortedClicks');

    return clickCounts.map((i) => {
      return isNaN(get(i, 'click_count')) ? 0 : get(i, 'click_count');
    });
  }),

  cumulativeClickData: computed('clickData', function() {
    const clickCounts = get(this, 'clickData');
    let count = 0;

    return clickCounts.map(function(i){
      count += i;
      return count;
    });
  }),

  didReceiveAttrs() {
    const startDate = moment(this.attrs.startDate);
    const endDate = moment(this.attrs.endDate);

    set(this, 'views', this.attrs.views.value);
    set(this, 'clicks', this.attrs.clicks.value);

    if(startDate.isValid()) {
      set(this, 'startDate', startDate.toDate());
    } else {
      set(this, 'startDate', get(this, 'calculatedStartDate'));
    }

    if(endDate.isValid()) {
      set(this, 'endDate', endDate.toDate());
    } else {
      set(this, 'endDate', get(this, 'calculatedEndDate'));
    }
  },

  startDateDidChange: observer('startDate', function() {
    const startDate = get(this, 'startDate');

    if (startDate !== this.attrs['startDate']) {
      this.attrs.updateStartDate(startDate);
    }
  }),

  endDateDidChange: observer('endDate', function() {
    const endDate = get(this, 'endDate');

    if (endDate !== this.attrs['endDate']) {
      this.attrs.updateEndDate(endDate);
    }
  }),

  actions: {
    setMetric(metric) {
      set(this, 'metricType', metric);
    },
    toggleCumulative() {
      this.toggleProperty('cumulative');
    }
  }
});
