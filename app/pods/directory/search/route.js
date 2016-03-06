import Ember from 'ember';

const { isEmpty } = Ember;

export default Ember.Route.extend({
  queryParams: {
    lat:         { refreshModel: true },
    lng:         { refreshModel: true },
    query:       { refreshModel: true },
    category_id: { refreshModel: true },
  },

  model(params) {
    if (isEmpty(params.query) && isEmpty(params.category_id)) {
      return [];
    }

    let apiQuery = {
      query: params.query,
      category_id: params.subcategory_id,
      lat: params.lat,
      lng: params.lng
    };

    return this.store.query('business-profile', apiQuery);
  }
});
