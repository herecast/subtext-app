import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Card'],
  backVisible: false,

  mouseEnter() {
    this.set('backVisible', true);
  },

  mouseLeave() {
    this.set('backVisible', false);
  }
});
