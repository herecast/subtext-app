import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['SimpleHeader'],

  actions: {
    scrollTop() {
      Ember.$('html,body').animate({
        scrollTop: 0
      }, 500);
    }
  }
});
