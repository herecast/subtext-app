import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, ResetScroll, {
  modelImageKey: 'bannerImage.url',
  modelChannel: 'news',
  history: Ember.inject.service(),

  model(params)  {
    return this.store.findRecord('news', params.id, { reload: true }).catch(() => {
      this.replaceWith('error-404');
    });
  }
});
