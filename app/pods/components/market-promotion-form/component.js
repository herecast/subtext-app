import { alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';
import { observer } from '@ember/object';
import PromotionForm from 'subtext-ui/mixins/components/promotion-form';

export default Component.extend(PromotionForm, {
  tagName: 'form',

  // Required by the promotion form mixin
  model: alias('post'),

  didInsertElement() {
    this._super(...arguments);
    if (isPresent(this.get('post.listservIds'))) {
      this.set('listsEnabled', true);
    }
  },

  // When the user unchecks the button to add listservs, reset the array
  // so that we don't subscribe them to a list without their knowledge.
  resetListservs: observer('listsEnabled', function() {
    if (!this.get('listsEnabled')) {
      this.set('post.listservIds', []);
    }
  }),
});
