import { get, set, setProperties, computed } from '@ember/object';
import { readOnly, not, equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent, isBlank } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import { optimizedImageUrl } from 'subtext-app/helpers/optimized-image-url';
import { run } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Feed-LocationCard'],

  'data-test-location-card-image': computed('showCasterCard', function() {
    return get(this, 'showCasterCard') ? 'caster-image' : 'location-image';
  }),

  cookies: service(),
  fastboot: service(),
  searchService: service('search'),
  session: service(),
  userLocationService: service('user-location'),

  showSearch: false,
  showChooser: false,
  streamlined: false,
  showCasterCard: false,
  hideChangeLocation: false,
  wantsToChangeLocation: false,

  _isLoadingImage: false,

  isNotFastBoot: not('fastboot.isFastBoot'),

  currentUser: readOnly('session.currentUser'),
  casterIsFeedSource: equal('feedService.feedSource', 'caster'),

  showLoadingAnimation: computed('userLocationService.isLoadingLocation', 'fastboot.isFastBoot', '_isLoadingImage', function() {
    return get(this, 'userLocationService.isLoadingLocation') || get(this, 'fastboot.isFastBoot') || get(this, '_isLoadingImage');
  }),

  showChangeLocation: not('hideChangeLocation'),

  loadingLocationName: computed('userLocationService.loadingLocation.name', 'fastboot.isFastBoot', function() {
    const loadingLocation = get(this, 'userLocationService.loadingLocation') || null;

    if (get(this, 'fastboot.isFastBoot') || isBlank(loadingLocation)) {
      return get(this, 'cookies').read('userLocationName') || null;
    }

    return get(loadingLocation, 'name');
  }),

  userLocation: readOnly('userLocationService.userLocation'),

  _imageHasError: false,
  imageUrl: computed('userLocation.imageUrl', 'fastboot.isFastBoot', function() {
    const imageUrl = get(this, 'userLocation.imageUrl') || null;

    if (isPresent(imageUrl) && !get(this, 'fastboot.isFastBoot')) {
      const options = [imageUrl, 500, 180, true];
      const optImageUrl = optimizedImageUrl(options);

      this._loadImage(optImageUrl);

      return optImageUrl;
    }

    return null;
  }),

  yourTown: computed('userLocation.city', function() {
    let yourTown = 'Your Town';

    if (get(this, 'userLocation.city')) {
      yourTown = get(this, 'userLocation.city');
    }

    return htmlSafe(yourTown);
  }),

  showImage: computed('imageUrl', '_imageHasError', function() {
    const imageUrl = get(this, 'imageUrl');
    const _imageHasError = get(this, '_imageHasError');

    return isPresent(imageUrl) && !_imageHasError;
  }),

  showDefaultImage: computed('fastboot.isFastBoot', 'showImage', '_isLoadingImage', function() {
    const isFastBoot = get(this, 'fastboot.isFastBoot');
    const showImage = get(this, 'showImage');
    const _isLoadingImage = get(this, '_isLoadingImage');

    return !isFastBoot && !showImage && !_isLoadingImage;
  }),

  hasCoordinates: computed('userLocation.{latitude,longitude}', function() {
    const userLocation = get(this, 'userLocation');
    const { latitude, longitude } = userLocation.getProperties('latitude', 'longitude');

    return isPresent(latitude) && isPresent(longitude);
  }),

  imageStyle: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl') || null;

    if (isPresent(imageUrl)) {
      return htmlSafe(`background-image: url('${imageUrl}');`);
    }

    return htmlSafe("");
  }),

  casterBackgroundImageStyle: computed('session.isAuthenticated', 'currentUser.backgroundImageUrl',  function() {
    const defaultBackgroundImageUrl = '/images/caster_default_background_500x300.jpg';
    const backgroundImageUrl = get(this, 'currentUser.backgroundImageUrl') || defaultBackgroundImageUrl;

    return htmlSafe(`background-image: url('${backgroundImageUrl}');`);
  }),

  showFeedChooser: computed('fastboot.isFastBoot', 'streamlined', function() {
    return !get(this, 'fastboot.isFastBoot') && !(get(this, 'streamlined'));
  }),

  showBotttomBar: computed('showSearch', 'showChooser', 'streamlined', function() {
    if (get(this, 'streamlined')) {
      return false;
    } else {
      return get(this, 'showSearch') || get(this, 'showChooser');
    }
  }),

  _loadImage(url) {
    setProperties(this, {
      '_isLoadingImage': true,
      '_imageHasError': false
    });

    let image = new Image();

    image.onload = () => {
      run( () => {
        if (!get(this, 'isDestroyed')) {
          set(this, '_isLoadingImage', false);
        }
      });
    };

    image.onerror = () => {
      run( () => {
        if (!get(this, 'isDestroyed')) {
          setProperties(this, {
            '_imageHasError': true,
            '_isLoadingImage': false
          });
        }
      });
    };

    image.src = url;
  },

  actions: {
    updateSearchQuery(query) {
      get(this, 'searchService').performSearch(query);
    },

    clearSearch() {
      get(this, 'searchService').clearSearch();
    },

    toggleChangeLocation() {
      this.toggleProperty('wantsToChangeLocation');
    }
  }
});
