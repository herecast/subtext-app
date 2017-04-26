import Ember from 'ember';

const {
  get,
  inject,
  RSVP: {Promise},
  computed
} = Ember;

export default Ember.Controller.extend({
  session: inject.service(),
  listservContent: null,
  editController: inject.controller('lists.posts.edit'),
  postsController: inject.controller('lists.posts'),
  listservName: computed.alias('listservContent.listserv.name'),
  channelType: computed.alias('listservContent.channelType'),
  validations: computed.alias('editController.validations'),

  requiresRegistration: computed.not('session.isAuthenticated'),

  actions: {
    next(changeset) {
      changeset.validate();
      if(get(changeset, 'isValid')) {
        changeset.execute();

        if(get(this, 'requiresRegistration')) {
          this.transitionToRoute('lists.posts.register');
        } else {
          // The lists.posts controller handles this logic
          // since it's shared between this step and the
          // next optional register step.
          get(this, 'postsController').send(
            'saveAndPublish',
            get(this, 'model')
          );
        }
      } else {
        return Promise.reject();
      }
    }
  }

});
