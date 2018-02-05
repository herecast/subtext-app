import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'Feed-ProfileFeed',

  feedItems: null,
  organization: null,
  canManage: false,
  displayAsPublic: false,
  hideComments: false,
  condensedView: false
});
