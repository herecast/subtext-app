import Ember from 'ember';
import moment from 'moment';

const {get, set, computed, inject, $} = Ember;

export default Ember.Component.extend({
  classNames: ['FloatingActionButton'],
  classNameBindings: ['showContent:expanded'],

  session: inject.service(),
  userLocation: inject.service(),
  modals: inject.service(),
  floatingActionButton: inject.service(),
  cookies: inject.service(),
  tracking: inject.service(),
  windowLocation: inject.service('window-location'),

  canShowTooltip: false,
  showTooltip: true,
  showJobTray: computed.alias('floatingActionButton.showContent'),
  isAnimatingAway: computed.alias('floatingActionButton.isAnimatingAway'),

  messagePrompt: 'You can use DailyUV to do many things in your community!',
  messageHeader: 'What would you like to do on DailyUV?',

  message: computed('messagePrompt', 'messageHeader', 'showJobTray', 'canShowTooltip', function() {
    if (!get(this, 'showJobTray') && !get(this, 'canShowTooltip')) {
      // we are not showing the job tray (orange button is visible) and
      // we are not permitted to show the tooltip, so let's clear out the message
      return null;
    } else {
      return get(this, 'showJobTray') ? get(this, 'messageHeader') : get(this, 'messagePrompt');
    }
  }),

  windowHeight: 1000,
  touchKeyboardIsOpen: false,

  hidden: computed('touchKeyboardIsOpen',
      'userLocation.locationIsConfirmed',
      'session.isLocationSwitcherToolTipOpen', function() {
    const touchKeyboardIsOpen = get(this, 'touchKeyboardIsOpen');
    const locationTooltipIsOpen = get(this, 'session.isLocationSwitcherToolTipOpen');
    const locationIsConfirmed = get(this, 'userLocation.locationIsConfirmed');

    return touchKeyboardIsOpen || (!locationIsConfirmed && locationTooltipIsOpen);
  }),

  styleForContent: computed('isAnimatingAway', 'windowHeight', 'showJobTray', function() {
    const styles = [];
    const $this = this.$();

    if (get(this, 'isAnimatingAway')) {
      const contentHeight = $this.find('.FloatingActionButton-content').height();
      styles.push(`margin-bottom: -${contentHeight}px`);
      styles.push('opacity: 0');
    }

    const maxHeight = get(this, 'windowHeight') - $this.find('.FloatingActionButton-header').outerHeight() - 10;
    styles.push(`max-height:${maxHeight}px`);

    return Ember.String.htmlSafe(styles.join(';'));
  }),

  keyForResizeWindow: computed('elementId', function() {
    return `resize.fab-${get(this, 'elementId')}`;
  }),

  namespaceForFocusEvent: computed('elementId', function() {
    return `fab-${get(this, 'elementId')}`;
  }),

  /**
   * The only way to know if the mobile keyboard is open is to track focus on inputs.
   * The purpose of this is to toggle a propverty to hide the jobs button if
   * an element has focus which utilizes keyboard input.
   */
  _watchFocus() {
    const namespace = get(this, 'namespaceForFocusEvent');
    Ember.$('body').on(`focus.${namespace}`, 'input,textarea,[contenteditable]', () => {
      if(!get(this, 'isDestroying')){
        set(this, 'touchKeyboardIsOpen', true);
      }
    });

    Ember.$('body').on(`focusout.${namespace}`, 'input,textarea,[contenteditable]', () => {
      if(!get(this, 'isDestroying')) {
        set(this, 'touchKeyboardIsOpen', false);
      }
    });
  },

  _unWatchFocus() {
    const namespace = get(this, 'namespaceForFocusEvent');

    Ember.$('body').off(`focus.${namespace}`);
    Ember.$('body').off(`focusout.${namespace}`);
  },

  click(e) {
    // Clicking on overlay should close the modal
    const $target = $(e.target);
    if (get(this, 'showJobTray') && $target.hasClass('FloatingActionButton')) {
      get(this, 'floatingActionButton').collapse();
    }
  },

  didInsertElement() {
    this._super(...arguments);

    const cookies = get(this, 'cookies');
    if (!cookies.read('hideUGCToolTip')) {
      set(this, 'canShowTooltip', true);
    }

    this._watchFocus();

    const $window = $(window);
    set(this, 'windowHeight', $window.height());
    $window.on(get(this, 'keyForResizeWindow'), () => {
      if (!get(this, 'isDestroyed')) {
        set(this, 'windowHeight', $window.height());
      }
    });
  },

  willDestroyElement() {
    set(this, 'floatingActionButton.showContent', false);

    this._super(...arguments);
    this._unWatchFocus();

    $(window).off(get(this, 'keyForResizeWindow'));
    get(this, 'modals').removeModalBodyClass();
  },

  actions: {
    dismissTooltip() {
      const cookies = get(this, 'cookies');
      const windowLocation = get(this, 'windowLocation');

      cookies.write('hideUGCToolTip', true, {
        path: '/',
        secure: windowLocation.protocol() === 'https',
        expires: moment().add(14, 'days').toDate()
      });

      set(this, 'canShowTooltip', false);

      get(this, 'tracking').trackUGCTooltipHide();
    },
    toggleContent() {
      if (get(this, 'showJobTray')) {
        get(this, 'floatingActionButton').collapse();
      } else {
        get(this, 'floatingActionButton').expand();
      }
    }
  }
});
