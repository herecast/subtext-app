import Ember from 'ember';

const {get, computed} = Ember;

export default Ember.Component.extend({
  classNames: ['SmallCard'],

  routeName: computed('item.contentType', function() {
    let routeName = get(this, 'item.contentType');

    if (routeName === 'event-instance') {
      routeName = 'events';
    } else if (routeName === 'market-post') {
      routeName = 'market';
    }

    return `${routeName}.show`;
  })
});
