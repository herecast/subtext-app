import Ember from 'ember';

const { get, computed, isPresent } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-NewsCard',

  model: null,
  userLocation: null,

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

    return isPresent(baseLocationName) ? baseLocationName : get(this, 'userLocation');
  })
});
