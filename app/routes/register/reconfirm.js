import Ember from 'ember';
import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Reconfirm Email',
  queryParams: {
    email: {
      replace: true
    }
  }
});