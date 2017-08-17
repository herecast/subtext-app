import Ember from 'ember';

const { get, set, computed, isPresent } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-MarketCard',

  model: null,
  userLocation: null,

  activeImageUrl: computed.oneWay('model.primaryImageUrl'),

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    let routeName = null;

    if (get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'))) {
      routeName = get(this, 'model.organizationBizFeedActive') ? 'biz.show' : 'organization-profile';
    }

    return routeName;
  }),

  attributionLinkId: computed.alias('model.organizationId'),

  sourceTag: computed('model.baseLocationNames', 'userLocation', function() {
    const baseLocationName = get(this, 'model.baseLocationNames')[0] || null;
    const userLocation = get(this, 'userLocation');

    return isPresent(baseLocationName) ? baseLocationName : userLocation;
  }),

  actions: {
    stopEditing() {
      set(this, 'isEditing', false);
    }
  }
});
