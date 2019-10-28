import Service, { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { assign } from '@ember/polyfills';
import { get, computed } from '@ember/object';
import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import fetch from 'fetch';
import qs from 'npm:qs';
import { registerWaiter } from '@ember/test';
import config from 'subtext-app/config/environment';

import {
  isRequestError,
  UnknownFetchError,
  detectResponseStatus,
  normalizeErrorResponse
} from 'subtext-app/lib/request-utilities';

let pendingRequestCount = 0;

function queryString(data) {
  if (isPresent(data)) {
    return "?" + qs.stringify(data, {arrayFormat: 'brackets'});
  } else {
    return "";
  }
}

export default Service.extend({
  session: service('session'),
  queryCache: service('query-cache'),
  logger: service(),

  defaultHeaders: computed('session.isAuthenticated', function () {
    let headers = {};
    const session = get(this, 'session');
    const isAuthenticated = session.get('isAuthenticated');

    if (isAuthenticated) {
      const {email, token} = get(this, 'session.data.authenticated');
      const authData = `Token token="${token}", email="${email}"`;

      headers['Authorization'] = authData;
    }

    headers['Consumer-App-Uri'] = config['CONSUMER_APP_URI'];
    headers['Accept'] = 'application/json';

    return headers;
  }),

  headers(overrides) {
    const defaults = get(this, 'defaultHeaders');
    overrides = overrides || {};
    return assign(Object.assign({}, defaults), overrides);
  },

  json(data) {
    return {
      headers: this.headers({
        'Content-Type': 'application/json; charset=utf-8'
      }),
      body: JSON.stringify(data)
    };
  },

  formData(data) {
    return {
      body: data
    };
  },

  fetch(path, opts) {
    const namespace = config.API_NAMESPACE;
    const host = config.API_BASE_URL;

    // Merge opts into defaults
    const fetchOpts = assign({
      headers: this.headers(),
      mode: 'cors',
      // enable cookies
      credentials: 'include'
    }, (opts || {}));
    /**
     * It gets more complicated here to enable pausing of acceptance testing
     * with the test helpers. Otherwise we could just return the promise from
     * fetch.
     */
    pendingRequestCount = pendingRequestCount + 1;

    if (config.environment === 'test' || config.environment === 'development') {
      registerWaiter(() => pendingRequestCount === 0);
    }

    return new RSVP.Promise((resolve, reject) => {
      fetch(host + "/" + namespace + path, fetchOpts).then(
        (response) => {
          pendingRequestCount = pendingRequestCount - 1;
          run.join(null, resolve, response);
        }, (msg) => {
          get(this, 'logger').error(new Error(msg));
          pendingRequestCount = pendingRequestCount - 1;
          run.join(null, reject, new UnknownFetchError());
        });
    });
  },

  request(path, opts) {
    return this.fetch(path, assign({
      method: 'GET'
    }, opts || {})).then(detectResponseStatus);
  },

  patch(path, opts) {
    return this.fetch(path, assign({
      method: 'PATCH'
    }, opts || {})).then(detectResponseStatus);
  },

  del(path, opts) {
    return this.fetch(path, assign({
      method: 'DELETE'
    }, opts || {})).then(detectResponseStatus);
  },

  put(path, opts) {
    return this.fetch(path, assign({
      method: 'PUT'
    }, opts || {})).then(detectResponseStatus);
  },

  post(path, opts) {
    return this.fetch(path, assign({
      method: 'POST'
    }, opts || {})).then(detectResponseStatus);
  },

  getJson(path) {
    const namespace = config.API_NAMESPACE;
    const host = config.API_BASE_URL;
    const apiUrl = host + "/" + namespace + path;
    const queryCache = get(this, 'queryCache');
    const data = queryCache.retrieveFromCache(apiUrl);

    if (data) {
      return RSVP.resolve(data);
    } else {
      const response = this.returnJson(
        this.request(path).then((data) => {
          return data;
        })
      );
      queryCache.cacheResponseIfFastboot(apiUrl, response);

      return response;
    }
  },

  returnJson(request) {
    return new RSVP.Promise((resolve, reject) => {
      let body = {};
      request.then((response) => {
        if (response.status === 204) {
          body = {};
        } else {
          body = response.json();
        }

        resolve(body);
      }, (err) => {
        const response = err.response;
        get(this, 'logger').error(err);

        if (isRequestError(err)) {
          try {
            response.json().then((body) => {
              err.errors = normalizeErrorResponse(response.status, response.headers, body);
              reject(err);
            });
          } catch (e) {
            get(this, 'logger').error(e);
            reject(err);
          }
        } else {
          reject(err);
        }
      });
    });
  },

  returnText(request) {
    return new RSVP.Promise((resolve, reject) => {
      request.then((response) => {
        resolve(response.text());
      }, (err) => {
        if (isRequestError(err)) {
          const response = err.response;

          try {
            response.text().then((body) => {
              err.errors = normalizeErrorResponse(response.status, response.headers, body);
              reject(err);
            });
          } catch (e) {
            get(this, 'logger').error(e);
            reject(err);
          }
        } else {
          reject(err);
        }
      });
    });
  },

  /********************************************************
   * API methods start here
   */

  createRegistration(data) {
    return this.returnJson(
      this.post('/users/sign_up',
        this.json(data)
      )
    );
  },

  createImage(data) {
    return this.returnJson(
      this.post("/images",
        this.formData(data)
      )
    );
  },

  updateImage(imageId, data) {
    return this.returnJson(
      this.put(`/images/${imageId}`,
        this.json({
          image: data
        })
      )
    );
  },

  getContents(data) {
    return this.getJson('/contents' + queryString(data));
  },

  getContentMetrics(id, data) {
    return this.getJson(`/contents/${id}/metrics` + queryString(data));
  },

  getCurrentUserPayments(userId, data = null) {
    return this.getJson(`/users/${userId}/payments` + queryString(data));
  },

  getCurrentUserContentMetrics(userId, data = null) {
    return this.getJson(`/users/${userId}/metrics` + queryString(data));
  },

  getContentPromotions(options) {
    const opts = options || {};
    const query = {
      content_id: opts['content_id'],
      client_id: opts['client_id'],
      promotion_id: opts['promotion_id'],
      location_id: opts['location_id'],
      exclude: opts['exclude'],
      limit: opts['limit'] || 5
    };
    const qstring = queryString(query);
    return this.getJson(`/promotions${qstring}`);
  },

  getContentPermissions(content_id) {
    const query = {
      content_ids: [content_id]
    };
    const qstring = queryString(query);
    return this.getJson(`/content_permissions${qstring}`);
  },

  getDaysWithEvents(query) {
    return this.getJson(`/event_instances/active_dates${queryString(query)}`);
  },

  getLocationsNear(location, radius = 10) {
    let url = `/locations/${location.id}/near?radius=${radius}`;

    return this.getJson(url);
  },

  getLocationFromIP() {
    return this.getJson('/locations/locate');
  },

  getLocationFromCoords(lat, lng) {
    let url = '/locations/locate';
    const coords = `${lat},${lng}`;

    url = url + queryString({coords});

    return this.getJson(url);
  },


  getPromotionBannerMetrics(id, data) {
    return this.getJson(`/promotion_banners/${id}/metrics` + queryString(data));
  },

  getPaymentReport(data) {
    const url = `/payment_reports` + queryString(data);

    return this.returnText(this.request(url));
  },

  getSimilarContent(content_id) {
    return this.getJson(`/contents/${content_id}/similar_content`);
  },

  getVenues(query) {
    let url = '/venues';

    if (isPresent(query)) {
      url = url + queryString({query: query});
    }

    return this.getJson(url);
  },

  getVenueLocations(query) {
    let url = "/venue_locations";

    if (isPresent(query)) {
      url = url + queryString({query: query});
    }

    return this.getJson(url);
  },

  isExistingHandle(handle) {
    return this.getJson(`/casters/handles/validation?handle=${encodeURIComponent(handle)}`);
  },

  isExistingEmail(email) {
    return this.getJson(`/casters/emails/validation?email=${encodeURIComponent(email)}`);
  },

  checkCurrentPassword(casterId, password) {
    return this.returnJson(
      this.post(`/current_users/password_validation`,
        this.json({password})
      )
    );
  },

  updateCurrentUserImage(data) {
    return this.returnJson(
      this.put(`/current_user`,
        this.formData(data)
      )
    );
  },

  updateEventImage(id, data) {
    return this.returnJson(
      this.put(`/events/${id}`,
        this.formData(data)
      )
    );
  },

  updateCurrentUserPassword(data) {
    return this.returnJson(
      this.put('/current_user', this.json(data))
    );
  },

  updateCurrentUserLocation(data) {
    return this.returnJson(
      this.put('/current_user', this.json(data))
    );
  },


  recordPromoBannerClick(id, data) {
    return this.returnJson(
      this.post(`/promotion_banners/${id}/track_click`,
        this.json(data)
      )
    );
  },

  recordPromoBannerLoad(id, data) {
    return this.returnJson(
      this.post(`/promotion_banners/${id}/track_load`,
        this.json(data)
      )
    );
  },

  recordPromoBannerImpression(id, data = {}) {
    const body = JSON.stringify(data);

    return this.returnText(
      this.post(`/promotion_banners/${id}/impression`, {
        body: body,
        headers: this.headers({
          'Accept': 'text/plain',
          'Content-Type': 'application/json'
        })
      })
    );
  },

  recordProfileEvent(id, data = {}) {
    const body = JSON.stringify(data);

    return this.returnJson(
      this.post(`/metrics/profiles/${id}`, {
        body: body,
        headers: this.headers({
          'Accept': 'text/plain',
          'Content-Type': 'application/json'
        })
      })
    );
  },

  recordContentImpression(id, data = {}) {
    return this.returnJson(
      this.post(`/metrics/contents/${id}/impressions`,
        this.json(data)
      )
    );
  },

  removeContentLocation(id) {
    return this.returnJson(
      this.del(`/content_locations/${id}`)
    );
  },

  reportAbuse(content_id, flag_type) {
    return this.returnJson(
      this.post(`/contents/${content_id}/moderate`,
        this.json({
          flag_type: flag_type
        })
      )
    );
  },

  agreeToPublisherAgreement(userId) {
    return this.returnJson(
      this.post(`/users/${userId}/publisher_agreements`)
    );
  },

  requestPasswordReset(email, returnUrl) {
    let data = {
      user: {
        email: email,
      }
    };

    if (returnUrl) {
      data['return_url'] = returnUrl;
    }

    return this.returnJson(
      this.post('/password_resets', this.json(data))
    );
  },

  resendConfirmation(email) {
    return this.returnJson(
      this.post('/users/resend_confirmation',
        this.json({
          user: {
            email: email
          }
        })
      )
    );
  },

  resetPassword(data) {
    return this.returnJson(
      this.put('/password_resets', this.json(data))
    );
  },

  signOut() {
    return this.returnJson(
      this.post('/users/logout')
    );
  },

  sendUnconfirmedUserRegistration(name, email) {
    return this.returnJson(
      this.post('/temp_user_captures', this.json({name, email}))
    );
  },

  signInWithOauth(authData) {
    return this.returnJson(
      this.post('/users/oauth', this.json(authData))
    );
  }
});
