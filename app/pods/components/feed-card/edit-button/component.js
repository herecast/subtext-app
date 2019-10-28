import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import ObjectPromiseProxy from 'subtext-app/utils/object-promise-proxy';

export default Component.extend({
  tagName: 'span',

  fastboot: service(),
  session: service(),
  floatingActionButton: service(),

  model: null,

  iconSize: null,
  color: null,
  editButtonIsActive: false,
  isTransitioning: false,

  currentUser: computed(function() {
    return Promise.resolve( get(this, 'session.currentUser') );
  }),

  canEditContent: computed('model.casterId', 'session.isAuthenticated', function() {
    if ( get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      const promise =  get(this, 'currentUser').then(currentUser => {
        const contentCasterId = get(this, 'model.casterId');

        const canEditContent = currentUser.canEditContent(contentCasterId);
        this._setEditButtonIsActive(canEditContent);

        return canEditContent;
      });

      return ObjectPromiseProxy.create({promise});
    }

    return false;
  }),

  _setEditButtonIsActive(isActive) {
    set(this, 'editButtonIsActive', isActive);
  },

  actions: {
    editContent() {
      if (!get(this, 'isTransitioning')) {
        set(this, 'isTransitioning', true);

        next(() => {
          get(this, 'floatingActionButton').editContent(get(this, 'model'))
          .then(() => {
            if (get(this, 'onEdit')) {
              get(this, 'onEdit')();
            }
            set(this, 'isTransitioning', false);
          });
        });
      }
    }
  }
});
