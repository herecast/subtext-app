import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Edit News',

  model(params) {
    return this.store.find('news', params.id);
  }
});
