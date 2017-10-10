import Ember from 'ember';

const {get, set, inject} = Ember;

export default Ember.Service.extend({
  tracking: inject.service(),
  modals: inject.service(),

  isAnimatingAway: false,
  showContent: false,

  expand() {
    get(this, 'tracking').trackUGCJobsTrayOpened();
    get(this, 'modals').addModalBodyClass();
    set(this, 'showContent', true);
  },

  collapse() {
    get(this, 'tracking').trackUGCJobsTrayClosed();
    get(this, 'modals').removeModalBodyClass();
    set(this, 'isAnimatingAway', true);

    Ember.run.later(() => {
      set(this, 'showContent', false);
      set(this, 'isAnimatingAway', false);
    }, 300);
  },
});
