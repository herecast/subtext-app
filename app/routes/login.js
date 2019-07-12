import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Route from '@ember/routing/route';

export default Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Sign in'
});
