import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  classNames: ['InlineEdit'],
  isEditing: false,
  disabled: Ember.computed.not('isEditing'),

  // Pass in callback action to trigger when inline editing is activated
  activate: null,

  actions: {
    toggleEditing(isEditing) {
      this.toggleProperty('isEditing');

      if (isEditing) {
        this.sendAction('action');
      } else {
        const activate = get(this, 'activate');
        if (activate) {
          activate();
        }
      }
    }
  }
});
