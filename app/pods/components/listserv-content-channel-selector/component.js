import Ember from 'ember';

const { set, isPresent } = Ember;

export default Ember.Component.extend({
  "data-test-component": 'listserv-content-channel-selector',
  channelType: null,
  actions: {
    changeChannel(channel) {
      if(isPresent(this.attrs.action)) {
        this.attrs.action(channel);
      } else {
        set(this, 'channelType', channel);
      }
    }
  }
});
