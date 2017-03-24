import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryResults-sort'],
  sortBy: null,
  sortOptions: [
    {label: "Best Score", value: 'score_desc'},
    {label: "Closest", value: 'distance_asc'},
    {label: "Most Rated", value: 'rated_desc'},
    {label: "A to Z", value: 'alpha_asc'}
  ],

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
