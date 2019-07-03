import { get, set, setProperties, computed } from '@ember/object';
import { mapBy, readOnly, or } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { isPresent } from '@ember/utils';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import Evented from '@ember/object/evented';
import Component from '@ember/component';

export default Component.extend(Evented, {
  classNames: ['FirstVisit-Animation'],
  classNameBindings: ['isLoadingFeed:finished', 'showAnimation:show-animation:hide-animation'],

  fastboot: service(),
  userLocation: service(),

  location: null,
  showAnimiation: false,

  preanimationTime: 1500,
  animationDelayTime: 1000,
  animationTime: 9000,
  onAnimationEnd: function() {},
  rotationDegrees: 0,
  msPerDegree: computed('animationTime', function() {
    return parseInt(get(this, 'animationTime') / 360);
  }),

  yourTown: computed('location.city', function() {
    return get(this, 'location.city') || 'Your Town';
  }),

  init() {
    this._super(...arguments);

    get(this, 'userLocation').one('userHasChosenWelcomeLocation', () => {
      setProperties(this, {
        'showAnimation': true,
        'unfolding': true
      });
      this._setInitialProperties();
      later(this, '_startPreanimation', 600);
    });
  },

  _setInitialProperties() {
    const yourTown = get(this, 'yourTown');

    const animationSteps = [
      {
        triggerAt: 0,
        backgroundName: 'yellow',
        iconName: 'marker',
        title: htmlSafe(`Loading ${yourTown} <br>& surrounding towns...`)
      },
      {
        triggerAt: 0.15,
        backgroundName: 'teal',
        iconName: 'book',
        title: htmlSafe('Searching thousands of local stories<br>from the past week...')
      },
      {
        triggerAt: 0.35,
        backgroundName: 'purple',
        iconName: 'calendar',
        title: htmlSafe('Organizing hundreds <br>of local events...')
      },
      {
        triggerAt: 0.55,
        backgroundName: 'violet',
        iconName: 'wallet',
        title: htmlSafe('Finding items for sale <br>near you...')
      },
      {
        triggerAt: 0.75,
        backgroundName: 'red',
        iconName: 'tablet',
        title: htmlSafe('You can post stories,<br>events & items too!')
      },
      {
        triggerAt: 1.0,
        backgroundName: 'yellow',
        iconName: null,
        title: null
      }
    ];

    setProperties(this, {
      animationSteps,
      'activeStepTriggeredAt': animationSteps[0].triggerAt,
      'titleFade': false,
      'inPreanimation': false,
      'finishingAnimation': false,
      'isLoadingFeed': false
    });
  },

  animationStepTriggers: mapBy('animationSteps', 'triggerAt'),

  currentStep: computed('unfolding', 'inPreanimation', 'showAnimation', 'activeStepTriggeredAt', function() {
    if (!get(this, 'showAnimation') || get(this, 'unfolding')) {
      return false;
    }

    const animationSteps = get(this, 'animationSteps');
    const activeStepTriggeredAt = get(this, 'activeStepTriggeredAt');
    const currentStep = animationSteps.find(step => {
      return parseFloat(get(step, 'triggerAt')) === parseFloat(activeStepTriggeredAt);
    });

    return currentStep;
  }),
  backgroundName: readOnly('currentStep.backgroundName'),
  iconName: readOnly('currentStep.iconName'),

  backgroundClass: computed('backgroundName', 'inPreanimation', 'finishingAnimation', function() {
    const { backgroundName, inPreanimation, finishingAnimation } = this.getProperties('backgroundName', 'inPreanimation', 'finishingAnimation');
    let backgroundClass = backgroundName;

    if (inPreanimation) {
      backgroundClass += ' bounced-in';
    } else if (finishingAnimation) {
      backgroundClass += ' bounced-out';
    }

    return htmlSafe(backgroundClass);
  }),

  headerClass: computed('showAnimation', 'isLoadingFeed', function() {
    let headerClass = '';

    if (get(this, 'showAnimation') && !get(this, 'isLoadingFeed')) {
      headerClass = 'in-animation';
    }

    return htmlSafe(headerClass);
  }),

  circleHidden: or('unfolding', 'inPreanimation', 'finishingAnimation', 'isLoadingFeed'),

  _startPreanimation() {
    setProperties(this, {
      'unfolding': false,
      'inPreanimation': true
    });
    later(this, '_startAnimation', get(this, 'preanimationTime'));
  },

  _startAnimation() {
    set(this, 'inPreanimation', false);
    later(this, '_incrementTimer', get(this, 'animationDelayTime'));
  },

  _incrementTimer() {
    const msPerDegree = get(this, 'msPerDegree');
    const rotationDegrees = get(this, 'rotationDegrees');

    if ((rotationDegrees + 1) > 360) {
      this._endAnimation();
    } else {
      set(this,'rotationDegrees', rotationDegrees + 1);
      later(this, '_incrementTimer', msPerDegree);
      this._checkStepChange();
    }
  },

  _checkStepChange() {
    const rotationDegrees = get(this, 'rotationDegrees');
    const percentDone = rotationDegrees / 360;
    const animationSteps = get(this, 'animationSteps');

    let currentStep = get(this, 'currentStep');
    const nextStep = animationSteps.find(step => {
      return parseFloat(get(step, 'triggerAt')) > parseFloat(get(currentStep, 'triggerAt'));
    });

    if (isPresent(nextStep)) {
      if (parseFloat(percentDone) > parseFloat(get(nextStep, 'triggerAt'))) {
        this._setOffSlidesAndFades()
        .then(() => {
          set(this, 'activeStepTriggeredAt', get(nextStep, 'triggerAt'));
        });
      }
    }
  },

  _setOffSlidesAndFades() {
    set(this, 'titleFade', true);

    return new Promise(resolve => {
      later(() => {
        set(this, 'titleFade', false);
        resolve();
      }, 500);
    });
  },

  _endAnimation() {
    setProperties(this, {
      'activeStepTriggeredAt': 1,
      'titleFade': false,
      'finishingAnimation': true
    });

    later(() => {
      setProperties(this, {
        'finishingAnimation': false,
        'isLoadingFeed': true
      });

      this.onAnimationEnd();
    }, 900);
  }

});
