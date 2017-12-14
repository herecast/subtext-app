import Ember from 'ember';

const {
  get,
  setProperties,
  computed,
  isPresent,
  inject
} = Ember;

export default Ember.Controller.extend({
  session: inject.service(),
  windowLocation: inject.service(),
  features: inject.service('feature-flags'),
  api: inject.service(),
  notify: inject.service('notification-messages'),
  logger: inject.service(),

  forgotPasswordReturnUrl: computed(function(){
    return get(this, 'windowLocation').href();
  }),

  listservName: computed.alias('model.listserv.name'),

  requiresSignIn: computed('session.currentUser.userId', 'model.userId', function() {
    const sessionUserId = get(this, 'session.currentUser.userId');
    const modelUserId = get(this, 'model.userId');
    if(isPresent(modelUserId)) {
      if(isPresent(sessionUserId) ) {
        if(modelUserId !== sessionUserId) {
          return true;
        }
      } else {
        return true;
      }
    }

    return false;
  }),

  trackPublishEvent() {
    get(this, 'api').updateListservProgress(
      get(this, 'model.id'),
      { step_reached: 'published' }
    );
  },

  dashboardTab: computed('model.channelType', function() {
    const channel_type = get(this, 'model.channelType');
    if(channel_type === 'event') {
      return 'events';
    } else {
      return channel_type;
    }
  }),

  transitionToDashboard() {
    this.transitionToRoute(
      'dashboard', {
        queryParams: {
          type: get(this, 'dashboardTab'),
          new_content: get(this, 'model.contentId'),
          organization_id: null
        }
      }
    ).then(() => {
      // make sure we reset the scroll
      window.scrollTo(0,0);
    });
  },

  actions: {
    afterSignIn() {
      this.send('authChanged');
    },

    updateListservMetric(listservId, step) {
      const api = get(this, 'api');

      api.updateListservProgress(listservId, {
        'enhance_link_clicked': true,
        'step_reached': step
      });
    },

    saveAndPublish(post) {
      return post.save().then(()=>{
        const listservContent = get(this, 'model');
        setProperties(listservContent, {
          contentId: get(post, 'contentId'),
          subject: get(post, 'title'),
          body: get(post, 'content')
        });

        return listservContent.save().then(
          () => {
            this.trackPublishEvent();
            this.transitionToDashboard();
          },
          (e) => {
            e.message = ['Could not save listserv content.', e.message].join(' ');
            get(this, 'logger').error(e);
            get(this, 'notify').error('Something went wrong. Please contact us by clicking the ? icon near the bottom of the page.');
          }
        );
      });
    }
  }
});
