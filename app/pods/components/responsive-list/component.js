import Ember from 'ember';
import {chunk} from 'lodash';

const {get, computed} = Ember;

/**
 * Lists items into columns based on the size of the user's viewport
 */
export default Ember.Component.extend({
  classNames: ['row'],
  items: [],
  groupedItems: computed('items.[]', 'media.isMobile', 'media.isTablet', function () {
    const items = get(this, 'items');
    let columns;

    if (get(this, 'media.isMobile')) {
      columns = 2;
    } else if (get(this, 'media.isTablet')) {
      columns = 3;
    } else {
      columns = 4;
    }

    return chunk(items, Math.ceil(items.length / columns));
  }),
});
