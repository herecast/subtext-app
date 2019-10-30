import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';

export default Route.extend(AuthenticatedRouteMixin, {
  fastboot: service(),
  session: service(),

  model() {
    return get(this, 'session.currentUser');
  },

  actions: {
    didTransition() {
      this._super(...arguments);

      if (!get(this, 'fastboot.isFastBoot')) {
        $(window).scrollTop(0);
      }
    }
  }
});
