import Ember from 'ember';

const { get, set, inject, isPresent } = Ember;

export default Ember.Route.extend({
  api: inject.service(),
  notify: inject.service('notification-messages'),

  listservName: null,

  model(params) {
    return this.store.findRecord('listserv-content', params.id);
  },

  afterModel(model) {
    if(isPresent(model.get('verifiedAt'))) {
      get(this, 'notify').info(
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
    const title = `Your Post has been SENT to the ${listservName}.`;
    let text =  `
      <div>
        <h4>${title}</h4>
        It will appear with the rest of the email-only posts in tomorrow's digest but unfortunately not on dailyUV.<br />
        <strong class='u-textBold'>If you would like it to be included on dailyUV and stand out in the digest...</strong><br />
        Try choosing "Enhance My Post" or <a class="u-textUnderline" href="/sign_up">sign-up</a> to share your post on dailyUV.com and the ${listservName}.<br />
        Check out tomorrow's ${listservName} digest to see the difference.
      </div>`;

    get(this, 'notify').info(text, {htmlContent: true});
    this.transitionTo('index');
  },

  showError() {
    const title = `There was a problem posting your content.`;
    const text =  `
      <div>
        <h4>${title}</h4>
        Please contact us at <a href='mailto:dailyuv@subtext.org'>dailyuv@subtext.org</a>
      </div>`;

    get(this, 'notify').error(text);
  }
});
