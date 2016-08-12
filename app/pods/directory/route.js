import Ember from 'ember';
import History from 'subtext-ui/mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

const {
  get,
  RSVP,
  isEmpty,
  isPresent,
  inject
} = Ember;

export default Ember.Route.extend(History, MaintainScroll, {
  geo: inject.service('geolocation'),

  model() {
    let model = {
      categories: this.store.findAll('business-category')
    };

    return RSVP.hash(model);
  },

  // This is to grab the query params from the sub route
  // for restfulness.
  afterModel(model, transition) {
    const queryParams = transition.queryParams;
    model.params = queryParams;
  },

  setupController(controller, model) {
    controller.setProperties({
      categories: model.categories,
      query: model.params['query'] || ""
    });

    // Location
    if(isPresent(model.params['lat']) && isPresent(model.params['lng'])) {
      const coords = {
        lat: model.params.lat,
        lng: model.params.lng
      };
      controller.set('coords', coords);
      get(this, 'geo').reverseGeocode(coords.lat, coords.lng).then(location => {
        controller.set('location', location);
      });
    } else {
    //user needs to know that position is calculating as it may take up to 5 seconds
      controller.set('isCalculatingLocation', true);
      get(this, 'geo.userLocation').then(location => {
        if(isEmpty(controller.get('coords'))) {
          controller.setProperties({
            location: location.human,
            coords: location.coords,
            lat: location.coords.lat,
            lng: location.coords.lng
          });
        }
        controller.set('isCalculatingLocation', false);
      });
    }
  }
});
