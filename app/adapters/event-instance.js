import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  // In order to get results across all communities, we need to send an empty
  // string to the API, but still want to show something meaningful to the user.
  sortQueryParams(params) {
    if (params.location === 'All Communities') {
      params.location = '';
    }

    return this._super(params);
  }
});
