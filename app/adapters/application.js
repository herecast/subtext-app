import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { ActiveModelAdapter } from 'active-model-adapter';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';
import qs from 'npm:qs';
import parseResponseHeaders from 'subtext-ui/utils/parse-response-headers';

import { cloneDeep } from 'lodash';

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
  ajax(url, type, options) {
    const queryCache = get(this, 'queryCache');

    if(type === 'GET') {
      const data = queryCache.retrieveFromCache(
        this._urlPlusQuery(url, options)
      );

      if(data) {
        return RSVP.resolve(data);
      } else {
        if(get(this, 'isFastBoot')) {
          return this._getAndCache(url, type, options);
        }
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
  },

  _getAndCache(url, type, options) {
    /**
     * This is a copy of with modifications to allow immutable caching:
     * https://github.com/emberjs/data/blob/v2.4.0/addon/adapters/rest.js#L836
     */

    var adapter = this;

    var requestData = {
      url:    url,
      method: type
    };

    /** addition */
    const queryCache = get(this, 'queryCache');
    const defer = RSVP.defer();
    queryCache.cacheResponseIfFastboot(
      this._urlPlusQuery(url, options),
      defer.promise
    );
    /* /addition */

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var hash = adapter.ajaxOptions(url, type, options);

      hash.success = function(payload, textStatus, jqXHR) {
        /** addition */
        defer.resolve(
          //clone object
          cloneDeep(payload)
        );
        /* /addition */

        let response = adapter.handleResponse(
          jqXHR.status,
          parseResponseHeaders(jqXHR.getAllResponseHeaders()),
          payload,
          requestData
        );

        if (response && response.isAdapterError) {
          Ember.run.join(null, reject, response);
        } else {
          Ember.run.join(null, resolve, response);
        }
      };

      hash.error = function(jqXHR, textStatus, errorThrown) {
        /** addition */
        defer.reject(errorThrown);
        /* /addition */

        let error;

        if (errorThrown instanceof Error) {
          error = errorThrown;
        } else if (textStatus === 'timeout') {
          error = new Ember.Error();
        } else if (textStatus === 'abort') {
          error = new Ember.Error();
        } else {
          error = adapter.handleResponse(
            jqXHR.status,
            parseResponseHeaders(jqXHR.getAllResponseHeaders()),
            adapter.parseErrorResponse(jqXHR.responseText) || errorThrown,
            requestData
          );
        }

        Ember.run.join(null, reject, error);
      };

      adapter._ajaxRequest(hash);
    }, 'DS: RESTAdapter#ajax ' + type + ' to ' + url);
  }
});
