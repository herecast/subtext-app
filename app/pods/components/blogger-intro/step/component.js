import { notEmpty, or, readOnly } from '@ember/object/computed';
import $ from 'jquery';
import { computed, set, get } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import StepComponent from 'ember-introjs/components/step';

export default StepComponent.extend({
  classNames: 'BloggerIntro-Step',
  classNameBindings: ['hasHighlightedElement:show-arrow'],

  media: service(),
  isMobile: readOnly('media.isMobile'),

  modal: false,
  yieldBeforeAvatar: false,
  replaceTooltip: false,
  showLanscapePicture: false,
  hideHelpButton: false,
  preserveModal: false,
  yieldOnMobile: false,
  scope: null,

  intro: "",
  currentStep: null,

  onStepStartAction: null,

  nextButton: null,
  nextButtonAction: null,
  nextButtonDisabled: false,

  actionButton: null,
  actionButtonAction: null,
  continueAfterAction: false,

  confirmButton: false,
  confirmButtonAction: null,
  confirmButtonDisabled: false,
  confirmButtonIsLoading: false,

  hideNavigation: false,

  highlightedIdentifier: null,
  hasHighlightedElement: notEmpty('highlightedIdentifier'),
  highlightedElement: null,
  highlightPositionVertical: 'bottom',
  highlightPositionHorizontal: 'center',

  modalDialogStyle: null,
  hideHelperLayer: true,

  hideYieldAfterAvatar: or('replaceTooltip', 'yieldBeforeAvatar'),

  didInsertElement() {
    this._super(...arguments);

    if (get(this, 'hasHighlightedElement')) {
      const highlightedIdentifier = get(this,'highlightedIdentifier');
      const scope = get(this, 'scope') || this.element;
      const highlightedElement = $(scope).find(highlightedIdentifier)[0];

      set(this, 'highlightedElement', highlightedElement);

      $(window).on('resize.blogstep', () => {
        if (get(this, 'isCurrentStep')) {
          run.debounce(this, this._resetModalPosition, 300);
        }
      });
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    $(window).off('resize.blogstep');
  },

  _resetModalPosition() {
    if (!get(this, 'isDestroyed')) {
      set(this, '_correctHighlightedElement', get(this, 'highlightedElement'));

      set(this, 'highlightedElement', null);

      run.next(() => {
        set(this, 'highlightedElement', get(this, '_correctHighlightedElement'));
      });
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);

    const highlightedElement = get(this, 'highlightedElement');

    if (get(this, 'scope') && get(this, 'introJS') && highlightedElement) {
      if (get(this, 'isCurrentStep')) {
        const introItem = get(this, 'step') - 1;
        const _introItems = get(this, 'introJS._introItems');

        set(_introItems[introItem], 'element', highlightedElement);
        get(this, 'introJS').refresh();
        $(highlightedElement).addClass('introjs-showElement introjs-relativePosition');
      } else {
        $(highlightedElement).removeClass('introjs-showElement introjs-relativePosition');
      }
    }
  },

  tooltipClass: computed('modal', function() {
    let klass = 'BloggerIntro-Step-tooltip';
    if (get(this, 'modal')) {
      klass += '-hide';
    }
    return klass;
  }),

  highlightClass: computed('modal', function() {
    let klass = 'BloggerIntro-Step-highlight';
    if (get(this, 'modal') && get(this, 'hideHelperLayer')) {
      klass += '-hide';
    }
    return klass;
  }),

  modalClass: computed('replaceTooltip', function() {
    let klass = 'BloggerIntro-Step--modal-wrapper';
    if (get(this, 'replaceTooltip')) {
      klass += ' positioned';
    }
    if (get(this, 'showLanscapePicture')) {
      klass += ' show-landscape-picture';
    }
    return htmlSafe(klass);
  }),

  isCurrentStep: computed('currentStep', function() {
    const isCurrentStep = get(this, 'step') === get(this, 'currentStep');

    if (isCurrentStep && get(this, 'onStepStartAction')) {
      get(this, 'onStepStartAction')();
    }

    return isCurrentStep;
  }),

  isLastStep: computed('step', 'totalSteps', function() {
    return get(this, 'step') >= get(this, 'totalSteps');
  }),

  _getElementCenterPoints(targetElement, positionX='center', positionY='bottom') {
    const boundingRect = targetElement.getBoundingClientRect();
    const width = boundingRect.right - boundingRect.left;
    const height = boundingRect.bottom - boundingRect.top;

    const offsetX = {
      'left': 0,
      'center': (width / 2),
      'right': width
    };

    const offsetY = {
      'top': 0,
      'center': (height / 2),
      'bottom': height
    };

    return {
      x: boundingRect.left + offsetX[positionX],
      y: boundingRect.top + offsetY[positionY]
    };
  },

  modalStyle: computed('isCurrentStep', 'highlightedElement', function() {
    if (get(this, 'isCurrentStep') && get(this, 'replaceTooltip') && get(this, 'hasHighlightedElement')) {

     run.next(this, () => {
        const highlightedElement = get(this, 'highlightedElement');
        const centerPoints = this._getElementCenterPoints(highlightedElement, get(this, 'highlightPositionHorizontal'), get(this, 'highlightPositionVertical'));
        const modalElement = $(this.element).find('.Modal-dialog')[0];

        if (modalElement) {
          const arrowOffset = 25;
          const modalLeft = centerPoints.x - (modalElement.offsetWidth / 2);
          let modalTop = centerPoints.y + arrowOffset;

          const windowHeight = window.innerHeight;

          const modalBottom = (modalTop + modalElement.offsetHeight);

          const modalGoesOffscreenBottom = modalBottom > windowHeight;
          const highlightedElementGoesOffscreenTop = highlightedElement.offsetTop < 0;

          if (modalGoesOffscreenBottom || highlightedElementGoesOffscreenTop) {
            let scrollDifference = 0;

            if (modalGoesOffscreenBottom) {
              scrollDifference = modalBottom - windowHeight;
              modalTop = windowHeight - modalElement.offsetHeight;
            } else {
              scrollDifference = highlightedElement.offsetTop * -1;
              modalTop = highlightedElement.offsetTop + arrowOffset;
            }

            window.scrollBy(0, scrollDifference);
          }

          set(this, 'modalDialogStyle', htmlSafe(`opacity:1;top:${modalTop}px;left:${modalLeft}px;`));
        }
      });
    }
    return null;
  }),

  actions: {
    skipToNextStep() {
      if (get(this, 'nextButtonAction')) {
        get(this, 'nextButtonAction')();
      }

      if (!get(this, 'isLastStep')) {
        get(this, 'nextStep')();
      }
    },

    confirmToNextStep() {
      if (get(this, 'confirmButtonAction')) {
        get(this, 'confirmButtonAction')();
      }

      if (!get(this, 'isLastStep')) {
        get(this, 'nextStep')();
      }
    },

    actionButtonClick() {
      if (get(this, 'actionButtonAction')) {
        get(this, 'actionButtonAction')();
      }

      if (get(this, 'continueAfterAction') && !get(this, 'isLastStep')) {
        get(this, 'nextStep')();
      }
    }
  }
});
