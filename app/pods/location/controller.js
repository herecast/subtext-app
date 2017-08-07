import Ember from 'ember';

const {
  inject,
  computed
} = Ember;

export default Ember.Controller.extend({
  history: inject.service(),

  isEvents: computed.equal('history.routeName', 'location.events')
});
