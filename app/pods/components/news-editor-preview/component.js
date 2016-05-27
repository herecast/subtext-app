import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    closePreview() {
      this.attrs.closePreview();
    }
  }
});
