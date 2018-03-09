import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'Feed-ProfileFeed',

  feedItems: null,
  organization: null,
  canManage: false,
  canEditIfAllowed: true,
  displayAsPublic: false,
  hideComments: false,
  condensedView: false
});
