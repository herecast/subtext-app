import Ember from 'ember';

const {
  get,
  inject,
  computed
} = Ember;

export default Ember.Component.extend({
  currentController  : inject.service(),
  currentChannel     : computed.alias('currentController.currentChannel'),

  channelLinksEnabled: true,

  displayChannelLinks: computed('channelLinksEnabled', 'media.isNotMobile', function() {
    return get(this, 'channelLinksEnabled') && get(this, 'media.isNotMobile');
  }),

  actions: {
    openSearch() {
      this.sendAction('openSearch');
    },
    trackHome() {
      if ('trackHome' in this.attrs) {
        this.attrs.trackHome(...arguments);
      }
    },
    trackChannel() {
      if ('trackChannel' in this.attrs) {
        this.attrs.trackChannel(...arguments);
      }
    },
    trackRegistration() {
      if ('trackRegistration' in this.attrs) {
        this.attrs.trackRegistration(...arguments);
      }
    },
    trackUserMenu() {
      if ('trackUserMenu' in this.attrs) {
        this.attrs.trackUserMenu(...arguments);
      }
    },
    trackMenuOpen() {
      if ('trackMenuOpen' in this.attrs) {
        this.attrs.trackMenuOpen(...arguments);
      }
    },
    signOut() {
      if ('signOut' in this.attrs) {
        this.attrs.signOut(...arguments);
      }
    }
  }
});
