import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-autosave-indicator'],
  model: null,
  status: computed('model{isSaving,hasDirtyAttributes}', function() {
    const model = get(this, 'model');

    if (model.isSaving) {
      return 'saving';
    } else if (model.hasDirtyAttributes) {
      return 'dsfjdslfjdsfs';
    }
  })
});
