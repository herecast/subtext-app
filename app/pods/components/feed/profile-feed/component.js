import Component from '@ember/component';

export default Component.extend({
  classNames: 'Feed-ProfileFeed',

  feedItems: null,
  organization: null,
  allowManageOnTile: false,
  canEditIfAllowed: true,
  displayAsPublic: false,
  showAnyViewCount: false
});
