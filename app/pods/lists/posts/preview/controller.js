import Ember from 'ember';

const { get, set, inject, computed } = Ember;

export default Ember.Controller.extend({
  showSuccessModal: false,

  listservContent: computed.alias('model'),
  enhancedPost: computed.alias('model.enhancedPost'),

  listservName: computed.alias('model.listserv.name'),

  toast: inject.service(),

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
    const toastOptions = {
      closeButton: true,
      positionClass: "toast-top-center afterSubscriptionToast",
      showDuration: 0,
      hideDuration: 1000,
      timeOut: 0,
      extendedTimeOut: 0
    };

    const listservName = get(this, 'listservName');

    const toastMessage = `
      <div data-test-listserv-content-success-message>
      Your Post is now LIVE on dailyUV and will appear in the next ${listservName} digest. WHOOP!<br>
      Click the avatar image in the header to visit your
      <a class="u-textUnderline" href='/dashboard'>dashboard and manage your account</a>.
      <strong>Happy posting and browsing!</strong>
      </div>
    `;

    get(this, 'toast').info(
      toastMessage,
      "Your Post has been SENT!",
      toastOptions
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
          () => get(this, 'toast').error('Could not save listserv content')
        );
    }
  }

});
