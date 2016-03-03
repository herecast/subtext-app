import Ember from 'ember';

const {
  RSVP,
  isPresent,
  isEmpty,
  inject
} = Ember;

export default Ember.Route.extend({
  geo: inject.service('geolocation'),
  model(params) {
    let model = {
      categories: this.store.find('business-category'),
      subcategory_id: params.subcategory_id,
      location: "",
      lat: params.lat,
      lng: params.lng
    };

    if(isPresent(params.lat) && isPresent(params.lng)) {
      model['location'] = this.get('geo').reverseGeocode(params.lat, params.lng);
    }

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
      controller.set('location', model.location);
    }
  }
});
