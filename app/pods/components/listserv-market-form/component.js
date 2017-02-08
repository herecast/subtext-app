import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    afterDetails() {
      this.attrs.doneEditing();
    }
  }
});
