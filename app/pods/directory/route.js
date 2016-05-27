import Ember from 'ember';
import History from 'subtext-ui/mixins/routes/history';

const {
  get,
  RSVP,
  isEmpty,
  isPresent,
  inject
} = Ember;

export default Ember.Route.extend(History, {
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
            coords: location.coords
          });
        }
        controller.set('isCalculatingLocation', false);
      });
    }
  },


  actions: {
    /**
     * The below actions need to be cleaned up.
     * They are a quick hack to clear out the query, and
     * are probably only here due to time contraints
     *  - NikP
     */
    willTransition: function(transition) {
      if(transition.targetName === 'directory.landing') {
        if(this.controller.get('query').length > 3 ) {
          this.controller.set('query',"");
        }
      }
    },
    deactivate() {
      // Reset Query
      this.controller.set('query', "");
    }
  }
});
