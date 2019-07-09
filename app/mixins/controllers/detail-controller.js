import { inject as service } from '@ember/service';
import { reads, readOnly } from '@ember/object/computed';
import { get, computed } from '@ember/object';

import Mixin from '@ember/object/mixin';

export default Mixin.create({
  //Overrides
  _defaultReturnPath: 'feed',
  _useOrgSlideMessage: false,
  _useBasicSlideMessage: false,


  media: service(),
  history: service(),
  tracking: service(),
  session: service(),
  userLocation: service(),

  isAuthenticated: readOnly('session.isAuthenticated'),

  isDirectLink: reads('history.isFirstRoute'),
  isMobile: readOnly('media.isMobile'),

  slideMessage: computed('isDirectLink', 'userLocation.userLocation', 'model.{location.name,organizationName}',
                          '_useOrgSlideMessage', '_useBasicSlideMessage', function() {
    if (get(this, '_useBasicSlideMessage')) {
      return 'Back';
    } else if (get(this, '_useOrgSlideMessage')) {
      const model = get(this, 'model');
      const organizationName = get(model, 'organizationName') || 'Contributor';

      if (get(this, 'isDirectLink')) {
        return `See more from ${organizationName}`;
      } else {
        return `Back to ${organizationName}`;
      }

    } else {
      let location;

      if (get(this, 'isAuthenticated') || !get(this, 'isDirectLink')) {
        location = get(this, 'userLocation.userLocation');
      } else {
        location = get(this, 'model.location');
      }

      if (get(this, 'isDirectLink')) {
        return `See more from ${get(location, 'name')}`;
      } else {
        return `Back to ${get(location, 'name')}`;
      }
    }
  }),

  actions: {
    closeDetailPage() {
      this.transitionToRoute(get(this, '_defaultReturnPath'));
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, get(this, 'contentType'), 'feed');
    }
  }
});
