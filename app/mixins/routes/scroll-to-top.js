import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  fastboot: service(),
  isFastBoot: readOnly('fastboot.isFastBoot'),

  actions: {
    didTransition: function() {
      if(!get(this, 'isFastBoot')) {
        $(window).scrollTop(0);
      }
      return true; // Bubble the didTransition event
    }
  }
});
