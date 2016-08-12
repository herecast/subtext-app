import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ResetModalScroll from 'subtext-ui/mixins/routes/reset-modal-scroll';

const { get, set } = Ember;

export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, ResetModalScroll, {
  modelImageKey: 'coverImageUrl',
  modelChannel: 'market',

  model(params)  {
    return this.store.findRecord('market-post', params.id);
  },

  afterModel(model) {
    const titleToken = get(model, 'title');
    set(this, 'titleToken', titleToken);
  }

});
