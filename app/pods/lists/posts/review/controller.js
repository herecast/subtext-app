import Ember from 'ember';

const { get, set, inject, computed } = Ember;

export default Ember.Controller.extend({
  api: inject.service(),
  listservName: computed.alias('listservContent.listserv.name'),
  channelType: computed.alias('listservContent.channelType'),

  notify: inject.service('notification-messages'),

  contentId: computed('model.id', 'model.firstInstanceId', function() {
    let id;
    if (get(this, 'model.firstInstanceId')) {
      // EVENT
      id = get(this, 'model.firstInstanceId');
    } else {
      id = get(this, 'model.id');
    }

    return id;
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
          type: get(this, 'channelType'),
          new_content: get(this, 'contentId')
        }
      }
    ).then(() => {
      // make sure we reset the scroll
      window.scrollTo(0,0);
    });
  },

  actions: {
    saveAndPublish() {
      const model = get(this, 'model');
      const listservContent = get(this, 'listservContent');

      model.save().then(() => {
        set(listservContent, 'contentId',
          get(model, 'contentId')
        );

        listservContent.setProperties({
          subject: get(model, 'title'),
          body: get(model, 'content')
        });

        listservContent.save().then(
          () => {
            this.trackPublishEvent();
            this.sendToShowPage();
          },
          (e) => {
            console.error('Could not save listserv content', e);
            get(this, 'notify').error('Something went wrong. Please contact us.');
          }
        );
      });

    }
  }

});
