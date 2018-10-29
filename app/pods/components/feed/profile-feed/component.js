import Component from '@ember/component';

export default Component.extend({
  classNames: 'Feed-ProfileFeed',

  feedItems: null,
  organization: null,
  canManage: false,
  canEditIfAllowed: true,
  displayAsPublic: false,
  hideComments: false,
  condensedView: false
});
