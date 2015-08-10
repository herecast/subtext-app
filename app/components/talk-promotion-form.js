import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',

  session: Ember.inject.service('session'),
  userLocation: Ember.computed.oneWay('session.currentUser.location'),
  listservName: Ember.computed.oneWay('session.currentUser.listservName'),
  listservId: Ember.computed.oneWay('session.currentUser.listservId'),

  listEnabled: Ember.computed.notEmpty('talk.listservId'),

  actions: {
    back() {
      this.sendAction('backToDetails');
    },

    preview() {
      this.sendAction('afterPromotion');
    },

    discard() {
      if (confirm('Are you sure you want to discard this talk?')) {
        const talk = this.get('talk');
        talk.destroyRecord();
        this.sendAction('afterDiscard');
      }
    },

    toggleListserv() {
      if (this.get('listEnabled')) {
        this.set('talk.listservId', null);
      } else {
        this.set('talk.listservId', this.get('listservId'));
      }
    }
  }
});
