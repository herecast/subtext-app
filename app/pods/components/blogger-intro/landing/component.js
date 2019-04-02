import { get, set, setProperties, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { later } from '@ember/runloop';
import Validation from 'subtext-ui/mixins/components/validation';
import Component from '@ember/component';

export default Component.extend(Validation, {
  classNames: ['BloggerIntro-Landing'],
  classNameBindings: ['isMobile:is-mobile'],

  api: service(),
  media: service(),
  router: service(),

  isMobile: readOnly('media.isMobile'),

  email: null,
  hasTriedToSubmitEmail: false,
  isSubmittingEmail: false,
  hasSubmittedEmail: false,

  emailIsValid: computed('email', function() {
    const email = get(this, 'email');
    return this.hasValidEmail(email);
  }),

  showEmailError: computed('email', 'emailIsValid', 'hasTriedToSubmitEmail', function() {
    if (get(this, 'hasTriedToSubmitEmail')) {
      return !get(this, 'emailIsValid')
    }

    return false;
  }),

  actions: {
    submitEmail() {
      set(this, 'hasTriedToSubmitEmail', true);

      if (get(this, 'emailIsValid')) {
        const email = get(this, 'email');

        set(this, 'isSubmittingEmail', true);

        get(this, 'api').captureStartablogInterestEmail(email);

        if (get(this, 'leadCaptured')) {
          get(this, 'leadCaptured')();
        }

        later(() => {
          setProperties(this, {
            'hasSubmittedEmail': true,
            'isSubmittingEmail': false
          });
        }, 1500);
      }
    },

    goToHome() {
      get(this, 'router').transitionTo('feed');
    }
  }
});
