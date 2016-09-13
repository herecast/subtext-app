import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

export default Ember.Route.extend(UnauthenticatedRouteMixin, ResetScroll, {
  titleToken: 'Reset Password'
});
