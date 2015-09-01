import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  // When querying for "Everything" we are not sending a parameter to
  // the API, but still want to show something meaningful to the user.
  sortQueryParams(params) {
    if (params.query === 'Everything') {
      delete params.query;
    }

    return this._super(params);
  }
});
