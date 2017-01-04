import Ember from 'ember';
import config from './../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { ActiveModelAdapter } from 'active-model-adapter';
import qs from 'npm:qs';

const { RSVP, inject, get, isPresent } = Ember;

export default ActiveModelAdapter.extend(DataAdapterMixin, {
  queryCache: inject.service('query-cache'),
  host: config.API_BASE_URL,
  namespace: config.API_NAMESPACE,
  coalesceFindRequests: true,
  authorizer: 'authorizer:application',
  headers: {
    "Consumer-App-Uri": config['CONSUMER_APP_URI']
  },

  ajax(url, type, options) {
    const queryCache = get(this, 'queryCache');

    if(type === 'GET') {
      let urlPlusQuery = url;
      if(isPresent(options['data'])) {
        urlPlusQuery = urlPlusQuery + qs.stringify(options.data, {
          arrayFormat: 'brackets'
        });
      }

      const data = queryCache.retrieveFromCache(urlPlusQuery);

      if(data) {
        return RSVP.resolve(data);
      } else {
        return queryCache.cacheResponseIfFastboot(urlPlusQuery,
          this._super(url, type, options)
        );
      }
    } else {
      return this._super(url, type, options);
    }
  },

  _ajaxRequest(options) {
    if(options.type === 'GET') {
      const queryCache = get(this, 'queryCache');
      let urlPlusQuery = options.url;
      if(isPresent(options['data'])) {
        urlPlusQuery = urlPlusQuery + qs.stringify(options.data, {
          arrayFormat: 'brackets'
        });
      }

      const data = queryCache.retrieveFromCache(urlPlusQuery);

      if(data) {
        return RSVP.resolve(data);
      } else {
        return queryCache.cacheResponseIfFastboot(urlPlusQuery,
          this._super(options)
        );
      }
    } else {
      return this._super(options);
    }
  },
});
