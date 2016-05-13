import Ember from 'ember';
import PromotionForm from 'subtext-ui/mixins/components/promotion-form';

const {
  computed,
  observer,
  on,
  isPresent,
  get,
  set
} = Ember;

export default Ember.Component.extend(PromotionForm, {
  tagName: 'form',

  // Required by the promotion form mixin
  model: computed.alias('post'),

  listServAvailable: computed('post.myTownOnly', 'currentUserListserv.id', function() {
    // If My Town Only is selected, we can only choose a listserv if one is available on the currentUser
    if (get(this, 'post.myTownOnly')) {
      return isPresent(get(this, 'currentUserListserv.id'));
    } else {
      return true;
    }
  }),

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

  actions: {
    toggleMyTownOnly: function() {
      let myTownOnly = get(this, 'post.myTownOnly');

      // If enabling My Town Only, we need to clear the listservs if any
      if (! myTownOnly) {
        set(this, 'post.listservIds', []);
      }

      set(this, 'post.myTownOnly', ! myTownOnly);
    }
  }
});
