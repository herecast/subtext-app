import Ember from 'ember';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(Authorized, {
  model: function() {
    return this.get('session.currentUser');
  }
});
