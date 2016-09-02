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

  _hideFooter       : false,
  _inputHasFocus    : false,
  classNames        : ['FooterNav'],
  classNameBindings : ['hideFooter:is-hidden'],

  scheduledHide     : null, // cancellable run loop invocation
  scheduledShow     : null, // cancellable run loop invocation

  showExtendedNavMenu: false,

  hideFooter: computed('_hideFooter', '_inputHasFocus', function() {
    return get(this, '_hideFooter') || get(this, '_inputHasFocus');
  }),

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
            () => { set(this, '_hideFooter', true); }, 300));
        }

      } else {
        run.cancel(get(this, 'scheduledHide'));

        set(this, 'scheduledShow', run.later(this,
          () => { set(this, '_hideFooter', false); }, 50));
      }

      lastScrollPosition = scrollPosition;
    };

    Ember.$(window).on('scroll.footerNav.handleScrollDirection',
                         () => { run.debounce(this, scroller, 25); });

    Ember.$('body').on('focusin.footerNav', 'input, textarea', () => {
      run(()=>{
        set(this, '_inputHasFocus', true);
      });
    });

    Ember.$('body').on('focusout.footerNav', 'input, textarea', () => {
      run(()=>{
        set(this, '_inputHasFocus', false);
      });
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    Ember.$(window).off('scroll.footerNav');
    Ember.$('body').off('focusin.footerNav');
    Ember.$('body').off('focusout.footerNav');
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
