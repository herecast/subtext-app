import Ember from 'ember';

const { get, set, inject, isPresent } = Ember;

export default Ember.Route.extend({
  api: inject.service(),
  toast: inject.service(),

  toastOptions: {
    closeButton: true,
    positionClass: "toast-top-center afterSubscriptionToast",
    showDuration: 0,
    hideDuration: 1000,
    timeOut: 0,
    extendedTimeOut: 0
  },

  listservName: null,

  model(params) {
    return this.store.findRecord('listserv-content', params.id);
  },

  afterModel(model) {
    if(isPresent(model.get('verifiedAt'))) {
      get(this, 'toast').info(
        "You have already verified your post. Thank you."
      );
      this.transitionTo('index');
      return;
    }

    get(this, 'api').confirmListservPost(model.id).then(
      () => {
        model.get('listserv').then(
          (listserv) => {
            set(this, 'listservName', listserv.get('name'));
            this.sendToIndex();
          });
      },
      () => {
        this.showError();
      });
  },

  sendToIndex() {
    const listservName = get(this, 'listservName');
    let text =  "It will appear with the rest of the email-only posts in tomorrow's digest but unfortunately not on dailyUV.<br />";
    text +=     "<strong class='u-textBold'>If you would like it to be included on dailyUV and stand out in the digest...</strong><br />";
    text +=     `Try choosing "Enhance My Post" or <a class="u-textUnderline" href="/sign_up">sign-up</a> to share your post on dailyUV.com and the ${listservName} list.<br />`;
    text +=     `Check out tomorrow's ${listservName} list digest to see the difference.`;
    const title = `Your Post has been SENT to the ${listservName} list.`;
    const options = get(this, 'toastOptions');

    get(this, 'toast').info(text, title, options);
    this.transitionTo('index');
  },

  showError() {
    const text =  "Please contact us at <a href='mailto:dailyuv@subtext.org'>dailyuv@subtext.org</a>";
    const title = `There was a problem posting your content.`;
    const options = get(this, 'toastOptions');

    get(this, 'toast').error(text, title, options);
  }
});
