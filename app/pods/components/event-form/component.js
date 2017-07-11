import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, isBlank, isPresent, set, computed, run } = Ember;

export default Ember.Component.extend(TestSelector, Validation, {
  tagName: 'form',
  "data-test-component": 'EventForm',
  event: computed.alias('model'),
  schedules: null,
  error: null,
  image: computed.alias('model.image'),
  imageUrl: computed.oneWay('model.imageUrl'),
  showOrganizationMenu: true,

  organizations: computed.oneWay('session.currentUser.managedOrganizations'),

  registrationEnabled: null,

  init() {
    this._super(...arguments);
    this.resetProperties();
  },

  hasStaticImageUrl: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');
    const regexp = /(http)(?!base64)/g;

    return isPresent(imageUrl) && imageUrl.match(regexp);
  }),

  imageName: computed('image.originalImageFile.name', 'imageUrl', function() {
    const originalFileName = get(this, 'image.originalImageFile.name');

    if (originalFileName) {
      return originalFileName;
    } else {
      // We're not persisting the original file name when an image is uploaded,
      // so we need to grab it from the file name on S3.
      const fileName = get(this, 'imageUrl').split('/').get('lastObject');
      return fileName;
    }
  }),

  resetProperties: function() {
    const registrationDeadline = get(this, 'event.registrationDeadline');

    set(this, 'registrationEnabled', (isPresent(registrationDeadline)));
    set(this, 'showErrors', false);
  },

  validateVenue() {
    const id = this.get('event.venueId');
    const address = this.get('event.venueAddress');
    const city = this.get('event.venueCity');
    const state = this.get('event.venueState');
    const zip = this.get('event.venueZip');

    const hasAllFields = Ember.isPresent(address) && Ember.isPresent(city) &&
      Ember.isPresent(state) && Ember.isPresent(zip);

    if (Ember.isPresent(id) || hasAllFields) {
      this.set('errors.venue', null);
      delete this.get('errors').venue;
    } else {
      this.set('errors.venue', 'Cannot be blank');
    }
  },

  validateContactEmail() {
    const email = this.get('event.contactEmail');

    if (isBlank(email) || this.hasValidEmail(email)) {
      this.set('errors.contactEmail', null);
      delete this.get('errors').contactEmail;
    } else {
      this.set('errors.contactEmail', 'Invalid email address');
    }
  },

  validateEventInstances() {
    const value = get(this, 'event.eventInstances');

    if (isPresent(value)) {
      this.set(`errors.eventInstances`, null);
      delete this.get('errors')['eventInstances'];
    } else {
      this.set(`errors.eventInstances`, 'Must have at least one valid date');
    }
  },

  validateForm() {
    this.validatePresenceOf('event.title');
    this.validateWYSIWYG('event.content');
    this.validateVenue();
    this.validateImage();
    this.validateContactEmail();
    this.hasValidUrl('eventUrl');
    this.validateEventInstances();

    if (get(this, 'registrationEnabled')) {
      this.validatePresenceOf('event.registrationDeadline');
    }
  },

  actions: {
    toggleRegistration() {
      this.toggleProperty('registrationEnabled');

      set(this, 'event.registrationDeadline', null);
      set(this, 'errors.registrationDeadline', null);

      // don't send a value to the API when we shouldn't
      delete get(this, 'errors').registrationDeadline;
    },

    toggleAdvertisingRequest() {
      this.toggleProperty('event.wantsToAdvertise');
    },

    afterDateValidation(datesAreValid) {
      if (datesAreValid) {
        this.set('errors.dates', null);
        delete this.get('errors').dates;
      } else {
        this.set('errors.dates', 'Invalid date');
      }
    },

    discard() {
      const event = get(this, 'event');

      this.sendAction('afterDiscard', event);
    },

    removeImage() {
      set(this, 'imageUrl', null);
    },

    normalizeUrl() {
      let url = this.get('event.eventUrl').trim();
      const protocol = /^[a-z]+:/i;

      if (url === 'http://') {
        url = '';
      } else if (!protocol.test(url) && url.length > 0) {
        url = 'http://' + url;
      }

      this.set('event.eventUrl', url);
    },

    updateContent(content) {
      set(this, 'event.content', content);
      this.send('validateForm');
    },

    validateForm() {
      if (get(this, 'hasSubmittedForm')) {
        run.later(() => {
          this.validateForm();
        });
      }
    },
    next() {
      set(this, 'hasSubmittedForm', true);

      if (this.isValid()) {
        this.sendAction('afterDetails');
      } else {
        run.later(() => {
          this.scrollToFirstError();
        });
      }
    },
  }
});
