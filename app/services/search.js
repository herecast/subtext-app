// global window
import { notEmpty } from '@ember/object/computed';

import $ from 'jquery';
import Service, { inject as service } from '@ember/service';
import { setProperties, set, get } from '@ember/object';

export default Service.extend({
  router: service(),

  query: "",
  isLoading: false,
  searchActive: false,

  activeFilter: null,
  filtersAreActive: notEmpty('activeFilter'),

  performSearch(query) {
    setProperties(this, {
      isLoading: true,
      query: query
    });

    $(window).scrollTop(0,0);

    const queryParams = {
      query,
      type: get(this, 'activeFilter'),
      startDate: '',
      endDate: ''
    };

    get(this, 'router').transitionTo('feed',
      {queryParams}
    ).finally(() => {
      set(this, 'isLoading', false);
    });
  },

  clearSearch() {
    setProperties(this, {
      'activeFilter': null,
      'query': "",
      'isLoading': false
    });

    let transition = get(this, 'router').transitionTo('feed');

    transition._keepDefaultQueryParamValues = false;

    transition.retry();
  }
});
