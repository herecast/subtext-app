import Ember from 'ember';

const { get, computed, isPresent } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-TalkCard',

  model: null,
  userLocation: null,
  isLoggedIn: false,

  activeImageUrl: computed.oneWay('model.primaryImageUrl'),

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    let routeName = null;

    if (get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'))) {
      routeName = get(this, 'model.organizationBizFeedActive') ? 'biz.show' : 'organization-profile';
    }

    return routeName;
  }),

  attributionLinkId: computed.alias('model.organizationId'),

  sourceTag: computed('model.baseLocationNames', 'model.isListserv', 'userLocation', function() {
    const baseLocationName = get(this, 'model.baseLocationNames')[0] || null;
    const isListserv = get(this, 'model.isListserv');
    const userLocation = get(this, 'userLocation');

    if (isListserv) {
      return isPresent(baseLocationName) ? `${baseLocationName} List` : `${userLocation} List`;
    }

    return isPresent(baseLocationName) ? baseLocationName : userLocation;
  })
});
