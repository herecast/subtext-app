import Ember from 'ember';
import IntroJSComponent from 'ember-introjs/components/intro-js';

const { get, set } = Ember;

export default IntroJSComponent.extend({
  //IntroJS Options
  'show-step-numbers': false,
  'exit-on-esc': false,
  'exit-on-overlay-click': false,
  'keyboard-navigation': false,
  'scroll-to-element': true,

  //Internal Counters
  currentStep: null,
  totalSteps: null,

  _onFinish() {
    if (get(this, 'onFinish')) {
      get(this, 'onFinish')();
    }
  },

  //IntroJS extensions and overrides
  startIntroJS() {
    this._super(...arguments);

    if (get(this, 'start-if')) {
      set(this, 'totalSteps', get(this, 'introJS._introItems.length'));
    }
  },

  _onAfterChange(){
    this._super(...arguments);

    set(this, 'currentStep', get(this, 'introJS._currentStep')+1);
  },

  _onComplete() {
    this._super(...arguments);
    this._onFinish();
  },

  _onExit() {
    this._super(...arguments);
    this._onFinish();
  },
  //End extensions and overrides

  actions: {
    nextStep() {
      get(this, 'introJS').nextStep();
    }
  }
});
