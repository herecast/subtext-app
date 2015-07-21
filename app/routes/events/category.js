import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let category = params.category.capitalize().replace('-', ' ');

    this.transitionTo('events.index', {queryParams: {category: category}});
  }
});
