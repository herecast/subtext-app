import Ember from 'ember';

const { set } = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryResultsSort'],
  _sortBy: null,
  sortOptions: [
    {label: "Best Score", value: 'score_desc'},
    {label: "Closest", value: 'distance_asc'},
    {label: "Most Rated", value: 'rated_desc'},
    {label: "A to Z", value: 'alpha_asc'},
    {label: "Z to A", value: 'alpha_desc'}
  ],

  didReceiveAttrs() {
    const sortBy = (this.attrs.sortBy ? this.attrs.sortBy.value : null);

    set(this, 'sortBy', sortBy);
  },

  actions: {
    changeSort(val) {
      this.attrs['on-update'](val);
    }
  }
});
