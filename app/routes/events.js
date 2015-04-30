import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    updateFilter(filterParams) {
      const currentPath = this.controllerFor('application').get('currentPath');

      // This fixes a recursion loop that was causing the app to error out
      if (currentPath === 'events.show') {
        this.controllerFor('events.show').send('updateFilter', filterParams);
      } else {
        this.controllerFor('events.index').send('updateFilter', filterParams);
      }
    }
  }
});
