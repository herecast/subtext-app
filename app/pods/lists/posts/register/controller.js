import Ember from 'ember';

const {
  get,
  set,
  inject,
  RSVP: {Promise},
  computed
} = Ember;

export default Ember.Controller.extend({
  session: inject.service(),
  api: inject.service(),
  postsController: inject.controller('lists.posts'),
  listservContent: computed.alias('postsController.model'),
  listservName: computed.alias('listservContent.listserv.name'),
  channelType: computed.alias('listservContent.channelType'),
  error: null,

  registerUserAndSignIn() {
    const listservContent = get(this, 'listservContent');
    const confirmationKey = `listserv_content/${get(listservContent, 'id')}`;

    /*
     * Confirmed registration does a few things:
     * 1. it registers a new user account
     * 2. marks the user account confirmed (because of confirmation key)
     * 3. returns an authentication token for the user to be signed in
     *
     * confirmation_key is simply a combination of modelName and id, and the
     * backend uses it to ensure that it references a record which already
     * verifies an email address.  This can be a subscription or
     * listserv_content record.
     */
    return get(this, 'api').confirmedRegistration({
      registration: {
        email: get(listservContent, 'senderEmail'),
        name: get(listservContent, 'senderName'),
        confirmation_key: confirmationKey
      }
    }).then((data) => {
      /*
       * We're taking the returned authentication token, and setting up the
       * ember session with it.  (The user is signed in after this)
       */
      return get(this, 'session').authenticate('authenticator:restore', {
        email: data.email,
        token: data.token
      });
    });
  },

  actions: {
    next() {
      set(this, 'error', null);

      if(get(this, 'listservContent.senderName')) {
        return this.registerUserAndSignIn().then(()=>{
          get(this, 'postsController').send(
            'saveAndPublish',
            get(this, 'model')
          );
        });
      } else {
        set(this, 'error', 'Name is required');
        return Promise.reject();
      }
    }
  }

});
