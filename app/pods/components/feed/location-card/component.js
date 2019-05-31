import { get, set, setProperties, computed } from '@ember/object';
import { readOnly, notEmpty, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent, isBlank } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';
import { run } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Feed-LocationCard'],

  cookies: service(),
  fastboot: service(),
  searchService: service('search'),
  userLocationService: service('user-location'),

  showSearch: false,
  showChooser: false,

  _isLoadingImage: false,
  _defaultImageUrl: 'https://s3.amazonaws.com/subtext-misc/dailyuv_locationdefault_500x180.png',

  showLoadingAnimation: computed('userLocationService.isLoadingLocation', 'fastboot.isFastBoot', '_isLoadingImage', function() {
    return get(this, 'userLocationService.isLoadingLocation') || get(this, 'fastboot.isFastBoot') || get(this, '_isLoadingImage');
  }),

  loadingLocationName: computed('userLocationService.loadingLocation.name', 'fastboot.isFastBoot', function() {
    const loadingLocation = get(this, 'userLocationService.loadingLocation') || null;

    if (get(this, 'fastboot.isFastBoot') || isBlank(loadingLocation)) {
      return get(this, 'cookies').read('userLocationName') || null;
    }

    return get(loadingLocation, 'name');
  }),

  userLocation: readOnly('userLocationService.userLocation'),

  imageUrl: oneWay('userLocation.imageUrl'),

  hasImageUrl: notEmpty('imageUrl'),

  hasCoordinates: computed('userLocation.{latitude,longitude}', function() {
    const userLocation = get(this, 'userLocation');
    const { latitude, longitude } = userLocation.getProperties('latitude', 'longitude');

    return isPresent(latitude) && isPresent(longitude);
  }),

  imageStyle: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl') || get(this, '_defaultImageUrl');

    if (isPresent(imageUrl) && !get(this, 'fastboot.isFastBoot')) {
      const options = [imageUrl, 500, 180, true];
      const optImageUrl = optimizedImageUrl(options);

      this._loadImage(optImageUrl);

      return htmlSafe(`background-image: url('${optImageUrl}');`);
    }

    return '';
  }),

  _loadImage(url) {
    set(this, '_isLoadingImage', true);

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
            'imageUrl': null,
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
    }
  }
});
