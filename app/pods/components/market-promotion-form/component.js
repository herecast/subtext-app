import Ember from 'ember';
import PromotionForm from 'subtext-ui/mixins/components/promotion-form';

const {
  computed,
  observer,
  on,
  get
} = Ember;

export default Ember.Component.extend(PromotionForm, {
  tagName: 'form',

  // Required by the promotion form mixin
  model: computed.alias('post'),

  currentUserListserv: computed('session.currentUser.listservId', 'session.currentUser.listservName', function() {
    return {
      id: get(this, 'session.currentUser.listservId'),
      name: get(this, 'session.currentUser.listservName')
    };
  }),

  displayListservs: on('didInsertElement', function() {
    if (Ember.isPresent(this.get('post.listservIds'))) {
      this.set('listsEnabled', true);
    }
  }),

  // When the user unchecks the button to add listservs, reset the array
  // so that we don't subscribe them to a list without their knowledge.
  resetListservs: observer('listsEnabled', function() {
    if (!this.get('listsEnabled')) {
      this.set('post.listservIds', []);
    }
  }),
});
