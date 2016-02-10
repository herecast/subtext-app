import Ember from 'ember';

export default Ember.Component.extend({
  categories: null,

  actions: {
    selectTag(tag) {
      this.attrs.selectTag(tag);
    },
    removeTag(tag) {
      this.attrs.removeTag(tag);
    }
  }
});
