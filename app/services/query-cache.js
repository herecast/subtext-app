import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const {
  get,
  run,
  set,
  computed,
  inject
} = Ember;

export default Ember.Service.extend({
  fastboot: inject.service(),
  windowLocation: inject.service('window-location'),
  disableCache: false,
  cacheTimeout: config.FASTBOOT_DATA_CACHE_TIMEOUT,

  init() {
    this._super();

    if(!get(this, 'fastboot.isFastBoot')) {
      const cacheTimeout = get(this, 'cacheTimeout');
      const cacheTimeoutEnabled = !(
        (cacheTimeout === false) || (cacheTimeout === 'false')
      );

      if(cacheTimeoutEnabled) {
        run.later(() => {
          if(!get(this, 'isDestroying')) {
            set(this, 'disableCache', true);
          }
        }, parseInt(get(this, 'cacheTimeout')));
      }
    }
  },

  cacheResponseIfFastboot(url, response) {
    if(get(this, 'fastboot.isFastBoot')) {

      get(this, 'fastboot').deferRendering(response);

      return response.then((data) => {
        this.get('_apiCache')[url] = data;
        return data;
      });
    } else {
      return response;
    }
  },

  retrieveFromCache(url) {
    if(!get(this, 'fastboot.isFastBoot')) {
      const win = get(this, 'windowLocation');
      const fbPath = get(this, '_fbRequestPath');
      const path = win.pathname() + win.search();

      // if this path is the same as the fastboot path
      if(path === fbPath) {
        return get(this, '_apiCache')[url];
      } else {
        return null;
      }
    } else {
      return null;
    }
  },

  /** Private */

  _apiCache: computed('disableCache', function() {
    if(get(this, 'disableCache')) {
      return {};
    }

    const path = get(this, '_fbRequestPath');

    let apiCache = this._findOrCreateShoebox('apiCache');

    apiCache[path] = apiCache[path] || {};

    return apiCache[path];
  }),

  _fbRequestPath: computed(function() {
    const isFastBoot = get(this, 'fastboot.isFastBoot');
    let fbRequest = this._findOrCreateShoebox('fastboot-request');

    if(isFastBoot) {
      const path = get(this, 'fastboot.request.path');

      fbRequest['path'] = path;

      return path;
    } else {
      return fbRequest['path'];
    }
  }),

  _findOrCreateShoebox(name) {
    const isFastBoot = get(this, 'fastboot.isFastBoot');
    const shoebox = get(this, 'fastboot.shoebox');
    let store = shoebox.retrieve(name);

    if(isFastBoot) {
      if(!store) {
        store = {};
        shoebox.put(name, store);
      }
    }

    return store || {};
  }
});
