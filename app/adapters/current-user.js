import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  coalesceFindRequests: false,

  pathForType() {
    return 'current_user';
  },
  // Ignore ID when building url.
  buildURL(type) {
    return this._super(type);
  }
});
