import Ember from 'ember';
import qs from 'npm:qs';
import { cloneDeep } from 'lodash';

const {
  getOwner,
  isPresent,
  RSVP
} = Ember;

function _urlPlusQuery(options) {
  let urlPlusQuery = options.url;

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

/**
 * This custom _ajaxRequest method will put the results of GET requests
 * into the shoebox cache. It needs to replace the ajax success and error
 * callbacks to get access to the response before the data adapter does.
 *
 * It will call the custom Fastboot _ajaxRequest for actual ajax processing.
 */
function cacheAjaxRequest(options) {
  const appInstance = getOwner(this);

  // Get Fastboot's custom ajax handler
  const fastbootAjaxRequest = appInstance.lookup('ajax:node');

  if(options.type === 'GET') {
    const adapterSuccess = options.success;
    const adapterError = options.error;
    const queryCache = appInstance.lookup('service:queryCache');
    const defer = RSVP.defer();

    queryCache.cacheResponseIfFastboot(
      _urlPlusQuery(options),
      defer.promise
    );

    options.success = function(payload, textStatus, jqXHR) {
      defer.resolve(
        cloneDeep(payload)
      );

      adapterSuccess(payload, textStatus, jqXHR);
    };

    options.error = function(jqXHR, textStatus, errorThrown) {
      defer.reject(errorThrown);
      adapterError(...arguments);
    };
  }

  return fastbootAjaxRequest.apply(this, [options]);
}

/**
 * We'are injecting a custom _ajaxRequest method here like Fastboot does
 */
export function initialize( application ) {
  application.register('ajax:cacheAjaxRequest', cacheAjaxRequest, { instantiate: false });
  application.inject('adapter', '_ajaxRequest', 'ajax:cacheAjaxRequest');
}

export default {
  name: 'fastboot/cache-ajax-requests',
  after: 'ajax-service',
  initialize
};
