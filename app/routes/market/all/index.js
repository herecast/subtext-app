import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';

export default Ember.Route.extend(Track, {
  model(params) {
    return this.store.find('market-post', {
      query: params.query,
      date_start: params.date_start,
      date_end: params.date_end,
      location: params.location
    });
  },
});
