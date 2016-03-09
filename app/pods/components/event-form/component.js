import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, isPresent, set, computed } = Ember;

export default Ember.Component.extend(Validation, TrackEvent, {
  tagName: 'form',
  event: computed.alias('model'),
  schedules: null,
  error: null,

  organizations: computed.oneWay('session.currentUser.managed_organizations'),

  registrationEnabled: null,

  init() {
    this._super(...arguments);
    this.resetProperties();
  },

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

  validateImage() {
    const image = this.get('event.image');

    if (Ember.isBlank(image)) {
      this.set('errors.image', null);
      delete this.get('errors').image;
      return true;
    }

    const isJPG = image.type === 'image/jpeg';
    const isPNG = image.type === 'image/png';
    const maxSize = 5242880; // 5MB

    if (!isJPG && !isPNG) {
      this.set('errors.image', 'must be a jpg or png');
    } else if (image.size > maxSize) {
      this.set('errors.image', 'must be < 5MB');
    } else {
      this.set('errors.image', null);
      delete this.get('errors').image;
    }
  },

  validateContactEmail() {
    const email = this.get('event.contactEmail');

    if (this.hasValidEmail(email)) {
      this.set('errors.contactEmail', null);
      delete this.get('errors').contactEmail;
    } else {
      this.set('errors.contactEmail', 'Invalid email address');
    }
  },

  validateEventUrl() {
    const url = this.get('event.eventUrl') || '';

    if (this.hasValidUrl(url)) {
      this.set('errors.eventUrl', null);
      delete this.get('errors').eventUrl;
    } else {
      this.set('errors.eventUrl', 'Invalid URL');
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
    this.validateEventUrl();
    this.validateEventInstances();

    if (get(this, 'registrationEnabled')) {
      this.validatePresenceOf('event.registrationDeadline');
    }
  },

  _getTrackingArguments() {
    return {
      navControlGroup: 'Create Content',
      navControl: 'Discard Event Edit'
    };
  },

  actions: {
    toggleRegistration() {
      this.toggleProperty('registrationEnabled');

      set(this, 'event.registrationDeadline', null);
      set(this, 'errors.registrationDeadline', null);

      // don't send a value to the API when we shouldn't
      delete get(this, 'errors').registrationDeadline;
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

    normalizeUrl() {
      let url = this.get('event.eventUrl').trim();
      const protocol = /^[a-z]+:/i;

      if (url === 'http://') {
        url = '';
      } else if (!protocol.test(url) && url.length > 0) {
        url = 'http://' + url;
      }

      this.set('event.eventUrl', url);
    }
  }
});
