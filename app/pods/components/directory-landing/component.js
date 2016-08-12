import Ember from 'ember';

const { get, computed, inject } = Ember;

export default Ember.Component.extend({
  store: inject.service(),

  news: computed(function() {
    const query = {
      'category': 'sponsored_content',
      'page': 1,
      'per_page': 4
    };
    return get(this, 'store').query('news', query);
  })
});
