import Ember from 'ember';
import PromotionForm from 'subtext-ui/mixins/components/promotion-form';

const {
  computed
} = Ember;

export default Ember.Component.extend(PromotionForm, {
  tagName: 'form',

  // Required by the promotion form mixin
  model: computed.alias('talk'),

  userLocation: Ember.computed.oneWay('session.currentUser.location'),
  listservName: Ember.computed.oneWay('session.currentUser.listservName'),
  listservId: Ember.computed.oneWay('session.currentUser.listservId'),

  listEnabled: Ember.computed.notEmpty('talk.listservId'),

  actions: {
    toggleListserv() {
      if (this.get('listEnabled')) {
        this.set('talk.listservId', null);
      } else {
        this.set('talk.listservId', this.get('listservId'));
      }
    }
  }
});
