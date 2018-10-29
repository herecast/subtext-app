import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { copy } from '@ember/object/internals';
import { computed, set, get, setProperties } from '@ember/object';
import { startsWith } from 'lodash';

const linkToContent = Component.extend({
  history: service(),

  tagName: '',

  init() {
    this._super(...arguments);
    setProperties(this, {
      paramsForLinkTo: {},
      attrsForLinkTo: {}
    });
  },

  route: computed('history.currentRouteName', function() {
    const currentRouteName = get(this, 'history.currentRouteName');

    if (startsWith(currentRouteName, 'profile')) {
      return 'profile.all.show';
    } else if (startsWith(currentRouteName, 'mystuff')) {
      if (currentRouteName.indexOf('contents') > 0) {
        return 'mystuff.contents.show';
      } else if (currentRouteName.indexOf('bookmarks') > 0) {
        return 'mystuff.bookmarks.show';
      }

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
