import Ember from 'ember';
import TalkValidations from 'subtext-ui/validations/talk';

const {
  computed,
  get
} = Ember;

export default Ember.Controller.extend({
  listservName: computed.alias('listservContent.listserv.name'),
  channelType: computed.alias('listservContent.channelType'),

  validations: computed('channelType', function() {
    const ct = get(this, 'channelType');

    switch(ct) {
      case 'talk':
        return TalkValidations;
        break;
      case 'market':
        return MarketValidations;
        break;
      case 'event':
        return EventValidations;
        break;
    }

  }),
  actions: {
    save(changeset) {
      if(get(changeset, 'isValid')) {
        changeset.execute();
        this.transitionToRoute('lists.posts.review');
      }
    }
  }
});
