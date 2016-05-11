import Ember from 'ember';
import PromotionForm from 'subtext-ui/mixins/components/promotion-form';

const {
  computed,
  on,
  observer
} = Ember;

export default Ember.Component.extend(PromotionForm, {
  tagName: 'form',
  category: computed.oneWay('event.category'),

  // Required by the promotion form mixin
  model: computed.alias('event'),

  categoryEnabled: computed.notEmpty('event.category'),

  displayListservs: on('didInsertElement', function() {
    if (Ember.isPresent(this.get('event.listservIds'))) {
      this.set('listsEnabled', true);
    }
  }),

  // When the user unchecks the button to add listservs, reset the array
  // so that we don't subscribe them to a list without their knowledge.
  resetListservs: observer('listsEnabled', function() {
    if (!this.get('listsEnabled')) {
      this.set('event.listservIds', []);
    }
  }),

  categories: [
    {value: 'Arts', label: 'Arts'},
    {value: 'Live Music', label: 'Live Music'},
    {value: 'Movies', label: 'Movies'},
    {value: 'Wellness', label: 'Wellness'},
  ],

  actions: {
    toggleEventProperty(property) {
      this.get('event').toggleProperty(property);
    }
  }
});
