import { equal } from '@ember/object/computed';
import $ from 'jquery';
import { setProperties, set, get } from '@ember/object';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  fastboot: service(),

  scrollDirection: null,

  isScrollingUp: equal('scrollDirection', 'up'),
  isScrollingDown: equal('scrollDirection', 'down'),


  _previousScrollPosition: 0,
  _scrollDirectionSwitchPosition: 0,
  scrollSinceDirectionSwitch: 0,
  currentScrollPosition: 0,

  init() {
    this._super(...arguments);

    if (!get(this, 'fastboot.isFastBoot')) {
      $(window).on('scroll.scrollDirection', () => {
        if (!get(this, 'isDestroyed')) {
          this._checkScrollDirection();
        }
      });
    }
  },

  _checkScrollDirection() {
    const previousScrollPosition = get(this, '_previousScrollPosition');

    const currentScrollPosition = $(window).scrollTop();

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

    set(this, 'currentScrollPosition', currentScrollPosition);

    set(this, 'scrollSinceDirectionSwitch', currentScrollPosition - get(this, '_scrollDirectionSwitchPosition'));
  },

  willDestroy() {
    this._super(...arguments);
    if (!get(this, 'fastboot.isFastBoot')) {
      $(window).off('scroll.scrollDirection');
    }
  }
});
