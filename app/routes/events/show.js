import Ember from 'ember';
import EventFilter from '../../mixins/routes/event-filter';
import ajax from 'ic-ajax';
import config from '../../config/environment';
import Track from '../../mixins/routes/track-pageview';

export default Ember.Route.extend(EventFilter, Track, {
  model(params) {
    const eventInstance = this.store.getById('event-instance', params.id);

    // Force the event instance to reload if it's already found in the store.
    // This lets us get the more detailed record from the show API endpoint,
    // rather than relying on what's in the store from the index endpoint.
    if (eventInstance) {
      return eventInstance.reload();
    } else {
      return this.store.find('event-instance', params.id);
    }
  },

  setupController(controller, model) {
    this._super(controller, model);

    const commentUrl = `/${config.API_NAMESPACE}/comments`;

    // We have to manually get the comments because ember data cannnot handle
    // the nested data structure that is returned.
    ajax(commentUrl, {data: {event_id: model.get('eventId')}}).then((response) => {
      controller.set('comments', response.comments);
    });

    controller.set('similarContent', this.store.find('similar-content', {
      event_id: model.get('eventId')
    }));
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo('events.index', {queryParams: filterParams});
    }
  }
});
