import Ember from 'ember';

const {
  RSVP,
  isEmpty,
  isPresent,
  inject
} = Ember;

export default Ember.Route.extend({
  geo: inject.service('geolocation'),

  model() {
    let model = {
      categories: this.store.find('business-category')
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

    // Setup Category
    if(isPresent(model.params['category_id'])) {
      controller.set('category', model.categories.findBy('id', model.params.category_id));
    }

    // Location
    if(isPresent(model.params['lat']) && isPresent(model.params['lng'])) {
      const coords = {
        lat: model.params.lat,
        lng: model.params.lng
      };
      controller.set('coords', coords);
      this.get('geo').reverseGeocode(coords.lat, coords.lng).then(function(loc) {
        controller.set('location', loc);
      });
    } else {
      this.get('geo.userLocation').then(function(loc) {
        if(isEmpty(controller.get('coords'))) {
          controller.setProperties({
            location: loc.human,
            coords: loc.coords
          });
        }
      });
    }
  }
});
