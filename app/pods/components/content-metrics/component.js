import Ember from 'ember';
import moment from 'moment';

const {
  computed,
  get,
  set
} = Ember;

function filteredDataSet(data,startDate,endDate) {
  const isFormat = /^\d{2}\/\d{2}\/\d{4}/;
  const mStart = isFormat.test(startDate) ? moment(startDate, 'MM/DD/YYYY') : moment(startDate);
  const mEnd = isFormat.test(endDate) ? moment(endDate, 'MM/DD/YYYY') : moment(endDate);

  return data.filter(function(i) {
    let doReturn = true;
    const reportDate = i.get('report_date');

    if(mStart.isValid()) {
      doReturn = reportDate >= mStart.toDate();
    }
    if(doReturn && mEnd.isValid()) {
      doReturn = reportDate <= mEnd.toDate();
    }
    return doReturn;
  });
}

export default Ember.Component.extend({
  views: [],
  clicks: [],
  hasViewData: computed.notEmpty('views'),
  hasClickData: computed.notEmpty('clicks'),
  metricType: 'views',
  cumulative: false,
  startDate: computed.oneWay('views.firstObject.report_date'),
  endDate: computed.oneWay('views.lastObject.report_date'),

  init() {
    this._super(...arguments);

  },

  filteredViewCounts: computed('views.[]', 'startDate', 'endDate', function() {
    const data = get(this, 'views');
    const startDate = get(this, 'startDate');
    const endDate = get(this, 'endDate');

    return filteredDataSet(data, startDate, endDate);
  }),

  viewLabels: computed('filteredViewCounts', function() {
    const viewCounts = get(this, 'filteredViewCounts');

    return viewCounts.map((row) => {
      return moment(row.report_date).format('L');
    });
  }),

  viewData: computed('filteredViewCounts', function() {
    const viewCounts = get(this, 'filteredViewCounts');

    return viewCounts.mapBy('view_count');
  }),

  cumulativeViewData: computed('viewData', function() {
    const viewCounts = get(this, 'viewData');
    let count = 0;
    return viewCounts.map(function(i){
      count += i;
      return count;
    });
  }),

  filteredClickCounts: computed('clicks.[]', 'startDate', 'endDate', function() {
    const data = get(this, 'clicks');
    const startDate = get(this, 'startDate');
    const endDate = get(this, 'endDate');

    return filteredDataSet(data, startDate, endDate);
  }),

  clickLabels: computed('filteredClickCounts', function() {
    const clickCounts = get(this, 'filteredClickCounts');

    return clickCounts.map((row) => {
      return moment(row.report_date).format('L');
    });
  }),

  clickData: computed('filteredClickCounts', function() {
    const clickCounts = get(this, 'filteredClickCounts');

    return clickCounts.mapBy('click_count');
  }),

  cumulativeClickData: computed('clickData', function() {
    const clickCounts = get(this, 'clickData');
    let count = 0;
    return clickCounts.map(function(i){
      count += i;
      return count;
    });
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
