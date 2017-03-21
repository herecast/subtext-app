import Ember from 'ember';
import TalkValidations from 'subtext-ui/validations/talk';
import MarketValidations from 'subtext-ui/validations/market';
import EventValidations from 'subtext-ui/validations/event';

const {
  computed,
  get,
  RSVP: {Promise}
} = Ember;

export default Ember.Controller.extend({
  listservName: computed.alias('listservContent.listserv.name'),
  channelType: computed.alias('listservContent.channelType'),

  validations: computed('channelType', function() {
    const ct = get(this, 'channelType');

    switch(ct) {
      case 'talk':
        return TalkValidations;
      case 'market':
        return MarketValidations;
      case 'event':
        return EventValidations;
    }

  }),
  actions: {
    save(changeset) {
      changeset.validate();
      if(get(changeset, 'isValid')) {
        changeset.execute();
        this.transitionToRoute('lists.posts.review');
      } else {
        return Promise.reject();
      }
    }
  }
});
