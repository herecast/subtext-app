import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';
import DS from 'ember-data';

// TODO: remove this service since it does not hold
// state and is therefore the wrong abstraction to use
// https://trello.com/c/f3F3XXYl/2596-remove-user-service ~cm

export default Service.extend({
  api: service('api'),

  getCurrentUser() {
    // The current user endpoint does not take an ID, so we pass 'self' so that
    // it requests a single resource
    return DS.PromiseObject.create({
      promise: this.store.findRecord('current-user', 'self')
    });
  },

  resendConfirmation(identification) {
    return get(this, 'api').resendConfirmation(identification);
  }
});
