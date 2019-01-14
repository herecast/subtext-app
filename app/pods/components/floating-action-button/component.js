import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get, setProperties } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  classNames: ['FloatingActionButton'],
  classNameBindings: ['isExpanded:expanded', 'behindModals:behind-modals'],

  session: service(),
  userLocation: service(),
  modals: service(),
  floatingActionButton: service(),
  fastboot: service(),
  cookies: service(),
  tracking: service(),
  windowLocation: service('window-location'),

  isExpanded: alias('floatingActionButton.showContent'),
  isAnimatingAway: alias('floatingActionButton.isAnimatingAway'),
  behindModals: alias('floatingActionButton.behindModals'),
  isFastBoot: alias('fastboot.isFastBoot'),

  showJobsTray: alias('floatingActionButton.showJobsTray'),
  showUGC: alias('floatingActionButton.showUGC'),
  activeForm: alias('floatingActionButton.activeForm'),
  editingModel: alias('floatingActionButton.editingModel'),

  windowHeight: 1000,

  keyForResizeWindow: computed('elementId', function() {
    return `resize.fab-${get(this, 'elementId')}`;
  }),

  namespaceForFocusEvent: computed('elementId', function() {
    return `fab-${get(this, 'elementId')}`;
  }),

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
    get(this, 'floatingActionButton').collapse(false);
    get(this, 'modals').removeModalBodyClass();
  },

  actions: {
    toggleIsExpanded() {
      if (get(this, 'isExpanded')) {
        get(this, 'floatingActionButton').collapse();
      } else {
        get(this, 'floatingActionButton').expand();
      }
    },

    showForm(channelName) {
      setProperties(this, {
        showJobsTray: false,
        showUGC: true,
        activeForm: channelName || 'market'
      });
    }
  }
});
