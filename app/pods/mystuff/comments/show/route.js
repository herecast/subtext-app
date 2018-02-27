import Ember from 'ember';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';

export default Ember.Route.extend(RouteMetaMixin, DocTitleFromContent, {
  model(params)  {
    return this.store.findRecord('content', params.id, { reload: true });
  }
});
