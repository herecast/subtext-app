import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';

export default Ember.Route.extend(Track, {
  model(params) {
    return this.store.find('news', {
      query: params.query
    });
  },

  setupController(controller, news) {
    controller.set('newsGroups', [news]);
  }
});
