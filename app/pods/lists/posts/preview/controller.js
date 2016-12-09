import Ember from 'ember';

const { get, set, inject, computed } = Ember;

export default Ember.Controller.extend({
  showSuccessModal: false,

  listservContent: computed.alias('model'),
  enhancedPost: computed.alias('model.enhancedPost'),

  listservName: computed.alias('model.listserv.name'),

  notify: inject.service('notification-messages'),

  liveRoute: computed('model.{isMarket,isEvent,isTalk}', function() {
    const model = get(this, 'model');

    if(model.get('isMarket')) {
      return 'market.all.show';
    } else if(model.get('isEvent')) {
      return 'events.all.show';
    } else if(model.get('isTalk')) {
      return 'talk.all.show';
    }
  }),

  pageIdentityOrModel: computed('enhancedPost.id', function() {
    let linkId;
    if (get(this, 'enhancedPost.firstInstanceId')) {
      // EVENT
      linkId = get(this, 'enhancedPost.firstInstanceId');
    } else {
      linkId = get(this, 'enhancedPost.id');
    }
    return linkId;
  }),

  sendToShowPage() {
    const listservName = get(this, 'listservName');

    const toastMessage = `
      <div>
        <h4>Your Post has been SENT!</h4>
        <div data-test-listserv-content-success-message>
        Your Post is now LIVE on dailyUV and will appear in the next ${listservName} digest.<br>
        Click the avatar image in the header to visit your
        <a class="u-textUnderline" href='/dashboard'>dashboard and manage your account</a>.
        <br><strong>Happy posting and browsing!</strong>
        </div>
      </div>
    `;

    get(this, 'notify').info(
      toastMessage,
      {
        htmlContent: true,
        clearDuration: 20000
      }
    );

    this.transitionToRoute(
      get(this, 'liveRoute'),
      get(this, 'pageIdentityOrModel')
    ).then(() => {
      // make sure we reset the scroll
      window.scrollTo(0,0);
    });
  },

  actions: {
    saveListservContent() {
      const contentId = get(this, 'enhancedPost.contentId');
      if (contentId) {
        set(this, 'model.contentId', contentId);
      }

      get(this, 'model')
        .save()
        .then(
          () => this.sendToShowPage(),
          () => get(this, 'notify').error('Could not save listserv content')
        );
    }
  }

});
