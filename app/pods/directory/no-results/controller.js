import Ember from 'ember';


export default Ember.Controller.extend({
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
