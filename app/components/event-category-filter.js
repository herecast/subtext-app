import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['dropdown'],

  actions: {
    setCategory(category) {
      this.set('category', category);
    }
  }
});
