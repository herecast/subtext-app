import Route from '@ember/routing/route';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';

export default Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, {
  model(params)  {
    return this.store.findRecord('content', params.id, { reload: true });
  }
});
