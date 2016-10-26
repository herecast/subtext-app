import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Join',

  model() {
    return this.store.findAll('digest');
  },

  setupController(controller, model) {
    controller.set('digests', model);
  }
});
