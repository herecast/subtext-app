import Ember from 'ember';
import moment from 'moment';


const { get, computed, isPresent } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-EventCard',

  model: null,
  userLocation: null,

  startTime: computed('model.startsAt', function() {
    const startsAt = get(this, 'model.startsAt');

    return isPresent(startsAt) ? moment(startsAt).format('h:mma') : null;
  }),

  endTime: computed('model.endsAt', function() {
    const endsAt = get(this, 'model.endsAt');

    return isPresent(endsAt) ? moment(endsAt).format('h:mma') : null;
  }),

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    let routeName = null;

    if (get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'))) {
      routeName = get(this, 'model.organizationBizFeedActive') ? 'biz.show' : 'organization-profile';
    }

    return routeName;
  }),

  attributionLinkId: computed.alias('model.organizationId'),

  sourceTag: computed('model.{baseLocationNames,venueCity,venueState}', 'userLocation', function() {
    const baseLocationName = get(this, 'model.baseLocationNames')[0] || null;

    return isPresent(baseLocationName) ? baseLocationName : `${get(this, 'model.venueCity')}, ${get(this, 'model.venueState')}`;
  })
});
