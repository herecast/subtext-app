import { get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import History from 'subtext-app/mixins/routes/history';
import VariableInfinityModelParams from 'subtext-app/mixins/routes/variable-infinity-model-params';
import ModalRouteParent from 'subtext-app/mixins/routes/modal-route-parent';
import Route from '@ember/routing/route';

export default Route.extend(History, VariableInfinityModelParams, ModalRouteParent, {

  fastboot: service(),
  infinity: service(),
  session: service(),

  currentUser: readOnly('session.currentUser'),

  model(params) {
    const userId = get(this, 'currentUser.userId');

    if (userId) {
      return this.infinity.model('caster', {
        user_id: userId,
        include: 'contents',
        caster_feed: true,
        per_page: params.perPage,
        startingPage: params.page || 1
      }, this.ExtendedInfinityModel);
    } else {
      return [];
    }

  }
});
