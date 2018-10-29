import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

export default Route.extend(UnauthenticatedRouteMixin, ResetScroll, {
  titleToken: 'Check your e-mail'
});
