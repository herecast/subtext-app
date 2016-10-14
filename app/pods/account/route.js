import Ember from 'ember';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { inject, get, RSVP } = Ember;

export default Ember.Route.extend(Authorized, {
  session: inject.service(),

  model() {
    return RSVP.hash({
      currentUser: get(this, 'session.currentUser'),
      digests: this.store.findAll('digest')
    });
  }
});
