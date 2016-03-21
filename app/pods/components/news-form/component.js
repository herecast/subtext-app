import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  news: null,
  canAutosave: computed('news.status', function() {
    return (get(this, 'news.status') === 'draft');
  }),

  actions: {
    validateForm() {
      console.log('validating form... not');
    }
  }
});
