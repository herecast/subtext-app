import { later } from '@ember/runloop';
import Service, { inject as service } from '@ember/service';
import { set, get } from '@ember/object';

export default Service.extend({
  tracking: service(),
  modals: service(),

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

    later(() => {
      set(this, 'showContent', false);
      set(this, 'isAnimatingAway', false);
    }, 300);
  },
});
