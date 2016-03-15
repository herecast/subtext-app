import Ember from 'ember';

const { inject, computed, get, set } = Ember;

export default Ember.Controller.extend({
  geo: inject.service('geolocation'),
  myCoords: computed.oneWay('geo.userLocation.coords'),
  fromSearch: window.location.href.indexOf('?') >= 0,
  editFormIsVisible: false,

  businessCategories: computed(function () {
    return get(this, 'store').find('business-category');
  }),

  closeEditForm() {
    set(this, 'editFormIsVisible', false);
  },

  actions: {
    contactUs() {
      let intercomButton = Ember.$('.intercom-launcher-button');
      if (intercomButton.length > 0) {
        intercomButton[0].click();
      } else {
        window.location.href = "mailto:dailyuv@subtext.org?subject=My Business on dailyUV";
      }
    },

    showEditForm() {
      set(this, 'editFormIsVisible', true);
    },

    cancelEditForm() {
      if (get(this, 'model.hasDirtyAttributes')) {
        if (confirm('Are you sure you want to discard your changes without saving?')) {
          get(this, 'model').rollbackAttributes();
          this.closeEditForm();
        }
      }
    },

    savedEditForm() {
      this.closeEditForm();
    }
  }
});
