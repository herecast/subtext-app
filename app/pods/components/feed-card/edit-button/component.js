import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { readOnly } from '@ember/object/computed';
import ObjectPromiseProxy from 'subtext-app/utils/object-promise-proxy';

export default Component.extend({
  tagName: 'span',

  currentService: service('currentController'),
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

  currentPath: readOnly('currentService.currentPath'),

  fromProfile: computed('currentPath', function() {
    return get(this,'currentPath').startsWith('profile');
  }),

  contentOrganizationId: computed('fromProfile', 'model.organizationId', function() {
    if (get(this, 'fromProfile')) {
      return get(this, 'model.organizationId') || null;
    }

    return null;
  }),

  canEditContent: computed('model.{authorId,organizationId}', 'session.isAuthenticated', function() {
    if ( get(this, 'session.isAuthenticated')) {
      const promise =  get(this, 'currentUser').then(currentUser => {
        const authorId = get(this, 'model.authorId');
        const organizationId = get(this, 'model.organizationId') || null;

        const canEditContent = currentUser.canEditContent(authorId, organizationId);
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
