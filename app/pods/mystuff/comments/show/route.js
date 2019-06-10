import Route from '@ember/routing/route';
import RouteMetaMixin from 'subtext-app/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-app/mixins/routes/title-token-from-content';

export default Route.extend(RouteMetaMixin, DocTitleFromContent, {
  model(params)  {
    return this.store.findRecord('content', params.id, { reload: true });
  }
});
