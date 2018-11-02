import EmberObject, { computed, get } from '@ember/object';
import { A } from '@ember/array';

export default EmberObject.extend({
  isAd: true,

  daily_impression_counts: A(),
  daily_click_counts: A(),

  views: computed('daily_impression_counts.[]', function(){
    const data = get(this, 'daily_impression_counts');

    return data.map(function(i) {
      return EmberObject.create({
        report_date: new Date(i['report_date']),
        view_count: parseInt(i['impression_count'])
      });
    });
  }),

  clicks: computed('daily_click_counts.[]', function(){
    const data = get(this, 'daily_click_counts');

    return data.map(function(i) {
      return EmberObject.create({
        report_date: new Date(i['report_date']),
        click_count: parseInt(i['click_count'])
      });
    });
  })
});
