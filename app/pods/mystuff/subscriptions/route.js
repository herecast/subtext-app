import Ember from 'ember';

const { RSVP } = Ember;

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      subscriptions: this.store.findAll('subscription'),
      digests: this.store.findAll('digest')
    });
  }
});
