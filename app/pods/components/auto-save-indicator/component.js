import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-autosave-indicator'],
  model: null,
  status: computed('model', 'model.isSaving', function() {
    if (get(this, 'model.isSaving')) {
      return 'saving...';
    } else {
      return 'all changes saved.';
    }
  })
});
