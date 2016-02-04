import Ember from 'ember';

export default Ember.Controller.extend({
  secondaryBackground: true,
  isPreview: true,

  actions: {
    trackEventInfoClick() {
      /* we aren't going to track here */
    },
  }
});
