import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  coalesceFindRequests: true,

  shouldReloadAll() {
    return false;
  }
});
