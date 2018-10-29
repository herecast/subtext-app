import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';

const sortOptionsArray = [
  {label: "Best Score", value: 'score_desc'},
  {label: "Closest", value: 'distance_asc'},
  {label: "Most Rated", value: 'rated_desc'},
  {label: "A to Z", value: 'alpha_asc'}
];

export default Component.extend({
  classNames: ['DirectoryResults-sort'],

  init() {
    this._super(...arguments);
    setProperties(this, {
      sortBy: null,
      sortOptions: sortOptionsArray
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'sortBy', get(this, 'sortBy'));
  },

  actions: {
    changeSort(val) {
      const onSortChange = get(this, 'onSortChange');
      if (onSortChange) {
        onSortChange(val);
      }
    }
  }
});
