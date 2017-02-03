import Ember from 'ember';

const {
  get,
  computed,
  isPresent,
  inject
} = Ember;

export default Ember.Controller.extend({
  session: inject.service(),
  windowLocation: inject.service(),
  features: inject.service('feature-flags'),

  forgotPasswordReturnUrl: computed(function(){
    return get(this, 'windowLocation').href();
  }),

  listservName: computed.alias('model.listserv.name'),

  confirmationKey: computed('model.id', function() {
    return `listserv_content/${get(this, 'model.id')}`;
  }),

  requiresRegistration: computed('model.userId', 'session.currentUser.authenticated', function() {
    const sessionUserId = get(this, 'session.currentUser.userId');
    const modelUserId = get(this, 'model.userId');

    if (isPresent(modelUserId)) {
      return false;
    } else if(isPresent(sessionUserId)) {
      return false;
    } else {
      return true;
    }
  }),

  requiresSignIn: computed('session.currentUser.userId', 'model.userId', function() {
    const sessionUserId = get(this, 'session.currentUser.userId');
    const modelUserId = get(this, 'model.userId');
    if(isPresent(modelUserId)) {
      if( isPresent(sessionUserId) ) {
        if(modelUserId !== sessionUserId) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else if(isPresent(sessionUserId)) {
      return false;
    } else {
      return true;
    }
  }),

  actions: {
    afterSignIn() {
      this.send('authChanged');
    }
  }
});
