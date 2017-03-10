import Ember from 'ember';

const {
  get,
  set,
  inject,
  computed
} = Ember;

export default Ember.Controller.extend({
  api: inject.service(),
  editController: inject.controller('lists.posts.edit'),
  listservName: computed.alias('listservContent.listserv.name'),
  channelType: computed.alias('listservContent.channelType'),
  validations: computed.alias('editController.validations'),

  notify: inject.service('notification-messages'),

  dashboardTab: computed('channelType', function() {
    const chtype = get(this, 'channelType');
    if(chtype === 'event') {
      return 'events';
    } else {
      return chtype;
    }
  }),

  trackPublishEvent() {
    get(this, 'api').updateListservProgress(
      get(this, 'listservContent.id'),
      { step_reached: 'published' }
    );
  },

  sendToShowPage() {
    this.transitionToRoute(
      'dashboard', {
        queryParams: {
          type: get(this, 'dashboardTab'),
          new_content: get(this, 'model.contentId')
        }
      }
    ).then(() => {
      // make sure we reset the scroll
      window.scrollTo(0,0);
    });
  },

  actions: {
    saveAndPublish(changeset) {
      return changeset.save().then(() => {
        const listservContent = get(this, 'listservContent');
        const model = get(this, 'model');
        set(listservContent, 'contentId',
          get(model, 'contentId')
        );

        listservContent.setProperties({
          subject: get(model, 'title'),
          body: get(model, 'content')
        });

        return listservContent.save().then(
          () => {
            this.trackPublishEvent();
            this.sendToShowPage();
          },
          (e) => {
            console.error('Could not save listserv content', e);
            get(this, 'notify').error('Something went wrong. Please contact us.');
          }
        );
      }).catch(()=>{
        console.error('Error saving model.');
        get(this, 'model.errors').forEach(({attribute, message}) => {
          changeset.pushErrors(attribute, message);
        });
      });
    }
  }

});
