import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Controller.extend({
  geo: inject.service('geolocation'),
  myCoords: computed.oneWay('geo.userLocation.coords'),
  fromSearch: window.location.href.indexOf('?') >= 0,
  actions: {
    contactUs() {
      let intercomButton = Ember.$('.intercom-launcher-button');
      if(intercomButton.length > 0){
        intercomButton[0].click();
      }else{
        window.location.href = "mailto:dailyuv@subtext.org?subject=My Business on dailyUV";
      }
    }
  }
});
