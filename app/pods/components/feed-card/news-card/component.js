import Ember from 'ember';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, computed, isPresent, inject } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-NewsCard',
  'data-test-news-card': computed.reads('model.title'),

  session: inject.service(),

  model: null,
  userLocation: null,

  organizations: computed.oneWay('session.currentUser.managedOrganizations'),

  userCanEditNews: computed('session.isAuthenticated', 'organizations.@each.id', 'model.organizationId', function() {
    if (get(this, 'session.isAuthenticated')) {
      return get(this, 'session.currentUser').then(currentUser => {
        return currentUser.isManagerOfOrganizationID(get(this, 'model.organizationId'));
      });
    } else {
      return false;
    }
  }),

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    let routeName = null;

    if (get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'))) {
      routeName = get(this, 'model.organizationBizFeedActive') ? 'biz.show' : 'organization-profile';
    }

    return routeName;
  }),

  attributionLinkId: computed.alias('model.organizationId'),

  sourceTag: computed('model.baseLocations.@each.{locationId,location.name}', 'userLocation.locationId', function() {
    const baseLocations = get(this, 'model.baseLocations');
    const userLocation = get(this, 'userLocation');

    // Display location matching user if multiple bases
    let baseLocation = baseLocations.findBy('location.id', get(userLocation, 'locationId')) ||
      get(baseLocations, 'firstObject');


    return isPresent(baseLocation) ? get(baseLocation, 'locationName') : undefined;
  })
});
