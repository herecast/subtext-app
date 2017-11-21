import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';

const {
  get,
  isPresent
} = Ember;

export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, {

  model(params)  {
    return this.store.findRecord('feed-content', params.contentId, {reload: true});
  },

  afterModel(model) {
    if (isPresent(get(model, 'eventInstanceId'))) {
      return this.transitionTo(`${this.routeName}-instance`, get(model, 'contentId'), get(model, 'eventInstanceId'));
    } else {
      return this._super(...arguments);
    }
  }
});
