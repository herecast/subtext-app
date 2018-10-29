/* global window */

import { inject as service } from '@ember/service';

import { alias } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import $ from 'jquery';
import { run } from '@ember/runloop';
import { get } from '@ember/object';

export default Mixin.create({
  fastboot: service(),
  isFastBoot: alias('fastboot.isFastBoot'),

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
