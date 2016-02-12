import Ember from 'ember';

export default Ember.Controller.extend({
  // TODO remove. This is just here so the google map
  // will show some locations in development
  locations: [{
    coords: { lat: 40.000, lng: -80.000},
    title: 'first pin',
    content: '<h1 class="h3">some content</h1>'
  },{
    coords: { lat: 40.001, lng: -80.001 },
    title: 'second pin',
    content: '<h1 class="h3">more content</h1>'
  }]
});
