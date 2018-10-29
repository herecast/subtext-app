import { oneWay, notEmpty, sort } from '@ember/object/computed';
import { set, get, computed, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
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

  contentMetrics: service(),

  startDate: null,
  endDate: null,
  displayOption: 'week',
  metricType: 'views',
  cumulative: false,
  isLoadingModel: false,

  _displayOptions: displayOptionsObj,

  init() {
    this._super(...arguments);
    setProperties(this, {
      sortBy: ['report_date'],
      views: [],
      clicks: []
    });
    this._updateStartDate('week');
  },

  title: computed('model.name', function() {
    return `Showing data for all ${get(this, 'model.name')} owned content.`;
  }),

  lifetimeViewCount: oneWay('model.viewCount'),
  hasViewData: notEmpty('contentMetricsModel.views'),
  sortedViews: sort('contentMetricsModel.views', 'sortBy'),
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

    run.debounce(this, this._getcontentMetricsModel, 200);
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

  _getcontentMetricsModel() {
    if (!get(this, 'isDestroying')) {
      const dateQuery = get(this, '_dateQuery');
      set(this, 'isLoadingModel', true);

      const model = get(this, 'model');
      const type = get(model, 'constructor.modelName');
      const id = type === 'current-user' ? get(model, 'userId') : get(model, 'id');

      get(this, 'contentMetrics').getMetrics(type, id, dateQuery)
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

  viewingMessage: computed('displayOption', function() {
    const displayOptionTitle = get(this, '_displayOptions')[get(this, 'displayOption')].title;

    return `Combined Daily Views for the last ${displayOptionTitle}`;
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
