import Ember from 'ember';

export default Ember.Component.extend({
  categories: null,

  actions: {
    removeTag(tag) {
      this.attrs.removeTag(tag);
    }
  }
});
