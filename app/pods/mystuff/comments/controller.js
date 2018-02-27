import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Controller.extend({
  queryParams: ['page'],
  page: 1,

  hasResults: computed('model.comments.[]', function() {
    return get(this, 'model.comments.length');
  })
});
