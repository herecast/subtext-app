import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['preview', 'organization_id'],
  preview: false,
  organization_id: null,

  hideEditor: false,

  actions: {
    refreshModel() {
      this.send('refreshRouteModel');
    }
  }
});
