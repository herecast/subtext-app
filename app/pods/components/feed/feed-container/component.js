import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedContainer'],
  classNameBindings: ['noMargin:FeedContainer-no-margin'],
  'data-test-component': 'feed-container',

  noMargin: false
});
