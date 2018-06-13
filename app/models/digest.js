import Ember from 'ember';
import DS from 'ember-data';

const { get, set, computed, isBlank, inject } = Ember;

export default DS.Model.extend({
  session: inject.service(),

  digestDescription: DS.attr('string'),
  name: DS.attr('string'),
  nextDigestSendTime: DS.attr('moment-date'),
  digestSendTime: DS.attr('string'),
  digestSendDay: DS.attr('string'),

  subscription: null,

  loadSubscription() {
    return this.store.findAll('subscription').then(subscriptions => {
      const subscription = subscriptions.findBy('digestId', parseInt(get(this, 'id')));

      set(this, 'subscription', subscription);
      return subscription;
    });
  },

  hasSubscription: computed.notEmpty('subscription'),

  toggleSubscription() {
    // First check to see if there is an existing subscription
    const subscription = get(this, 'subscription');

    if (isBlank(subscription)) {
      // Currently unsubscribed, load required data to prepare to save new subscription
      return get(this, 'session.currentUser').then(
        // Save new subscription
        (currentUser) => {
          return this.store.createRecord('subscription', {
            name: get(currentUser, 'name'),
            email: get(currentUser, 'email'),
            userId: get(currentUser, 'userId'),
            //listservId is old nomenclature to be changed to digestId at later date
            listservId: get(this, 'id')
          }).save().then(
            (newSubscription) => {
              set(this, 'subscription', newSubscription);
            }
          );
        });
    } else {
      // Delete subscription
      return subscription.destroyRecord().then(
        () => set(this, 'subscription', null)
      );
    }
  }
});
