import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Controller.extend({
  api: inject.service(),
  showPreview: false,
  features: inject.service('feature-flags'),

  trackChannelSelection(channel) {
    get(this, 'api').updateListservProgress(
      get(this, 'model.id'), {
        channel_type: channel
    });
  },

  actions: {
    selectChannel(channel) {
      get(this, 'model').setProperties({
        channelType: channel,
        enhancedPost: null
      });

      this.trackChannelSelection(channel);
    },

    nextStep() {
      this.transitionToRoute('lists.posts.edit');
    }
  }
});
