import { inject as service } from '@ember/service';
import { computed, set, get, setProperties } from '@ember/object';
import { startsWith } from 'lodash';
import Component from '@ember/component';

const linkToContent = Component.extend({
  history: service(),
  router: service(),

  tagName: '',
  model: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      paramsForLinkTo: {},
      attrsForLinkTo: {}
    });
  },

  shouldOverride: computed('history.currentRouteName', function() {
    const currentRouteName = get(this, 'history.currentRouteName');

    return startsWith(currentRouteName, 'caster') || startsWith(currentRouteName, 'myfeed');
  }),

  overrideUrl: computed('paramsForLinkTo', function() {
    const paramsForLinkToCopy = [...get(this, 'paramsForLinkTo')];
    paramsForLinkToCopy.shift();

    return `/${paramsForLinkToCopy.join('/')}`;
  }),

  route: computed('history.currentRouteName', function() {
    const currentRouteName = get(this, 'history.currentRouteName');

    if (startsWith(currentRouteName, 'caster')) {
      return 'caster.show';
    } else if (startsWith(currentRouteName, 'myfeed')) {
      return 'myfeed.show';
    } else {
      return 'feed.show';
    }
  }),

  instanceRoute: computed('route', function() {
    return `${get(this, 'route')}-instance`;
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    const params = [...this.params];
    const model = params.shift();

    params.unshift(...this.calculateRouteParams(model));

    set(this, 'paramsForLinkTo',
      params
    );
  },

  calculateRouteParams(model) {
    let route = get(this, 'route');
    let routeParameters = [];

    routeParameters.push( get(model, 'contentId') );

    const eventInstanceId = get(model, 'eventInstanceId');

    if (eventInstanceId) {
      route = get(this, 'instanceRoute');
      routeParameters.push(eventInstanceId);
    }

    return [route, ...routeParameters];
  },

  actions: {
    transitionToOverride() {
      let paramsForLinkTo = get(this, 'paramsForLinkTo');
      
      get(this, 'router').transitionTo(...paramsForLinkTo);

      return false;
    }
  }
});

linkToContent.reopenClass({
  positionalParams: 'params'
});

export default linkToContent;
