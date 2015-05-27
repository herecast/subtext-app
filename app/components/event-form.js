import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  errors: {},

  initAttachFile: function() {
    this.$('input[type=file]').on('change', (e) => {
      const file = this.$(e.target).context.files[0];

      this.set('event.image', file);
      this.set('event.imageUrl', URL.createObjectURL(file));
    });
  }.on('didInsertElement'),

  removeChangeEvent: function() {
    this.$('input[type=file]').off('change');
  }.on('willDestroyElement'),

  validateTitle() {
    const title = this.get('event.title');

    if (Ember.isPresent(title)) {
      this.set('errors.title', null);
      delete this.get('errors').title;
    } else {
      this.set('errors.title', 'Cannot be blank');
    }
  },

  validateContent() {
    const content = this.get('event.content');

    if (Ember.isPresent(content)) {
      this.set('errors.content', null);
      delete this.get('errors').content;
    } else {
      this.set('errors.content', 'Cannot be blank');
    }
  },

  validateVenue() {
    const id = this.get('event.venueId');
    const address = this.get('event.venueAddress');
    const city = this.get('event.venueCity');
    const state = this.get('event.venueState');
    const zip = this.get('event.venueZipcode');

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
    this.validateTitle();
    this.validateContent();
    this.validateVenue();
    this.validateImage();
    return Ember.isBlank(Ember.keys(this.get('errors')));
  },

  actions: {
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
