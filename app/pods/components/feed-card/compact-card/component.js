import { notEmpty, readOnly } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedCard', 'FeedCard-CompactCard'],
  classNameBindings: ['hideCompletely:hide-completely'],
  'data-test-compact-card': readOnly('model.title'),

  model: null,
  hideCompletely: false,

  hasImage: notEmpty('model.primaryImageUrl'),
});
