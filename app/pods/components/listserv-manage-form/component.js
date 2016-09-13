import Ember from 'ember';

const { get, set, computed, inject } = Ember;
const { Promise } = Ember.RSVP;

export default Ember.Component.extend({
  classNames: ['ListservManageForm'],

  model: null,

  api: inject.service(),

  hasFinished: false,
  messageTitle: '',

  isSubscribed: computed.empty('model.unsubscribedAt'),

  listserv: computed.alias('model.listserv'),

  manageLink: computed('model.id', function() {
    const origin = window.location.origin || `${window.location.protocol}//${window.location.host}`;

    return new Ember.String.htmlSafe(`${origin}/lists/${get(this, 'model.id')}/manage`);
  }),

  unsubscribe() {
    const api = get(this, 'api');
    return new Promise((resolve, reject) => {
      api.unsubscribeFromListserv( get(this, 'model.id') )
      .then(
        () => {
          set(this, 'messageTitle', 'You have been unsubscribed.');
          set(this, 'hasFinished', true);
          resolve();
        }, () => {
          reject();
        });
    });
  },

  resubscribe() {
    const api = get(this, 'api');
    return new Promise((resolve, reject) => {
      api.confirmListservSubscription( get(this, 'model.id') )
      .then(
        () => {
          set(this, 'messageTitle', 'You have been resubscribed.');
          set(this, 'hasFinished', true);
          resolve();
        }, () => {
          reject();
        });
    });
  },

  actions: {
    unsubscribe() {
      let message = "Are you sure you want to unsubscribe from the list?\nYou may miss out on content.";
      if (window.confirm(message)) {
        return this.unsubscribe();
      }
      //for the async-button
      return Promise.reject();
    },

    resubscribe() {
      return this.resubscribe();
    }
  }

});
