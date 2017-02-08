import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  listservName: computed.alias('listservContent.listserv.name'),
  channelType: computed.alias('listservContent.channelType'),

  actions: {
    nextStep() {
      this.transitionToRoute('lists.posts.review');
    }
  }
});
