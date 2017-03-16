import Ember from 'ember';

const { get, set, isPresent } = Ember;

export default Ember.Component.extend({
  "data-test-component": 'listserv-content-channel-selector',
  channelType: null,
  actions: {
    changeChannel(channel) {
      const action = get(this, 'action');
      if(isPresent(action)) {
        action(channel);
      } else {
        set(this, 'channelType', channel);
      }
    }
  }
});
