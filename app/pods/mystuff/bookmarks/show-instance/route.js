import Route from '@ember/routing/route';
import Redirect from 'subtext-app/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-app/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-app/mixins/routes/title-token-from-content';

export default Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, {

  model(params)  {
    const eventInstanceId = params.event_instance_id || false;

    if (eventInstanceId) {
      return this.store.findRecord('event-instance', eventInstanceId, { reload: true });
    } else {
      this.transitionToRoute('show', params.id);
    }
  }
});
