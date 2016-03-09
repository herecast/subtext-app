import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  news: computed(function() {
    const query = {
      'category': 'sponsored_content',
      'page': 1,
      'per_page': 4
    };
    return this.store.query('news', query);
  })
});
