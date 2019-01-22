import EmberObject, { computed, get } from '@ember/object';
import { A } from '@ember/array';
import moment from 'moment';

export default EmberObject.extend({
  daily_view_counts: A(),
  daily_promo_click_thru_counts: A(),

  views: computed('daily_view_counts.[]', function() {
    const data = get(this, 'daily_view_counts');

    return data.map(function(i) {
      return EmberObject.create({
        report_date: moment(i['report_date']),
        view_count: parseInt(i['view_count'])
      });
    });
  }),

  clicks: computed('daily_promo_click_thru_counts.[]', function() {
    const data = get(this, 'daily_promo_click_thru_counts');

    return data.map(function(i) {
      return EmberObject.create({
        report_date: moment(i['report_date']),
        click_count: parseInt(i['banner_click_count'])
      });
    });
  })
});
