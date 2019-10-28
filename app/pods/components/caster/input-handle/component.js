import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { debounce } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  api: service(),

  newHandle: null,
  isSavingHandle: false,
  inputClass: null,

  hasCheckedHandle: false,
  isCheckingHandle: false,
  newHandleIsUnique: false,

  minHandleLength: 3,
  maxHandleLength: 16,

  _checkNewHandle() {
    set(this, 'newHandleIsUnique', false);

    if (get(this, 'hasNewHandle')) {
      const newHandle = get(this, 'newHandle');

      set(this, 'isCheckingHandle', true);

      get(this, 'api').isExistingHandle(newHandle)
      .then(() => {
        set(this, 'newHandleIsUnique', false);
      })
      .catch(({response}) => {
        if (parseInt(response.status) === 404) {
          set(this, 'newHandleIsUnique', true);
        }
      })
      .finally(() => {
        set(this, 'isCheckingHandle', false);

        if (!get(this, 'hasCheckedHandle')) {
          set(this, 'hasCheckedHandle', true);
        }
      });
    }
  },

  hasValidHandleLength(newHandle) {
    const isLongEnough = newHandle.length >= get(this, 'minHandleLength');
    const isShortEnough = newHandle.length <= get(this, 'maxHandleLength');
    return isLongEnough && isShortEnough;
  },

  hasNewHandle: computed('newHandle', function() {
    const newHandle = get(this, 'newHandle') || '';

    return isPresent(newHandle) && this.hasValidHandleLength(newHandle);
  }),

  newHandleLength: computed('newHandle', function() {
    const newHandle = get(this, 'newHandle') || '';
    return newHandle.length;
  }),

  newHandleIsNotUnique: computed('hasNewHandle', 'newHandleIsUnique', 'hasCheckedHandle', function() {
    return get(this, 'hasCheckedHandle') && get(this, 'hasNewHandle') && !get(this, 'newHandleIsUnique');
  }),

  actions: {
    handleIsChanging() {
      debounce(this, '_checkNewHandle', 500);
    },
  }
});
