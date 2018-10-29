import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import formatBusinessHours from 'subtext-ui/utils/business-hours-format';

export default Controller.extend({
  location: service('window-location'),
  geo: service('geolocation'),
  intercom: service(),
  myCoords: oneWay('geo.userLocation.coords'),
  fromSearch: computed('location.href', function() {
    return get(this, 'location').href().indexOf('?') >= 0;
  }),
  editFormIsVisible: false,

  businessCategories: computed(function() {
    return get(this, 'store').findAll('business-category');
  }),

  humanBusinessHours: computed('model.hours', function() {

    let hours = formatBusinessHours(get(this, 'model.hours'));

    return hours.map(hour => {
      return `${hour.days}: ${hour.open} - ${hour.close}`;
    });
  }),

  reportIncorrectInfoEmail: computed('model.{name,fullAddress,phone,websiteLink}', function() {
    const mailTo = `mailto:dailyuv@subtext.org`;
    const firstLine = 'Thank you for alerting us about problems with the directory information for this business.';
    const bodyContent = `Business name: ${get(this, 'model.name')} \r\nBusiness address: ${get(this, 'model.fullAddress')} \r\nBusiness telephone number:  ${get(this, 'model.phone')} \r\nBusiness URL: ${get(this, 'model.websiteLink')} \r\nBusiness hours: ${get(this, 'humanBusinessHours')} \r\nDoes this business still exist? (Y/N) \r\nPlease tell us just below this what you think is wrong. \r\nThanks again for helping us build the Upper Valley’s best business directory! \r\n\r\nProblems with the info above:`;

    const body = `${encodeURIComponent(firstLine)}%0D%0A%0D%0A${encodeURIComponent(bodyContent)}`;
    return `${mailTo}?subject=Please Change Info on ${encodeURIComponent(get(this, 'model.name'))}%20${get(this, 'model.id')}&body=${body}`;
  }),


claimEmail: computed(function() {
    const mailTo = `mailto:dailyuv@subtext.org`;
    const firstLine = 'Thank you for claiming this business. Please provide the following information:';
    const emailBody = `
Your name:
Your affiliation with this business:
Your business’s name if different from what you see in the subject line above:

We’ll need to speak with you by telephone to verify your affiliation with this business and check the information in the listing.
If the directory already contains a phone number for this business, that is where we’ll call you.
If there’s no phone number listed, or if the one listed is wrong, please add it here:

Thanks again for helping us build the Upper Valley’s best business directory!`;

    const body = `${encodeURIComponent(firstLine)}%0D%0A%0D%0A${encodeURIComponent(emailBody)}`;

    return `${mailTo}?subject=Claiming ${encodeURIComponent(get(this, 'model.name'))}%20${get(this, 'model.id')}&body=${body}`;
  }),

  actions: {
    contactUs() {
      const subject = 'My Business on dailyUV';
      get(this, 'intercom').contactUs(subject);
    },

    toggleEditForm() {
      this.toggleProperty('editFormIsVisible');
    },

    cancelEditForm() {
      if (get(this, 'model.hasDirtyAttributes')) {
        if (confirm('Are you sure you want to discard your changes without saving?')) {
          get(this, 'model').rollbackAttributes();
          this.closeEditForm();
        }
      } else {
        this.closeEditForm();
      }
    },

    savedEditForm() {
      this.closeEditForm();
    },

    closeBSDDetailPage() {
      this.transitionToRoute('directory');
    }
  }
});
