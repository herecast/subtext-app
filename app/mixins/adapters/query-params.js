import Ember from 'ember';

export default Ember.Mixin.create({
  sortQueryParams(params) {
    // When querying for "Everything" we are not sending a parameter to
    // the API, but still want to show something meaningful to the user.
    if (params.query === 'Everything') {
      delete params.query;
    }

    // In order to get results across all communities, we need to send an empty
    // string to the API, but still want to show something meaningful to the user.
    if (params.location === 'All Communities') {
      params.location = '';
    }

    return this._super(params);
  }
});
