import EmberObject, { computed, get, setProperties } from '@ember/object';

export default EmberObject.extend({
  init() {
    this._super(...arguments);
    setProperties(this, {
      daily_view_counts: [],
      daily_promo_click_thru_counts: []
    });
  },

  views: computed('daily_view_counts.[]', function() {
    const data = get(this, 'daily_view_counts');

    return data.map(function(i) {
      return EmberObject.create({
        report_date: new Date(i['report_date']),
        view_count: parseInt(i['view_count'])
      });
    });
  }),

  clicks: computed('daily_promo_click_thru_counts.[]', function() {
    const data = get(this, 'daily_promo_click_thru_counts');

    return data.map(function(i) {
      return EmberObject.create({
        report_date: new Date(i['report_date']),
        click_count: parseInt(i['banner_click_count'])
      });
    });
  })
});
