import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['data-test-jobs-form'],
  'data-test-jobs-form': 'event',

  classNames: ['JobsForms-EventForm'],
  model: null,
  errors: null,

  onChange: function() {},

  actions: {
    onChange() {
      this.onChange();
    }
  }
});
