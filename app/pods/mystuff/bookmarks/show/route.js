import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';

export default Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, {
  session: service(),
  modals: service(),
  fastboot: service(),
  history: service(),

  model(params)  {
    return this.store.findRecord('content', params.id, { reload: true });
  },

  afterModel(model) {
    if (isPresent(get(model, 'eventInstanceId'))) {
      this.transitionTo('mystuff.bookmarks.show-instance', get(model, 'id'), get(model, 'eventInstanceId'));
    } else {
      this._super(...arguments);
    }
  }
});
