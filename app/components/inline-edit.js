import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['InlineEdit'],
  isEditing: false,
  disabled: Ember.computed.not('isEditing'),

  actions: {
    toggleEditing: function() {
      this.toggleProperty('isEditing');
      if (this.get('disabled')) {
        this.sendAction('action');
      }
    }
  }
});
