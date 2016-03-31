import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-autosave-indicator'],
  model: null,
  status: computed('model{isSaving,hasDirtyAttributes}', function() {
    if (get(this, 'model.isSaving')) {
      return 'saving...';
    } else if (!get(this, 'model.hasDirtyAttributes')) {
      return 'all changes saved.';
    } else {
      return 'you have unsaved changes';
    }
  })
});
