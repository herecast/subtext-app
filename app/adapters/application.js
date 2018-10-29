import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { get, set } from '@ember/object';
import { isPresent } from '@ember/utils';
import config from 'subtext-ui/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { ActiveModelAdapter } from 'active-model-adapter';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';
import qs from 'npm:qs';

import { AdapterError } from 'ember-data/adapters/errors';

export default ActiveModelAdapter.extend(DataAdapterMixin, FastbootExtensions, {
  queryCache: service('query-cache'),
  logger: service('logger'),
  host: config.API_BASE_URL,
  namespace: config.API_NAMESPACE,
  coalesceFindRequests: true,
  authorizer: 'authorizer:application',

  init() {
    this._super(...arguments);

    set(this, 'headers', {
      "Consumer-App-Uri": config['CONSUMER_APP_URI']
    });
  },

  handleResponse(status) {
    const response = this._super(...arguments);

    if (response instanceof AdapterError) {
      // Weirdly, status code isn't available on AdapterErrors
      response.status = status;
    }

    if (status >= 500) {
      // The adapter returns a malformed response message, which breaks our ability to build a stack trace
      // So, pull the useful information from the response message and log it with a new error
      get(this, 'logger').error(new Error(response.message.split("\n")[0]));
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
