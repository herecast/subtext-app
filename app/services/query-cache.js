import Service, { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { computed, set, get } from '@ember/object';
import FastbootExtensions from 'subtext-app/mixins/fastboot-extensions';

export default Service.extend(FastbootExtensions, {
  windowLocation: service('window-location'),
  _disableCache: false,

  init() {
    this._super();

    if(!get(this, 'fastboot.isFastBoot')) {
      // Disable the cache after cold boot has re-rendered page
      run.later(()=>{
        if(!get(this, 'isDestroying')) {
          run.scheduleOnce('afterRender',this, this.disableCache);
        }
      }, 500);
    }
  },

  cacheResponseIfFastboot(url, response) {
    if(get(this, 'fastboot.isFastBoot')) {

      this.deferRenderingIfFastboot(response);

      return response.then((data) => {
        this.get('_apiCache')[url] = data;
        return data;
      }).catch(()=>{/* Silence error */});
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

  disableCache() {
    if(!get(this, 'isDestroying')) {
      set(this, '_disableCache', true);
    }
  },

  /** Private */
  _apiCache: computed('_disableCache', function() {
    if(get(this, '_disableCache')) {
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
