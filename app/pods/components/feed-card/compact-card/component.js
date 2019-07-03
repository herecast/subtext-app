import { notEmpty, readOnly } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedCard', 'FeedCard-CompactCard'],
  'data-test-compact-card': readOnly('model.title'),
  
  model: null,

  hasImage: notEmpty('model.primaryImageUrl'),
});
