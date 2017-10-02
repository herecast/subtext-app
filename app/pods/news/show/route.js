import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';
import BackgroundIndex from 'subtext-ui/mixins/routes/background-index';

const { get, set } = Ember;

export default Ember.Route.extend(ModalRoute, Redirect, RouteMetaMixin, DocTitleFromContent, BackgroundIndex, {
  defaultBackgroundIndex: 'location.news',
  modelImageKey: 'bannerImage.url',
  modelChannel: 'news',

  beforeModel(transition) {
    const wasADirectLinkToNews = transition.sequence === 0;

    if (wasADirectLinkToNews) {
      const contentId = transition.params['news.show'].id || false;

      if (contentId) {
        this.transitionTo('location.index.show', 'hartford-vt', contentId);
      }
    }
  },

  model(params)  {
    return this.store.findRecord('news', params.id, { reload: true });
  },

  afterModel(model) {
    const titleToken = get(model, 'title');
    set(this, 'titleToken', titleToken);
  }
});
