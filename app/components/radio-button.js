import Ember from 'ember';

const { computed, on } = Ember;

export default Ember.Component.extend({
  tagName: 'label',
  classNames: ['ReportAbuse-label'],
  classNameBindings: ['checked:active'],

  addChangeEvent: on('didInsertElement', function() {
    this.$('input').on('change', () => {
      this.set('groupValue', this.get('value'));
    });
  }),

  removeChangeEvent: on('willDestroyElement', function() {
    this.$('input').off('change');
  }),

  checked: computed('value', 'groupValue', function () {
    return this.get('value') === this.get('groupValue');
  })
});
