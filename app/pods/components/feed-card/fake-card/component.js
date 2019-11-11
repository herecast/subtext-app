import { equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedCard', 'FeedCard-FakeCard'],

  cardSize: null,

  isMidsize: equal('cardSize', 'midsize'),
  isCompact: equal('cardSize', 'compact')
});
