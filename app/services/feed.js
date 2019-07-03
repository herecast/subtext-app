import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { Promise } from 'rsvp';
import Service from '@ember/service';

export default Service.extend({
  fastboot: service(),
  store: service(),
  userLocation: service(),

  _minimumItemsToBeLive: 100,
  flowthroughParams: Object.freeze(['query', 'type', 'startDate']),

  showPioneeringFeed: false,

  feedModel: null,

  changeFeedModel(feedModel, params) {
    set(this, 'showPioneeringFeed', false);

    return new Promise(resolve => {
      if (!get(this, 'fastboot.isFastBoot') && this._shouldShowPioneerFeed(feedModel, params)) {
        this._getPioneerFeed()
        .then(feedModel => {
          resolve(feedModel);
        });
      } else {
        resolve(feedModel);
      }
    });
  },

  _shouldShowPioneerFeed({ feedItems, eventInstances }, params) {
    const flowthroughParams = get(this, 'flowthroughParams');
    const matchingParam = flowthroughParams.find(param => {
      return isPresent(params[param]);
    });

    if (isPresent(matchingParam)) {
      return false;
    }

    const totalFeedItems = get(feedItems, 'meta.total') || 0;
    const totalEventInstances = get(eventInstances, 'meta.total') || 0;
    const _minimumItemsToBeLive = get(this, '_minimumItemsToBeLive');

    return totalFeedItems < _minimumItemsToBeLive && totalEventInstances < _minimumItemsToBeLive;
  },

  _getPioneerFeed() {
    set(this, 'showPioneeringFeed', true);

    return get(this, 'store').query('feed-item', {
      location_id: get(this, 'userLocation.defaultUserLocationId'),
      per_page: 4,
      page: 1
    })
    .then((defaultModel) => {
      return {feedItems: defaultModel};
    });
  }

});
