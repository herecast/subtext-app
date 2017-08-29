import Ember from 'ember';

const {get, set, computed, inject, $} = Ember;

export default Ember.Component.extend({
  classNames: ['FloatingActionButton'],
  classNameBindings: ['showContent:expanded'],

  tracking: inject.service(),
  modals: inject.service(),

  showMessage: true,
  showContent: false,

  messagePrompt: 'You can use DailyUV to do many things in your community!',
  messageHeader: 'What would you like to do on DailyUV?',

  message: computed('messagePrompt', 'messageHeader', 'showContent', function() {
    return get(this, 'showContent') ? get(this, 'messageHeader') : get(this, 'messagePrompt');
  }),

  isAnimatingAway: false,
  windowHeight: 1000,

  styleForContent: computed('isAnimatingAway', 'windowHeight', 'showContent', function() {
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

  collapse() {
    if (!get(this, 'isDestroyed')) {
      get(this, 'tracking').trackUGCJobsTrayClosed();
      get(this, 'modals').removeModalBodyClass();
      set(this, 'isAnimatingAway', true);
      Ember.run.later(() => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'showContent', false);
          set(this, 'isAnimatingAway', false);
        }
      }, 300);
    }
  },

  expand() {
    get(this, 'tracking').trackUGCJobsTrayOpened();
    get(this, 'modals').addModalBodyClass();
    if (!get(this, 'isDestroyed')) {
      set(this, 'showContent', true);
    }
  },

  click(e) {
    // Clicking on overlay should close the modal
    const $target = $(e.target);
    if (get(this, 'showContent') && $target.hasClass('FloatingActionButton')) {
      this.collapse();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    const $window = $(window);
    set(this, 'windowHeight', $window.height());
    $window.on(get(this, 'keyForResizeWindow'), () => {
      if (!get(this, 'isDestroyed')) {
        set(this, 'windowHeight', $window.height());
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    $(window).off(get(this, 'keyForResizeWindow'));
    get(this, 'modals').removeModalBodyClass();
  },

  actions: {
    toggleContent() {
      if (get(this, 'showContent')) {
        this.collapse();
      } else {
        this.expand();
      }
    }
  }
});
