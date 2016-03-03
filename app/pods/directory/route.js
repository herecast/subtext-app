import Ember from 'ember';

const {
  RSVP,
  isEmpty,
  inject
} = Ember;

export default Ember.Route.extend({
  geo: inject.service('geolocation'),
  model(params) {
    let model = {
      categories: this.store.find('business-category'),
      subcategory_id: params.subcategory_id,
      lat: params.lat,
      lng: params.lng
    };

    return RSVP.hash(model);
  },

  setupController(controller, model) {
    controller.set('categories', model.categories);

    const subCategory = model.categories.findBy('id', model.subcategory_id);

    if (subCategory) {
      controller.set('subCategory', subCategory);
    }

    if (isEmpty(model.lat) || isEmpty(model.lng)) {
      this.get('geo.userLocation').then(function(loc) {
        controller.setProperties({
          location: loc.human,
          lat: loc.coords.lat,
          lng: loc.coords.lng
        });
      });
    } else {
      this.get('geo').reverseGeocode(model.lat, model.lng).then(function(l) {
        controller.set('location', l);
      });
    }
  }
});
