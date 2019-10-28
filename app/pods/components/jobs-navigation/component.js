import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['JobsNavigation'],
  classNameBindings: [
    'noFooterImage:JobsNavigation--noFooterImage'
  ],

  noFooterImage: false,

  showBehindModals: false,

  modals: service(),
  floatingActionButton: service(),
  session: service(),
  tracking: service(),

  onChooseJob: function() {},

  _openSignInModal() {
    return get(this, 'modals').showModal('modals/sign-in-register', {
      model: 'sign-in',
      alternateSignInMessage: 'You must be signed in to create content.'
    });
  },

  actions: {
    selectedMenuItem(job) {
      get(this, 'tracking').trackUGCJobClick(job);

      if (job === 'market' || job === 'event') {
        if (get(this, 'session.isAuthenticated')) {
          get(this, 'onChooseJob')(job);
        } else {
          get(this, 'floatingActionButton').setBehindModals(true);
          this._openSignInModal()
          .then(() => {
            get(this, 'floatingActionButton').setBehindModals(false);
            get(this, 'onChooseJob')(job);
          });
        }
      }
    }
  }
});
