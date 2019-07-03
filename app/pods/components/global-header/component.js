import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import TestSelector from 'subtext-app/mixins/components/test-selector';
import Component from '@ember/component';

export default Component.extend(TestSelector, {
  classNames: ['GlobalHeader'],

  fastboot: service(),
  isFastBoot: alias('fastboot.isFastBoot'),

  streamlinedHeader: false,

  showChevron: computed('streamlinedHeader', 'isFastBoot', function() {
    if (get(this, 'isFastBoot')) {
      return false;
    }

    return get(this, 'streamlinedHeader');
  }),

  showNav: computed('streamlinedHeader', 'isFastBoot', function() {
    if (get(this, 'isFastBoot')) {
      return false;
    }

    return !get(this, 'streamlinedHeader');
  }),

  actions: {
    logoClicked() {
      $(window).scrollTop(0);
    }
  }
});
