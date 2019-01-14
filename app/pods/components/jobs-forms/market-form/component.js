import { get, computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['data-test-jobs-form'],
  'data-test-jobs-form': 'market',
  
  classNames: ['JobsForms-MarketForm'],
  model: null,
  errors: null,

  onChange: function() {},

  isEditingModel: not('model.isNew'),

  titleClass: computed('isEditingModel', function() {
    let titleClass = 'JobsForms--title';

    if (get(this, 'isEditingModel')) {
      titleClass += ' is-editing';
    }
    return htmlSafe(titleClass);
  }),

  actions: {
    onChange() {
      this.onChange();
    }
  }
});
