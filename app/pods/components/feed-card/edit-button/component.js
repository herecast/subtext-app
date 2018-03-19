import Ember from 'ember';

const { readOnly } = Ember.computed;
const { service } = Ember.inject;
const { Promise } = Ember.RSVP;
const { computed, get, set } = Ember;
import ObjectPromiseProxy from 'subtext-ui/utils/object-promise-proxy';

export default Ember.Component.extend({
  tagName: 'span',

  currentService: service('currentController'),
  session: service(),

  model: null,

  editPath: null,
  editPathId: null,
  iconSize: null,
  color: null,
  style: null,
  editButtonIsActive: false,

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

        set(this, 'editButtonIsActive', canEditContent);
        return canEditContent;
      });

      return ObjectPromiseProxy.create({promise});
    }

    return false;
  })
});
