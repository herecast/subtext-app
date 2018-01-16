import Ember from 'ember';
import moment from 'moment';
import reloadComments from 'subtext-ui/mixins/reload-comments';

const { get, computed, isPresent, inject:{service} } = Ember;

export default Ember.Component.extend(reloadComments, {
  classNames: 'FeedCard-EventCard',
  'data-test-event-card': computed.reads('model.title'),
  'data-test-content': computed.oneWay('model.contentId'),

  model: null,
  context: null,
  userLocation: service(),

  startTime: computed('model.startsAt', function() {
    const startsAt = get(this, 'model.startsAt');

    return isPresent(startsAt) ? moment(startsAt).format('h:mma') : null;
  }),

  endTime: computed('model.endsAt', function() {
    const endsAt = get(this, 'model.endsAt');

    return isPresent(endsAt) ? moment(endsAt).format('h:mma') : null;
  }),

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    const shouldLinkToProfile = get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'));

    return shouldLinkToProfile ? 'profile' : null;
  }),

  attributionLinkId: computed.alias('model.organizationId'),

  sourceTag: computed('userLocation.locationId', 'model.{venueCity,venueState}', function() {
    const baseLocations = get(this, 'model.baseLocations') || [];
    const userLocation = get(this, 'userLocation');

    // Display location matching user if multiple bases
    let baseLocation = baseLocations.findBy('location.id', get(userLocation, 'locationId')) ||
      get(baseLocations, 'firstObject');

    return isPresent(baseLocation) ? get(baseLocation, 'locationName') : `${get(this, 'model.venueCity')}, ${get(this, 'model.venueState')}`;
  }),

  actions: {
    onContentClick() {
      const onContentClick = get(this, 'context.onContentClick');
      if (onContentClick) {
        onContentClick();
      }
    },

    openPromotionMenu() {
      const openPromotionMenu = get(this, 'context.openPromotionMenu');
      if (openPromotionMenu) {
        openPromotionMenu();
      }
    }
  }

});
