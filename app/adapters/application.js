import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { ActiveModelAdapter } from 'active-model-adapter';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';
import qs from 'npm:qs';

import {
  AdapterError,
} from 'ember-data/adapters/errors';

const { RSVP, inject, get, isPresent } = Ember;

export default ActiveModelAdapter.extend(DataAdapterMixin, FastbootExtensions, {
  queryCache: inject.service('query-cache'),
  host: config.API_BASE_URL,
  namespace: config.API_NAMESPACE,
  coalesceFindRequests: true,
  authorizer: 'authorizer:application',
  headers: {
    "Consumer-App-Uri": config['CONSUMER_APP_URI']
  },

  handleResponse(status) {
    const response = this._super(...arguments);

    if (response instanceof AdapterError) {
      // Weirdly, status code isn't available on AdapterErrors
      response.status = status;
    }

    return response;
  },

  ajax(url, type, options) {
    const queryCache = get(this, 'queryCache');

    if(type === 'GET') {
      const data = queryCache.retrieveFromCache(
        this._urlPlusQuery(url, options)
      );

      if(data) {
        return RSVP.resolve(data);
      }
    }

    return this._super(url, type, options);
  },

  _urlPlusQuery(url, options) {
    let urlPlusQuery = url;
    if(isPresent(options['data'])) {
      const query = qs.stringify(options.data, {
        arrayFormat: 'brackets'
      });
      if(query.length > 0) {
        urlPlusQuery = `${urlPlusQuery}?${query}`;
      }
    }
    return urlPlusQuery;
  }
});
