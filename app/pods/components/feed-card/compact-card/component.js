import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedCard', 'FeedCard-CompactCard'],

  model: null,

  hasImage: notEmpty('model.primaryImageUrl'),
});
