import Ember from 'ember';
import fetch from 'ember-network/fetch';
import config from '../config/environment';
import qs from 'npm:qs';

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
  Test
} = Ember;

let pendingRequestCount = 0;
if(testing) {
  Test.registerWaiter(function() {
    return pendingRequestCount === 0;
  });
}

function returnJson(request) {
  return request.then((response)=>response.json());
}

function returnText(request) {
  return request.then((response)=>response.text());
}

function queryString(data) {
  if(isPresent(data)) {
    return "?" + qs.stringify(data, { arrayFormat: 'brackets' });
  } else {
    return "";
  }
}


export default Ember.Service.extend({
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

  handleErrorStatus(request) {
    return new RSVP.Promise((resolve, reject) => {
      request.then((response) => {
        if(response.status < 300 && response.status >= 200) {
          resolve(response);
        } else {
          reject();
        }
      }, reject);
    });
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
        }, () => {
          pendingRequestCount = pendingRequestCount - 1;
          run.join(null, reject);
      });
    });
  },

  request(path, opts) {
    return this.handleErrorStatus(
      this.fetch(path, assign({
        method: 'GET'
      }, opts || {}))
    );
  },

  patch(path, opts) {
    return this.handleErrorStatus(
      this.fetch(path, assign({
        method: 'PATCH'
      }, opts || {}))
    );
  },

  del(path, opts) {
    return this.handleErrorStatus(
      this.fetch(path, assign({
        method: 'DELETE'
      }, opts || {}))
    );
  },

  put(path, opts) {
    return this.handleErrorStatus(
      this.fetch(path, assign({
        method: 'PUT'
      }, opts || {}))
    );
  },

  post(path, opts) {
    return this.handleErrorStatus(
      this.fetch(path, assign({
        method: 'POST'
      }, opts || {}))
    );
  },

  getJson(path) {
    const namespace = config.API_NAMESPACE;
    const host = config.API_BASE_URL;
    const apiUrl = host + "/" + namespace + path;
    const data = get(this, 'queryCache').retrieveFromCache(apiUrl);

    if(data) {
      return RSVP.resolve(data);
    } else {
      return returnJson(
        this.request(path)
      );
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
      exclude: opts['exclude'],
      limit: opts['limit'] || 5
    };
    const qstring = qs.stringify(query);
    return this.getJson(`/promotions?${qstring}`);
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

  getFeatures() {
    return this.getJson('/features');
  },

  getMarketContactInfo(id) {
    return this.getJson(`/market_posts/${id}/contact`);
  },

  getOrganizations(query) {
    let url = '/organizations';

    if (isPresent(query)) {
      url = url + queryString({query: query});
    }

    return this.getJson(url);
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

  recordPromoBannerImpression(id, data) {
    let body = "{}";
    if(isPresent(data)) {
      body = JSON.stringify(data);
    }
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

  recordNewsImpression(news) {
    return returnJson(
      this.post(`/news/${get(news, 'id')}/impressions`)
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

  resetPassword(data) {
    return returnJson(
      this.put('/password_resets', this.json(data))
    );
  },

  signOut() {
    return returnJson(
      this.post('/users/logout')
    );
  }

});
