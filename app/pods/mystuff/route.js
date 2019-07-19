import $ from 'jquery';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  fastboot: service(),

  actions: {
    didTransition() {
      if (!get(this, 'fastboot.isFastBoot')) {
        $('html,body').scrollTop(0);
      }
    },
  }
});
