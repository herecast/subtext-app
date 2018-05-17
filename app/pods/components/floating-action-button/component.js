import Ember from 'ember';

const {get, set, computed, inject, $} = Ember;

export default Ember.Component.extend({
  classNames: ['FloatingActionButton'],
  classNameBindings: ['showJobTray:expanded'],

  session: inject.service(),
  userLocation: inject.service(),
  modals: inject.service(),
  floatingActionButton: inject.service(),
  cookies: inject.service(),
  tracking: inject.service(),
  windowLocation: inject.service('window-location'),

  showJobTray: computed.alias('floatingActionButton.showContent'),
  isAnimatingAway: computed.alias('floatingActionButton.isAnimatingAway'),

  windowHeight: 1000,
  touchKeyboardIsOpen: false,

  hidden: computed.readOnly('touchKeyboardIsOpen'),

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
        Ember.run(() => {set(this, 'touchKeyboardIsOpen', true); });
      }
    });

    Ember.$('body').on(`focusout.${namespace}`, 'input,textarea,[contenteditable]', () => {
      if(!get(this, 'isDestroying')) {
        Ember.run(() => {set(this, 'touchKeyboardIsOpen', false); });
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
    toggleContent() {
      if (get(this, 'showJobTray')) {
        get(this, 'floatingActionButton').collapse();
      } else {
        get(this, 'floatingActionButton').expand();
      }
    }
  }
});
