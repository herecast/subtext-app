import Ember from 'ember';
import {startsWith} from 'lodash';

const {get, set, copy, computed, inject} = Ember;

const linkToContent = Ember.Component.extend({
  history: inject.service(),

  tagName: '',
  paramsForLinkTo: {},
  attrsForLinkTo: {},

  route: computed('history.currentRouteName', function() {
    const currentRouteName = get(this, 'history.currentRouteName');

    if (startsWith(currentRouteName, 'profile')) {
      return 'profile.all.show';
    } else if (startsWith(currentRouteName, 'mystuff')) {
      return 'mystuff.contents.show';
    } else {
      return 'feed.show';
    }
  }),

  instanceRoute: computed('route', function() {
    return `${get(this, 'route')}-instance`;
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    const params = copy(this.params);
    const model = params.shift();

    params.unshift(...this.calculateRouteParams(model));

    set(this, 'paramsForLinkTo',
      params
    );
  },

  calculateRouteParams(model) {
    let route = get(this, 'route');
    let routeParameters = [get(model, 'contentId')];
    const eventInstanceId = get(model, 'eventInstanceId');

    if (eventInstanceId) {
      route = get(this, 'instanceRoute');
      routeParameters.push(eventInstanceId);
    }

    return [route, ...routeParameters];
  }
});

linkToContent.reopenClass({
  positionalParams: 'params'
});

export default linkToContent;
