import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import History from 'subtext-app/mixins/routes/history';
import VariableInfinityModelParams from 'subtext-app/mixins/routes/variable-infinity-model-params';
import ModalRouteParent from 'subtext-app/mixins/routes/modal-route-parent';
import $ from 'jquery';
import Route from '@ember/routing/route';

export default Route.extend(History, ModalRouteParent, VariableInfinityModelParams, {
  fastboot: service(),
  infinity: service(),

  model(params) {
    const { handle } = params;

    return this.store.queryRecord('caster', { handle })
    .then(caster => {
      const userId = get(caster, 'userId');

      return hash({
        caster: caster,
        posts: this.infinity.model('caster', {
          user_id: userId,
          include: 'contents',
          startingPage: 1
        }, this.ExtendedInfinityModel)
      });
    });
  },

  actions: {
    didTransition() {
      this._super(...arguments);

      if (!get(this, 'fastboot.isFastBoot')) {
        this.controllerFor(this.routeName).resetTabs();

        this._clearOutlet();

        $(window).scrollTop(0);
      }
    }
  }
});
