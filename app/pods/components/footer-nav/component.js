import Ember from 'ember';

const {
  get,
  set,
  computed,
  inject,
  run
} = Ember;

export default Ember.Component.extend({
  tagName           : 'nav',
  currentController : inject.service(),
  currentChannel    : computed.alias('currentController.currentChannel'),

  hideFooter        : false,
  classNames        : ['FooterNav'],
  classNameBindings : ['hideFooter:is-hidden'],

  scheduledHide     : null, // cancellable run loop invocation
  scheduledShow     : null, // cancellable run loop invocation

  showExtendedNavMenu: false,

  didInsertElement() {
    let lastScrollPosition = 0;
    let scrollThreshold = 100;

    const scroller = () => {
      const scrollPosition = Ember.$(window).scrollTop();

      if (scrollPosition > lastScrollPosition) {
        const triggerHide = ((scrollPosition - lastScrollPosition) > scrollThreshold);

        if (triggerHide) {
          run.cancel(get(this, 'scheduledShow'));

          set(this, 'scheduledHide', run.later(this,
            () => { set(this, 'hideFooter', true); }, 300));
        }

      } else {
        run.cancel(get(this, 'scheduledHide'));

        set(this, 'scheduledShow', run.later(this,
          () => { set(this, 'hideFooter', false); }, 50));
      }

      lastScrollPosition = scrollPosition;
    };

    Ember.$(document).on('scroll.footerNav.handleScrollDirection',
                         () => { run.debounce(this, scroller, 25); });
  },

  willDestroyElement() {
    this._super(...arguments);

    Ember.$(document).off('scroll.footerNav');
  },

  actions: {
    closeExtendedNavMenu() {
      set(this, 'showExtendedNavMenu', false);
    },
    openExtendedNavMenu() {
      set(this, 'showExtendedNavMenu', true);
    },
    trackChannel() {
      if ('trackChannel' in this.attrs) {
        this.attrs.trackChannel(...arguments);
      }
    }
  }
});
