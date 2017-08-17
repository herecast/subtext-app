import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';

export default Ember.Route.extend(ModalRoute, Redirect, RouteMetaMixin, DocTitleFromContent, {

  model(params)  {
    const eventInstanceId = params.eventInstanceId || false;

    if (eventInstanceId) {
      return this.store.findRecord('event-instance', eventInstanceId, { reload: true });
    }

    return this.store.findRecord('feed-content', params.slug, { reload: true });
  }
});
