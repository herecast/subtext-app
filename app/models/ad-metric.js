import Ember from 'ember';

const {
  get,
  computed
} = Ember;

export default Ember.Object.extend({
  isAd: true,

  daily_impression_counts: [],
  daily_click_counts: [],

  views: computed('daily_impression_counts.[]', function(){
    const data = get(this, 'daily_impression_counts');

    return data.map(function(i) {
      return Ember.Object.create({
        report_date: new Date(i['report_date']),
        view_count: parseInt(i['impression_count'])
      });
    });
  }),

  clicks: computed('daily_click_counts.[]', function(){
    const data = get(this, 'daily_click_counts');

    return data.map(function(i) {
      return Ember.Object.create({
        report_date: new Date(i['report_date']),
        click_count: parseInt(i['click_count'])
      });
    });
  })
});
