import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  coalesceFindRequests: true,
  pathForType() {
    return 'businesses/categories';
  }
});
