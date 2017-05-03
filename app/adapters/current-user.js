import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  coalesceFindRequests: false,
  // Singleton path.
  pathForType() {
    return 'current_user';
  },

  // Ignore ID when building url.
  buildURL(type /*, id, record */) {
    return this._super(type);
  }
});
