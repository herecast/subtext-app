import Ember from 'ember';

const { RSVP } = Ember;

export default Ember.Service.extend({
  getCurrentPosition() {
    return new RSVP.Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        resolve(position);
      }, error => {
        reject(error);
      });
    });
  }
});
