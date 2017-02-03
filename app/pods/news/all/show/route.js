import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';

const { get, set } = Ember;

export default Ember.Route.extend(ModalRoute, Redirect, RouteMetaMixin, DocTitleFromContent, {
  modelImageKey: 'bannerImage.url',
  modelChannel: 'news',
  history: Ember.inject.service(),

  model(params)  {
    return this.store.findRecord('news', params.id, { reload: true });
  },

  afterModel(model) {
    const titleToken = get(model, 'title');
    set(this, 'titleToken', titleToken);
  }
});
