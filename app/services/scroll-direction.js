import Ember from 'ember';

const { get, set, setProperties, computed, inject:{service} } = Ember;

export default Ember.Service.extend({
  fastboot: service(),

  scrollDirection: null,

  isScrollingUp: computed.equal('scrollDirection', 'up'),
  isScrollingDown: computed.equal('scrollDirection', 'down'),


  _previousScrollPosition: 0,
  _scrollDirectionSwitchPosition: 0,
  scrollSinceDirectionSwitch: 0,

  init() {
    this._super(...arguments);

    if (!get(this, 'fastboot.isFastBoot')) {
      Ember.$(window).on('scroll.scrollDirection', () => {
        if (!get(this, 'isDestroyed')) {
          this._checkScrollDirection();
        }
      });
    }
  },

  _checkScrollDirection() {
    const previousScrollPosition = get(this, '_previousScrollPosition');
    const currentScrollPosition = Ember.$(window).scrollTop();
    const currentScrollDirection = get(this, 'scrollDirection');

    const scrollDifference = currentScrollPosition - previousScrollPosition;

    if (scrollDifference > 0) {
      if (currentScrollDirection !== 'down') {
        setProperties(this, {
          'scrollDirection': 'down',
          '_scrollDirectionSwitchPosition': currentScrollPosition
        });
      }
    } else {
      if (currentScrollDirection !== 'up') {
        setProperties(this, {
          'scrollDirection': 'up',
          '_scrollDirectionSwitchPosition': currentScrollPosition
        });
      }
    }

    set(this, '_previousScrollPosition', currentScrollPosition);

    set(this, 'scrollSinceDirectionSwitch', currentScrollPosition - get(this, '_scrollDirectionSwitchPosition'));
  },

  willDestroy() {
    this._super(...arguments);
    if (!get(this, 'fastboot.isFastBoot')) {
      Ember.$(window).off('scroll.scrollDirection');
    }
  }
});
