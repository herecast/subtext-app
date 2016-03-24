import Ember from 'ember';

const {
  computed,
  get,
  isEmpty
} = Ember;

export default Ember.Component.extend({
  classNames: ['PaginationButtons'],

  resultCount: computed('results.[]', function() {
    return get(this, 'results.length');
  }),

  showPrevPage: computed('page', function(){
    const page = get(this, 'page');

    return (parseInt(page)) > 1;
  }),

  showNextPage: computed('resultCount', 'perPage', 'total', 'page', function(){
    const resultCount = get(this, 'resultCount');
    const perPage = get(this, 'perPage');
    const page = get(this, 'page');
    const total = get(this, 'total');

    if (isEmpty(total)) {
      return resultCount >= perPage;
    } else {
      return (perPage * page) < total;
    }
  }),

  actions: {
    prevPage: function() {
      const page = get(this, 'page');

      this.attrs['on-update-page'](page - 1);
    },

    firstPage: function() {
      this.attrs['on-update-page'](1);
    },

    nextPage: function() {
      const page = get(this, 'page');

      this.attrs['on-update-page'](page + 1);
    }
  }
});
