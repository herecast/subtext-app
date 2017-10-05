import Ember from 'ember';

const { get, set, copy } = Ember;

const linkToContent = Ember.Component.extend({
  tagName:'',
  paramsForLinkTo: {},
  attrsForLinkTo: {},
  route: 'feed.show',
  instanceRoute: 'feed.show-instance',

  // closure action to override, and handle the click in the action
  // instead of the default routing.
  clickOverride: null,

  init() {
    this._super(...arguments);

    const clickOverride = get(this, 'clickOverride');

    if (clickOverride) {
      this.on('click', clickOverride);
    }
  },

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

    if(eventInstanceId) {
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
