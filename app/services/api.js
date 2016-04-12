import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';
import config from '../config/environment';

const { inject, computed, get, isPresent } = Ember;

export default AjaxService.extend({
  namespace: config.API_NAMESPACE,
  session: inject.service('session'),
  headers: computed('session.isAuthenticated', {
    get() {
      let headers = {};
      const session = get(this, 'session');
      const isAuthenticated = session.get('isAuthenticated');

      if(isAuthenticated) {
        session.authorize('authorizer:application', (headerName, headerValue) => {
          headers[headerName] = headerValue;
        });
      }

      headers['Consumer-App-Uri'] = config['consumer-app-uri'];

      return headers;
    }
  }),

  createRegistration(data) {
    return this.post('/users/sign_up', {
      data: data
    });
  },

  createFeedback(id, data) {
    const url = `/businesses/${id}/feedback`;

    return this.post(url, {data: data});
  },

  createImage(data) {
    return this.post("/images", {
      //data is FormData
      data: data,
      type: 'POST',
      contentType: false,
      processData: false
    });
  },

  getDashboard(data) {
    return this.request('/dashboard', {data: data});
  },

  getContents(data) {
    return this.request('/contents', {data: data});
  },

  getContentMetrics(id, data) {
    return this.request(`/contents/${id}/metrics`, {
      data: data
    });
  },

  getContentPromotion(id) {
    return this.request(`/contents/${id}/related_promotion`);
  },

  getListServs() {
    return this.request("/listservs");
  },

  getLocations(query) {
    if (isPresent(query)) {
      return this.request('/locations', {
        data: {
          query: query
        }
      });
    } else {
      return this.request('/locations');
    }
  },

  getMarketContactInfo(id) {
    return this.request(`/market_posts/${id}/contact`);
  },

  getOrganizations(query) {
    if (isPresent(query)) {
      return this.request('/organizations', {
        data: {
          query: query
        }
      });
    } else {
      return this.request('/organizations');
    }
  },

  getPromotionBannerMetrics(id, data) {
    return this.request(`/promotion_banners/${id}/metrics`, {
      data: data
    });
  },


  getSimilarContent(content_id) {
    return this.request(`/contents/${content_id}/similar_content`);
  },

  getVenues(query) {
    if (isPresent(query)) {
      return this.request('/venues', {
        data: {
          query: query
        }
      });
    } else {
      return this.request('/venues');
    }
  },

  getVenueLocations(query) {
    if (isPresent(query)) {
      return this.request('/venue_locations', {
        data: {
          query: query
        }
      });
    } else {
      return this.request('/venue_locations');
    }
  },

  getWeather() {
    return this.request('/weather', {
      dataType: 'text'
    });
  },

  updateCurrentUserAvatar(data) {
    return this.request('/current_user', {
      type: 'PUT',
      //data is FormData
      data: data,
      contentType: false,
      processData: false
    });
  },

  updateEventImage(id, data) {
    return this.request(`/events/${id}`, {
      type: 'PUT',
      //data is FormData
      data: data,
      contentType: false,
      processData: false
    });
  },

  updateTalkImage(id, data) {
    return this.request(`/talk/${id}`, {
      type: 'PUT',
      //data is FormData
      data: data,
      contentType: false,
      processData: false
    });
  },

  updateCurrentUserPassword(data) {
    return this.put('/current_user', {
      data: data
    });
  },

  recordPromoBannerClick(id, data) {
    return this.post(`/promotion_banners/${id}/track_click`, {
      data: data
    });
  },

  reportAbuse(content_id, flag_type) {
    return this.post(`/contents/${content_id}/moderate`, {
      data: {
        flag_type: flag_type
      }
    });
  },

  requestPasswordReset(email) {
    return this.post('/password_resets', {
      data: {
        user: {
          email: email
        }
      }
    });
  },

  resendConfirmation(email) {
    return this.post('/users/resend_confirmation', {
      data: {
        user: {
          email: email
        }
      }
    });
  },

  resetPassword(data) {
    return this.put('/password_resets', {data: data});
  },

  signOut() {
    return this.post('/users/logout');
  }

});
