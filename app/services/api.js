import Ember from 'ember';
import fetch from 'ember-network/fetch';
import config from '../config/environment';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';
import qs from 'npm:qs';

import {
  isRequestError,
  UnknownFetchError,
  detectResponseStatus,
  normalizeErrorResponse
} from 'subtext-ui/lib/request-utilities';

const {
  RSVP,
  copy,
  assign,
  inject,
  computed,
  get,
  run,
  isEmpty,
  isPresent,
  testing,
  Test,
} = Ember;

let pendingRequestCount = 0;
if(testing) {
  Test.registerWaiter(function() {
    return pendingRequestCount === 0;
  });
}

function returnJson(request) {
  return new RSVP.Promise((resolve, reject) => {
    let body = {};

    request.then((response)=>{
      if(response.status === 204) {
        body = {};
      } else {
        body = response.json();
      }

      resolve(body);
    }, (err)=> {
      const response = err.response;
      console.error(err);

      if(isRequestError(err)) {
        try {
          body = response.json();
        } catch(e) {
          console.error(e);
        }

        err.errors = normalizeErrorResponse(response.status, response.headers, body);
      }

      reject(err);
    });
  });
}

function returnText(request) {
  return new RSVP.Promise((resolve, reject) => {
    request.then((response)=>{
      resolve(response.text());
    }, (err) => {
      if(isRequestError(err)) {
        const response = err.response;
        let body = "";

        try {
          body = response.text();
        } catch(e) {
          console.error(e);
        }

        err.errors = normalizeErrorResponse(response.status, response.headers, body);
      }

      reject(err);
    });
  });
}

function queryString(data) {
  if(isPresent(data)) {
    return "?" + qs.stringify(data, { arrayFormat: 'brackets' });
  } else {
    return "";
  }
}

export default Ember.Service.extend(FastbootExtensions, {
  session: inject.service('session'),
  queryCache: inject.service('query-cache'),
  defaultHeaders: computed('session.isAuthenticated', function() {
    let headers = {};
    const session = get(this, 'session');
    const isAuthenticated = session.get('isAuthenticated');

    if (isAuthenticated) {
      session.authorize('authorizer:application', (headerName, headerValue) => {
        headers[headerName] = headerValue;
      });
    }

    headers['Consumer-App-Uri'] = config['CONSUMER_APP_URI'];
    headers['Accept'] = 'application/json';

    return headers;
  }),

  headers(overrides) {
    const defaults = get(this, 'defaultHeaders');
    overrides = overrides || {};
    return assign(copy(defaults), overrides);
  },

  json(data) {
    return {
      headers: this.headers({
        'Content-Type' : 'application/json; charset=utf-8'
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

    return new RSVP.Promise((resolve, reject) => {
      fetch(host + "/" + namespace + path, fetchOpts).then(
        (response) => {
          pendingRequestCount = pendingRequestCount - 1;
          run.join(null, resolve, response);
        }, (msg) => {
          console.error(msg);
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

    if(data) {
      return RSVP.resolve(data);
    } else {
      const response = returnJson(
        this.request(path).then((data) => {
          return data;
        })
      );
      queryCache.cacheResponseIfFastboot(apiUrl, response);

      return response;
    }
  },


  /********************************************************
   * API methods start here
   */
  confirmListservPost(id, data) {
    if (isEmpty(data)) {
      data = {
        listserv_content: {
          id: id
        }
      };
    }
    return returnJson(
      this.patch(`/listserv_contents/${id}`,
        this.json(data)
      )
    );
  },

  confirmListservSubscription(id) {
    return returnJson(
      this.patch(`/subscriptions/${id}/confirm`)
    );
  },

  unsubscribeSubscription(id) {
    return returnJson(
      this.del(`/subscriptions/${id}`)
    );
  },

  unsubscribeFromListserv(id, email) {
    const encodedEmail = encodeURIComponent(btoa(email));
    return returnJson(
      this.del(`/subscriptions/${id}/${encodedEmail}`)
    );
  },

  /*
   * Confirmed registration does a few things:
   * 1. it registers a new user account
   * 2. marks the user account confirmed (because of confirmation key)
   * 3. returns an authentication token for the user to be signed in
   *
   * confirmation_key is simply a combination of modelName and id, and the
   * backend uses it to ensure that it references a record which already
   * verifies an email address.  This can be a subscription or
   * listserv_content record.
   *
   * The required request data looks like this:
   * {
   *   registration: {
   *     email: <email>,
   *     name: <name>,
   *     confirmation_key: 'listserv_content/<listserv_content.id>'
   *   }
   * }
   */
  confirmedRegistration(data) {
    return returnJson(
      this.post('/registrations/confirmed',
        this.json(data)
      )
    );
  },

  createRegistration(data) {
    return returnJson(
      this.post('/users/sign_up',
        this.json(data)
      )
    );
  },

  createFeedback(id, data) {
    const url = `/businesses/${id}/feedback`;

    return returnJson(
      this.post(url,
        this.json(data)
      )
    );
  },

  updateFeedback(id, data) {
    const url = `/businesses/${id}/feedback`;

    return returnJson(
      this.put(url,
        this.json(data)
      )
    );
  },

  createImage(data) {
    return returnJson(
      this.post("/images",
        this.formData(data)
      )
    );
  },

  updateImage(imageId, data) {
    return returnJson(
      this.put(`/images/${imageId}`,
        this.json({
          image: data
        })
      )
    );
  },

  getDashboard(data) {
    return this.getJson('/dashboard' + queryString(data));
  },

  getContents(data) {
    return this.getJson('/contents' + queryString(data));
  },

  getContentMetrics(id, data) {
    return this.getJson(`/contents/${id}/metrics` + queryString(data));
  },

  getContentPromotions(options) {
    const opts = options || {};
    const query = {
      content_id: opts['content_id'],
      client_id: opts['client_id'],
      promotion_id: opts['promotion_id'],
      exclude: opts['exclude'],
      limit: opts['limit'] || 5
    };
    const qstring = queryString(query);
    return this.getJson(`/promotions${qstring}`);
  },

  getEventCategories() {
    return this.getJson('/event_categories');
  },

  getListServs() {
    return this.getJson("/listservs");
  },

  getLocations(query) {
    let url = '/locations';

    if (isPresent(query)) {
      url = url + queryString({query: query});
    }

    return this.getJson(url);
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

  getFeatures() {
    return this.getJson('/features');
  },

  getOrganizations(query) {
    let url = '/organizations';

    if (isPresent(query)) {
      url = url + queryString({query: query});
    }

    return this.getJson(url);
  },

  getOrganizationContents(id) {
    return this.getJson(`/organizations/${id}/contents`);
  },

  getPromotionBannerMetrics(id, data) {
    return this.getJson(`/promotion_banners/${id}/metrics` + queryString(data));
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

  getVenueLocation(venue_id) {
    return this.getJson(`/venues/${venue_id}/location`);
  },

  getVenueLocations(query) {
    let url = "/venue_locations";

    if (isPresent(query)) {
      url = url + queryString({query: query});
    }

    return this.getJson(url);
  },

  getWeather() {
    return returnText(
      this.request('/weather', {
        headers: this.headers({
          accept: 'text/html'
        })
      })
    );
  },

  isRegisteredUser(email) {
    // returns either a 404 Not Found or a 200 OK
    return this.getJson('/user/' + queryString({email: encodeURI(email)}));
  },

  updateCurrentUserAvatar(data) {
    return returnJson(
      this.put('/current_user',
        this.formData(data)
      )
    );
  },

  updateEventImage(id, data) {
    return returnJson(
      this.put(`/events/${id}`,
        this.formData(data)
      )
    );
  },

  updateOrganizationImage(id, data) {
    return returnJson(
      this.put(`/organizations/${id}`,
        this.formData(data)
      )
    );
  },

  updateTalkImage(id, data) {
    return returnJson(
      this.put(`/talk/${id}`,
        this.formData(data)
      )
    );
  },

  updateCurrentUserPassword(data) {
    return returnJson(
      this.put('/current_user', this.json(data))
    );
  },


  recordPromoBannerClick(id, data) {
    return returnJson(
      this.post(`/promotion_banners/${id}/track_click`,
        this.json(data)
      )
    );
  },

  recordPromoBannerImpression(id, data = {}) {
    const body = JSON.stringify(data);

    return returnText(
      this.post(`/promotion_banners/${id}/impression`, {
        body: body,
        headers: this.headers({
          'Accept' : 'text/plain',
          'Content-Type' : 'application/json'
        })
      })
    );
  },

  recordAdMetricEvent(data) {
    return returnJson(
      this.post(`/ad_metrics`,
        this.json(data)
      )
    );
  },

  recordContentImpression(id, data = {}) {

    return returnJson(
      this.post(`/metrics/contents/${id}/impressions`,
        this.json(data)
      )
    );
  },

  recordCouponRequest(id, data) {
    return returnJson(
      this.post(`/promotion_coupons/${id}/request_email`,
        this.json(data)
      )
    );
  },

  recordOrganizationContentPromotion(contentId, promotionRecord) {
    return returnJson(
      this.post(`/contents/${contentId}/promotions`,
        this.json({
          promotion: promotionRecord
        })
      )
    );
  },

  getOrganizationContentPromotions(contentId) {
    return this.getJson(`/contents/${contentId}/promotions`);
  },

  setOrganizationContentStatus(organizationId, contentId, data) {
    return returnJson(
      this.put(`/organizations/${organizationId}/contents/${contentId}`,
        this.json({
          content: data
        })
      )
    );
  },

  addOrganizationTagOnContent(organizationId, contentId) {
    return returnJson(
      this.post(`/organizations/${organizationId}/contents/${contentId}/tags`)
    );
  },

  removeOrganizationTagOnContent(organizationId, contentId) {
    return returnJson(
      this.del(`/organizations/${organizationId}/contents/${contentId}/tags`)
    );
  },

  removeContentLocation(id) {
    return returnJson(
      this.del(`/content_locations/${id}`)
    );
  },

  updateListservProgress(listserv_content_id, data) {
    return returnJson(
      this.patch(`/listserv_contents/${listserv_content_id}/update_metric`,
        this.json(data)
      )
    );
  },

  reportAbuse(content_id, flag_type) {
    return returnJson(
      this.post(`/contents/${content_id}/moderate`,
        this.json({
          flag_type: flag_type
        })
      )
    );
  },

  requestPasswordReset(email, returnUrl) {
    let data = {
      user: {
        email: email,
      }
    };

    if(returnUrl) {
      data['return_url'] = returnUrl;
    }

    return returnJson(
      this.post('/password_resets', this.json(data))
    );
  },

  resendConfirmation(email) {
    return returnJson(
      this.post('/users/resend_confirmation',
        this.json({
          user: {
            email: email
          }
        })
      )
    );
  },

  sendEmailSignInLink(email) {
    return returnJson(
      this.post('/users/email_signin_link',
        this.json({email:email})
      )
    );
  },

  resetPassword(data) {
    return returnJson(
      this.put('/password_resets', this.json(data))
    );
  },

  signOut() {
   return returnJson(
      this.post('/users/logout')
    );
  },

  sendUnconfirmedUserRegistration(name, email) {
    return returnJson(
      this.post('/temp_user_captures', this.json({name, email}))
    );
  },

  signInWithToken(token) {
    return returnJson(
      this.post('/users/sign_in_with_token', this.json({token: token}))
    );
  },

  signInWithOauth(authData) {
    return returnJson(
      this.post('/users/oauth', this.json(authData))
    );
  }
});
