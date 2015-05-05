import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'label',
  classNames: ['btn btn-default'],
  classNameBindings: ['checked:active'],

  addChangeEvent: function() {
    this.$('input').on('change', () => {
      this.set('groupValue', this.get('value'));
    });
  }.on('didInsertElement'),

  removeChangeEvent: function() {
    this.$('input').off('change');
  }.on('willDestroyElement'),

  checked: function () {
    return this.get('value') === this.get('groupValue');
  }.property('value', 'groupValue')
});
