import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import History from 'subtext-app/mixins/routes/history';
import RouteMetaMixin from 'subtext-app/mixins/routes/social-tags';
import idFromSlug from 'subtext-app/utils/id-from-slug';

export default Route.extend(History, RouteMetaMixin, {
  tracking: service(),
  fastboot: service(),

  model(params) {
    return this.store.findRecord('organization', idFromSlug(params.organization_id));
  },

  titleToken(model) {
    const organization = model;

    if (isPresent(organization)) {
      return get(organization, 'name');
    }

    return 'DailyUV';
  }
});
