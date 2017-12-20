import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'Feed-IndexFeed',

  feedItems: null,
  organization: null,
  canManage: false,
  displayAsPublic: false,
  hideComments: false
});
