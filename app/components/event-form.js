import Ember from 'ember';
import Validation from '../mixins/components/validation';

export default Ember.Component.extend(Validation, {
  tagName: 'form',
  event: Ember.computed.alias('model'),

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

  isValid() {
    this.validatePresenceOf('event.title');
    this.validatePresenceOf('event.content');
    this.validateVenue();
    this.validateImage();
    return Ember.isBlank(Ember.keys(this.get('errors')));
  },

  actions: {
    afterDateValidation(datesAreValid) {
      if (datesAreValid) {
        this.set('errors.dates', null);
        delete this.get('errors').dates;
      } else {
        this.set('errors.dates', 'Invalid date');
      }
    },

    next() {
      if (this.isValid()) {
        this.sendAction('afterDetails');
      } else {
        // TODO make it more obvious that there's an error and the user
        // needs to make corrections.
        console.log(this.get('errors'));
      }
    },

    discard() {
      if (confirm('Are you sure you want to discard this event?')) {
        const event = this.get('event');
        event.destroyRecord();
        this.sendAction('afterDiscard');
      }
    }
  }
});
