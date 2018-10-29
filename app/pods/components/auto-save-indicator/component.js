import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
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
