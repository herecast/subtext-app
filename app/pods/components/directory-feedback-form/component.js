import Ember from 'ember';

const {
  computed,
  inject,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryFeedback'],

  model: null,

  isOpen: false,
  hasChosen: false,
  userRating: null,
  api: inject.service('api'),

  hasRated: computed.alias('model.has_rated'),

  user: computed.alias('session.currentUser'),

  isSignedIn: computed.notEmpty('user'),

  buttonProperties: computed('userRating', function() {
    const rating = get(this, 'userRating');

    let buttonProperties = {
      no: 'unchecked',
      yes: 'unchecked'
    };

    if (rating !== null) {
      buttonProperties.no = rating ? 'notchecked' : 'checked';
      buttonProperties.yes = rating ? 'checked' : 'notchecked';
    }

    return buttonProperties;
  }),

  actions: {
    toggleDisplay() {
      this.toggleProperty('isOpen');
    },

    checkAnswer(bool) {
      set(this, 'userRating', bool);
      set(this, 'hasChosen', true);
    },

    updateFeedback() {
      const model = get(this, 'model');

      model.reload();

      set(this, 'hasRated', true);
      set(this, 'isOpen', false);
    },

    submitFeedback() {
      const api = get(this, 'api'),
            modelId = get(this, 'model.id'),
            rating = get(this, 'userRating'),
            hasRated = get(this, 'hasRated');

      let feedbackToSend = {
        feedback: {
          satisfaction: rating,
          cleanliness: rating,
          price: rating,
          recommend: rating
        }
      };

      if (hasRated) {
        api.updateFeedback(modelId, feedbackToSend).then( () => {
          this.send('updateFeedback');
        });
      } else {
        api.createFeedback(modelId, feedbackToSend).then( () => {
          this.send('updateFeedback');
        });
      }

    }
  }
});
