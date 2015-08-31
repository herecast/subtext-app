import Ember from 'ember';
import Track from '../../mixins/routes/track-pageview';
import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';
import Redirect from '../../mixins/routes/redirect-after-login';

import Dates from '../../lib/dates';

export default Ember.Route.extend(Track, RouteMetaMixin, Redirect, {
  promotion: Ember.inject.service('promotion'),

  meta() {
    const model = this.modelFor(this.routeName);

    return {
      'property': {
        'og:image': model.get('imageUrl'),
        'og:title': model.get('title'),
        'og:url': `${location.protocol}//${location.host}${location.pathname}`
      }
    };
  },

  model(params) {
    const eventIdRegex = /^\d+$/;

    // Since the event show page and event category landing page share the
    // same URL format, we need to figure out if we're going to an event first
    // based on whether the "category" is actually an ID.
    if (eventIdRegex.test(params.id)) {
      const eventInstance = this.store.getById('event-instance', params.id);

      // Force the event instance to reload if it's already found in the store.
      // This lets us get the more detailed record from the show API endpoint,
      // rather than relying on what's in the store from the index endpoint.
      if (eventInstance) {
        return eventInstance.reload();
      } else {
        return this.store.find('event-instance', params.id);
      }
    } else {
      const category = params.id.capitalize().replace('-', ' ');
      const queryParams = {
        category: category,
        location: 'All Communities',
        date_start: Dates.startOfMonth(),
        date_end: Dates.endOfMonth()
      };

      this.transitionTo('events.all', {queryParams: queryParams});
    }
  },

  setupController(controller, model) {
    this._super(controller, model);

    this.get('promotion').find(model.get('contentId')).then((promotion) => {
      controller.set('relatedPromotion', promotion);
    });

    controller.set('similarContent', this.store.find('similar-content', {
      event_id: model.get('eventId')
    }));
  }
});
