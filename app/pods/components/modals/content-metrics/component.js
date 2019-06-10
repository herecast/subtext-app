import { oneWay, notEmpty, sort } from '@ember/object/computed';
import { set, get, computed, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import ModalInstance from 'subtext-app/pods/components/modal-instance/component';
import moment from 'moment';

const displayOptionsObj = {
  'week': {value: 7, title: 'Week'},
  'two-weeks': {value: 14, title: '2 Weeks'},
  'three-weeks': {value: 21, title: '3 Weeks'},
  'month': {value: 28, title: 'Month'}
};

export default ModalInstance.extend({
  model: null,
  contentMetricsModel: null,
  _displayOptions: displayOptionsObj,

  contentMetrics: service(),

  startDate: null,
  endDate: null,
  displayOption: 'week',
  metricType: 'views',
  cumulative: false,
  isLoadingModel: false,

  init() {
    this._updateStartDate('week');
    this._super(...arguments);
    setProperties(this, {
      sortBy: ['report_date'],
      views: [],
      clicks: []
    });
  },

  title: oneWay('model.title'),
  isCampaign: oneWay('model.isCampaign'),
  lifetimeViewCount: oneWay('model.viewCount'),
  lifetimeClickCount: oneWay('model.clickCount'),
  hasViewData: notEmpty('contentMetricsModel.views'),
  hasClickData: notEmpty('contentMetricsModel.clicks'),
  sortedViews: sort('contentMetricsModel.views', 'sortBy'),
  sortedClicks: sort('contentMetricsModel.clicks', 'sortBy'),
  calculatedStartDate: oneWay('sortedViews.firstObject.report_date'),
  calculatedEndDate: oneWay('sortedViews.lastObject.report_date'),

  _updateStartDate(selectedOption){
    set(this, 'displayOption', selectedOption);
    const endDate = moment().add(8, 'hours');
    const displayOption = get(this, '_displayOptions')[selectedOption];
    const numberOfPreviousDays = parseInt(displayOption.value) || 7;
    const startDate = moment(endDate).subtract(numberOfPreviousDays, 'days');

    if (endDate.isValid() && startDate.isValid()) {
      this._setStartDate(startDate);
      this._setEndDate(endDate);
    }

    run.debounce(this, this._getContentMetricsModel, 200);
  },

  _formattedDate(date) {
    return date.format('YYYY-MM-DD');
  },

  _setStartDate(date) {
    set(this, 'startDate', this._formattedDate(date));
  },

  _setEndDate(date) {
    set(this, 'endDate', this._formattedDate(date));
  },

  _dateQuery: computed('startDate', 'endDate', function() {
    return {
      start_date: get(this, 'startDate'),
      end_date: get(this, 'endDate')
    };
  }),

  _getContentMetricsModel() {
    if (!get(this, 'isDestroying')) {
      const dateQuery = get(this, '_dateQuery');
      const contentType = get(this, 'isCampaign') ? 'campaign' : 'content';
      set(this, 'isLoadingModel', true);

      get(this, 'contentMetrics').getMetrics(contentType, get(this, 'model.contentId'), dateQuery)
      .then((contentMetricsModel) => {
        this.setProperties({
          contentMetricsModel: contentMetricsModel,
          isLoadingModel: false
        });
      });
    }
  },

  viewLabels: computed('sortedViews.@each.report_date', function() {
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

  cumulativeViewData: computed('viewData.[]', function() {
    const viewCounts = get(this, 'viewData');
    let count = 0;

    return viewCounts.map(function(i){
      count += i;
      return count;
    });
  }),

  clickLabels: computed('sortedClicks.@each.report_date', function() {
    const clickCounts = get(this, 'sortedClicks');

    return clickCounts.map((row) => {
      return moment(row.report_date).format('L');
    });
  }),

  clickData: computed('sortedClicks.@each.click_count', function() {
    const clickCounts = get(this, 'sortedClicks');
    return clickCounts.map((i) => {
      return isNaN(get(i, 'click_count')) ? 0 : get(i, 'click_count');
    });
  }),

  cumulativeClickData: computed('clickData.[]', function() {
    const clickCounts = get(this, 'clickData');
    let count = 0;

    return clickCounts.map(function(i){
      count += i;
      return count;
    });
  }),

  viewingMessage: computed('metricType', 'displayOption', 'cumulative', function() {
    const metricType = get(this, 'metricType');
    const displayOptionTitle = get(this, '_displayOptions')[get(this, 'displayOption')].title;
    const cumulative = get(this, 'cumulative') ? 'Cumulative' : 'Daily';

    return `Showing the ${cumulative} number of ${metricType} for the last ${displayOptionTitle}`;
  }),

  lifetimeMessage: computed('lifetimeViewCount', 'lifetimeClickCount', function() {
    const lifetimeViewCount = get(this, 'lifetimeViewCount') || false;
    const lifetimeClickCount = get(this, 'lifetimeClickCount') || false;

    let lifetimeMessage = '';

    if (lifetimeViewCount) {
      lifetimeMessage += `Lifetime Views: ${lifetimeViewCount}`;
    }

    if (lifetimeClickCount) {
      lifetimeMessage += ` | Lifetime Clicks: ${lifetimeClickCount}`;
    }

    return lifetimeMessage;
  }),

  actions: {
    updateStartDate(selectedOption) {
      this._updateStartDate(selectedOption);
    },
    setMetric(metric) {
      set(this, 'metricType', metric);
    },
    toggleCumulative() {
      this.toggleProperty('cumulative');
    },
    close() {
      this.close();
    }
  }
});
