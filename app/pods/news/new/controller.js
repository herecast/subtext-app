import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['organization_id'],
  organization_id: null,

  hideEditor: false,

  actions: {
    refreshModel() {
      this.send('refreshRouteModel');
    }
  }
});
