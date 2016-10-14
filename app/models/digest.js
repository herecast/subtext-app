import Ember from 'ember';
import DS from 'ember-data';

const { get, set, computed, isBlank, inject, RSVP, on } = Ember;

export default DS.Model.extend({
  session: inject.service(),

  digestDescription: DS.attr('string'),
  name: DS.attr('string'),
  digestSendTime: DS.attr('moment-date'),
  digestSendDay: DS.attr('string'),

  listserv: computed('id', function() {
    return this.store.findRecord('listserv', get(this, 'id'));
  }),

  subscription: null,

  loadSubscription: on('init', function() {
    this.store.findAll('subscription').then(subscriptions => {
      const subscription = subscriptions.findBy('listserv.id', get(this, 'id'));
      set(this, 'subscription', subscription);
    });
  }),

  hasSubscription: computed.notEmpty('subscription'),

  toggleSubscription() {
    // First check to see if there is an existing subscription
    const subscription = get(this, 'subscription');
    if (isBlank(subscription)) {
      // Currently unsubscribed, load required data to prepare to save new subscription
      return RSVP.hash({
        currentUser: get(this, 'session.currentUser'),
        listserv: get(this, 'listserv')
      }).then(
        // Save new subscription
        ({currentUser, listserv}) => {
          return this.store.createRecord('subscription', {
            name: get(currentUser, 'name'),
            email: get(currentUser, 'email'),
            userId: get(currentUser, 'userId'),
            listserv: listserv
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
