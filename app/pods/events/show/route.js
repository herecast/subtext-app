import Ember from 'ember';
import RouteMetaMixin from '../../../mixins/routes/social-tags';
import Redirect from '../../../mixins/routes/redirect-after-login';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';

import Dates from '../../../lib/dates';

export default Ember.Route.extend(RouteMetaMixin, Redirect, DocTitleFromContent, {
  modelImageKey: 'imageUrl',

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
  }
});
