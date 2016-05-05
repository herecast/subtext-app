import Ember from 'ember';
import jQuery from 'jquery';
import History from 'subtext-ui/mixins/routes/history';

const { isEmpty } = Ember;

export default Ember.Route.extend(History, {
  queryParams: {
    lat:         { refreshModel: true },
    lng:         { refreshModel: true },
    query:       { refreshModel: true },
    category_id: { refreshModel: true },
    sort_by:     { refreshModel: true },
    page:        { refreshModel: true },
    per_page:    { refreshModel: true }
  },

  model(params) {
    if (isEmpty(params.query) && isEmpty(params.category_id)) {
      return [];
    }

    let apiQuery = {
      query: params.query,
      category_id: params.category_id,
      lat: params.lat,
      lng: params.lng,
      sort_by: params.sort_by,
      page: params.page,
      per_page: params.per_page
    };

    return this.store.query('business-profile', apiQuery);
  },

  afterModel(results, transition) {
    const targetIsSearch = /^directory\.(search|search\.results)$/.test(transition.targetName);
    if (targetIsSearch) {
      const queryParamsEmpty = jQuery.isEmptyObject(transition.queryParams);

      if (queryParamsEmpty) {
        this.transitionTo('directory');
      } else if (results.get('length') === 0) {
        this.transitionTo('directory.no-results');
      }
    }
  }
});
