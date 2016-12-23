import Ember from 'ember';

const {get, set, $, computed, run} = Ember;

export default Ember.Service.extend({

  _hideFooter       : false,
  _inputHasFocus    : false,

  scheduledHide     : null, // cancellable run loop invocation
  scheduledShow     : null, // cancellable run loop invocation

  hideFooter: computed('_hideFooter', '_inputHasFocus', function() {
    return get(this, '_hideFooter') || get(this, '_inputHasFocus');
  }),

  watchEvents() {
    let lastScrollPosition = 0;
    let scrollThreshold = 100;

    const scroller = () => {
      const scrollPosition = $(window).scrollTop();

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

    $(window).on('scroll.footerNav.handleScrollDirection',
      () => { run.debounce(this, scroller, 25); });

    Ember.$('body').on('focusin.footerNav', 'input, textarea', () => {
      run(()=>{
        set(this, '_inputHasFocus', true);
      });
    });

    $('body').on('focusout.footerNav', 'input, textarea', () => {
      run(()=>{
        set(this, '_inputHasFocus', false);
      });
    });
  },

  unwatchEvents() {
    const $body = $('body');

    $(window).off('scroll.footerNav');
    $body.off('focusin.footerNav');
    $body.off('focusout.footerNav');
  }
});
