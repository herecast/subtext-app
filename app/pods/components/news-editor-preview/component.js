import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  actions: {
    closePreview() {
      get(this, 'closePreview')();
    }
  }
});
