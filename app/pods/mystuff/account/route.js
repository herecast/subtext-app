import Ember from 'ember';

const { get, inject:{service} } = Ember;

export default Ember.Route.extend({
  session: service(),

  model() {
    return get(this, 'session.currentUser');
  }
});
