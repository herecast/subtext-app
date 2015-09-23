import Ember from 'ember';
import config from 'subtext-ui/config/environment';

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
    const key = config['gmaps-api-token'];
    const location = this.get('location');

    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${location}`;
  }.property('location')
});

