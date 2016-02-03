import Ember from 'ember';
import moment from 'moment';

const {
  get,
  computed
} = Ember;

export default Ember.Object.extend({
  daily_impression_counts: [],
  daily_click_counts: [],

  views: computed('daily_impression_counts.[]', function(){
    const data = get(this, 'daily_impression_counts');

    return data.map(function(i) {
      return Ember.Object.create({
        report_date: moment(i['report_date'], 'MM/DD/YYYY').toDate(),
        view_count: parseInt(i['impression_count'])
      });
    });
  }),

  clicks: computed('daily_click_counts.[]', function(){
    const data = get(this, 'daily_click_counts');

    return data.map(function(i) {
      return Ember.Object.create({
        report_date: moment(i['report_date'], 'MM/DD/YYYY').toDate(),
        click_count: parseInt(i['click_count'])
      });
    });
  })
});
