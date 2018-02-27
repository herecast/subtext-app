import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';

const {
  get,
  isPresent,
  inject: {service}
} = Ember;
//NOTE: SHould move the show/show-instance routes up a level to mystuff and see if that works: then no need for separeate show/show-instance for contents and comments
export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, {
  session: service(),
  modals: service(),
  fastboot: service(),
  history: service(),

  model(params)  {
    return this.store.findRecord('content', params.id, { reload: true });
  },

  afterModel(model) {
    if (isPresent(get(model, 'eventInstanceId'))) {
      this.transitionTo('mystuff.contents.show-instance', get(model, 'id'), get(model, 'eventInstanceId'));
    } else {
      this._super(...arguments);
    }
  }
});
