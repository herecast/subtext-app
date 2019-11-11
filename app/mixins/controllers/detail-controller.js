import { inject as service } from '@ember/service';
import { reads, readOnly } from '@ember/object/computed';
import { get, computed } from '@ember/object';

import Mixin from '@ember/object/mixin';

export default Mixin.create({
  //Overrides
  _defaultReturnPath: 'feed',
  _useCasterSlideMessage: false,
  _useBasicSlideMessage: false,

  floatingActionButton: service(),
  media: service(),
  history: service(),
  router: service(),
  tracking: service(),
  session: service(),
  userLocation: service(),


  init() {
    this._super(...arguments);
    get(this, 'floatingActionButton')
    .on('closeShowModals', () => {
      const currentRouteName = get(this, 'router.currentRouteName');
      const defaultReturnIsParent = currentRouteName.indexOf(get(this, '_defaultReturnPath')) === 0;

      if (defaultReturnIsParent) {
        this._closeDetailPage();
      }
    });
  },

  isAuthenticated: readOnly('session.isAuthenticated'),

  isDirectLink: reads('history.isFirstRoute'),
  isMobile: readOnly('media.isMobile'),

  slideMessage: computed('isDirectLink', 'userLocation.userLocation', 'model.{location.name,casterName}',
                          '_useCasterSlideMessage', '_useBasicSlideMessage', function() {
    if (get(this, '_useBasicSlideMessage')) {
      return 'Back';
    } else if (get(this, '_useCasterSlideMessage')) {
      const model = get(this, 'model');
      const casterName = get(model, 'casterName') || 'Caster';

      if (get(this, 'isDirectLink')) {
        return `See more from ${casterName}`;
      } else {
        return `Back to ${casterName}`;
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

  _closeDetailPage() {
    this.transitionToRoute(get(this, '_defaultReturnPath'));
  },

  actions: {
    closeDetailPage() {
      this._closeDetailPage();
    },

    trackDetailEngagement(contentId, detailType, startOrComplete) {
      get(this, 'tracking').trackDetailEngagementEvent(contentId, detailType, startOrComplete, get(this, 'contentType'), 'feed');
    }
  }
});
