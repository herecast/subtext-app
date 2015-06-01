import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['EventShow-map'],

  location: function() {
    if (Ember.isPresent(this.get('locateName'))) {
      return this.get('locateName');
    } else {
      return this.get('fullAddress');
    }
  }.property('locateName', 'fullAddress'),

  mapSrc: function() {
    const key = 'AIzaSyBY8KLZXqpXrMbEorrQWjEuQjl7yO3sVAc';
    const location = this.get('location');

    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${location}`;
  }.property('location')
});

