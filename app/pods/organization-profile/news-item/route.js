import Ember from 'ember';

export default Ember.Route.extend({
  model(params)  {
    return this.store.findRecord('news', params.id, { reload: true }).catch(() => {
      this.replaceWith('error-404');
    });
  }
});