/* global window */

import Ember from 'ember';

const {
  $,
  run,
  get,
  computed,
  inject
} = Ember;

export default Ember.Mixin.create({
  fastboot: inject.service(),
  isFastBoot: computed.alias('fastboot.isFastBoot'),

  actions: {
    didTransition() {
      this._super(...arguments);

      if(!get(this, 'isFastBoot')) {
        const scrollPosition = this.controller.get('scrollPosition') || 0;

        if (scrollPosition) {
          run.scheduleOnce("afterRender", this, function() {
            $(window).scrollTop(scrollPosition);
          });
        }

        return true; // bubble action
      }
    },

    willTransition(transition) {
      this._super(...arguments);

      if(!get(this, 'isFastBoot')) {
        if(transition.targetName === get(this, 'routeName')) {
          const oldPage = this.controller.get('page');

          if(transition.state.queryParams.page !== oldPage) {
            // Same route, page param changed
            this.controller.set('scrollPosition', 0);
            // didTransition hook doesn't get called, so reset scroll manually
            $(window).scrollTop(0);
          }
        } else {
          const scrollPosition = $(window).scrollTop();
          this.controller.set('scrollPosition', scrollPosition);
        }
      }

      return true; // bubble action
    }
  }
});
