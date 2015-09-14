import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../../config/environment';
import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  model(params) {
    return ajax(config.API_NAMESPACE + '/password_resets/' + params.reset_token).then(() => {
      return {resetToken: params.reset_token};
    }).catch(() => {
      this.transitionTo('forgot-password.index');
    });
  }
});