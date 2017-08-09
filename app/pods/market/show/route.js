import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';
import BackgroundIndex from 'subtext-ui/mixins/routes/background-index';

const { get, set } = Ember;

export default Ember.Route.extend(ModalRoute, Redirect, RouteMetaMixin, DocTitleFromContent, BackgroundIndex, {
  defaultBackgroundIndex: 'location.market',
  modelImageKey: 'coverImageUrl',
  modelChannel: 'market',

  model(params)  {
    return this.store.findRecord('market-post', params.id, { reload: true });
  },

  afterModel(model) {
    const titleToken = get(model, 'title');
    set(this, 'titleToken', titleToken);
  }
});
