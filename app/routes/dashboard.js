import Ember from 'ember';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';

import History from '../mixins/routes/history';

const { get } = Ember;

export default Ember.Route.extend(Authorized, History, {
  titleToken: 'Dashboard',

  setupController: function(controller/*, model*/) {
    /*
     * model is actually a computed property on controller.
     * It is fetched in controller to avoid a full route reload.
     * Anti-pattern?  Maybe...
     */

    controller.setProperties({
      currentUser: get(this, 'session.currentUser'),
      refresh: new Date() // Tell the controller to get new data
    });
  }
});
