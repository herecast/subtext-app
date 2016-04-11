import Ember from 'ember';

import Config from '../config/environment';
/* global mixpanel */

const { get, merge, computed, isEmpty, on } = Ember;

export default Ember.Service.extend({

  setup: on('init', function() {
    mixpanel.init(Config['mixpanel-api-token']);
  }),

  pageHasAnalytics: function() {
    return window.mixpanel && typeof window.mixpanel === "object" && Config.mixpanel.enabled;
  },

  logTrackingEnabled: function() {
    return !!Config && !! Config.mixpanel.LOG_EVENT_TRACKING;
  },

  logTracking: function() {
    Ember.Logger.info('[Mixpanel] ', arguments);
  },

  trackPageView: function(page) {
    if (this.pageHasAnalytics()) {
      if (!page) {
        const loc = window.location;
        page = loc.hash ? loc.hash.substring(1) : loc.pathname + loc.search;
      }

      window.mixpanel.track("visit", {pageName: page});
    }

    if (this.logTrackingEnabled()) {
      this.logTracking('page view', page);
    }
  },

  trackEvent: function(event, properties, options, callback) {
    if (this.pageHasAnalytics()) {
      window.mixpanel.track(event, properties, options, callback);
    }
    if (this.logTrackingEnabled()) {
      this.logTracking(event, properties, options);
    }
  },

  currentUserProperties: computed(function() {
    const user = this.container.lookup('controller:application').get('session.currentUser');
    return this.getUserProperties(user);
  }),

  // TODO: break this function apart
  trackEventVersion2(event, properties) {
    const applicationController = this.container.lookup('controller:application');
    const currentRouteName = get(applicationController, 'currentRouteName');
    const currentController = this.container.lookup(`controller:${currentRouteName}`);

    let props = {
      url: location.href,
      pageName: currentRouteName
    };

    if (get(currentController, 'page')) {
      props.pageNumber = get(currentController, 'page');
    }

    const channel = currentRouteName.match(/events|market|news|talk/);

    if (channel) {
      props.channelName = channel[0];
    }

    merge(props, get(this, 'currentUserProperties')); // make sure this line is first so we can override!

    // Automatically track content properties when the controller model property
    // is an ember data model. Checking for the presence of model id or whether
    // the model is new is how we're determining if the controller model property
    // is an ember model as opposed to a collection of models.
    if (get(currentController, 'model.id') || get(currentController, 'model.isNew')) {
      const model = get(currentController, 'model');
      merge(props, this.getContentProperties(model));
    }

    merge(props, properties);

    // remove empty properties
    for(var k in props) {
      if(isEmpty(props[k])) {
        delete props[k];
      }
    }

    if (this.pageHasAnalytics()) {
      window.mixpanel.track(event, props);
    }

    if (this.logTrackingEnabled()) {
      this.logTracking(event, props);
    }
  },

  establishProfile: function(user) {
    if (user && user.get('isLoaded')) {
      this.identify(user.get('userId'));
      this.peopleSet({
        name: user.get('name')
      });
    } else {
      this.establishAnonymousProfile();
    }
  },

  establishAnonymousProfile: function() {
    if (window.mixpanel.__loaded) {
      // we have two scenarios here. 1 -- the user is unregistered and has no
      // mixpanel cookie. 2 -- the user is not signed in, but has an existing
      // mixpanel cookie from an old session.
      const distinct_id = this.getDistinctId();
      const emailRegexp = /\S+@\S+\.\S+/;
      // mixpanel's automatically assigned distinct IDs are long strings
      // of alphanumeric and other characters, whereas our distinct IDs
      // are either email addresses or integers
      if (distinct_id && !emailRegexp.test(distinct_id) && isNaN(distinct_id)) {
        if (~distinct_id.indexOf('subtext')) {
          this.identify(distinct_id);
        } else {
          this.identify('subtext_' + distinct_id);
          // ensure creation of a profile
          this.peopleSet({
            name: 'subtext_' + distinct_id
          });
        }
      } // no need to do anything in the 'else' situation since they are already
    } else {
      setTimeout(function() { this.establishAnonymousProfile(); }.bind(this), 500);
    }
  },


  identify: function(userId, traits, options, callback) {
    if (this.pageHasAnalytics()) {
      window.mixpanel.identify(userId, traits, options, callback);
    }

    if (this.logTrackingEnabled()) {
      this.logTracking('identify user', userId, traits, options);
    }
  },

  alias: function(userId, previousId, options, callback) {
    if (this.pageHasAnalytics()) {
      window.mixpanel.alias(userId, previousId, options, callback);
    }

    if (this.logTrackingEnabled()) {
      this.logTracking('alias user', userId, previousId, options);
    }
  },

  peopleSet: function(attributes) {

    if (this.pageHasAnalytics()) {
      window.mixpanel.people.set(attributes);
    }

    if (this.logTrackingEnabled()) {
      this.logTracking('people.set', attributes);
    }
  },

  getDistinctId: function() {
    if (this.pageHasAnalytics()) {
      if (window.mixpanel.__loaded) {
        return window.mixpanel.get_distinct_id();
      }
    }
  },

  getUserProperties: function(user) {
    const props = {};
    if (user) {
      props['userId'] = user.get('userId');
      props['userName'] = user.get('name');
      props['userEmail'] = user.get('email');
      props['userCommunity'] = user.get('location');
      props['testGroup'] = user.get('testGroup');
    }
    return props;
  },

  // TODO: Remove when refactor is complete
  getNavigationProperties: function(channelName, pageName, pageNumber) {
    const props = {};
    props['channelName'] = channelName;
    props['pageName'] = pageName; // TODO this.document.title?
    props['url'] = window.location.href;
    props['pageNumber'] = pageNumber;
    return props;
  },

  // TODO: Remove when refactor is complete
  getNavigationControlProperties: function(navControlGroup, navControl) {
    const props = {};
    props['navControlGroup'] = navControlGroup;
    props['navControl'] = navControl;
    return props;
  },

  getContentProperties: function(content) {
    let props = {};

    if (content.get) {
      props = {
        contentId: get(content, 'contentId'),
        contentTitle: get(content, 'title'),
        contentOrganization: get(content, 'organizationName'),
      };
      const pubdate = get(content, 'publishedAt');
      // don't want to throw an error by calling format() on nothing
      if (pubdate) {
        props['contentPubdate'] = pubdate.format();
      }
    }

    return props;
  }
});
