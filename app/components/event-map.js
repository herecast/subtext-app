import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['EventShow-map'],

  location: computed('locateName', 'fullAddress', function() {
    if (Ember.isPresent(this.get('locateName'))) {
      return this.get('locateName');
    } else {
      return this.get('fullAddress');
    }
  }),

  mapSrc: computed('location', function() {
    const key = config['gmaps-api-token'];
    const location = this.get('location');

    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${location}`;
  })
});

