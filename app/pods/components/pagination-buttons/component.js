import Ember from 'ember';

const {
  computed,
  get
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

  showNextPage: computed('resultCount', 'perPage', function(){
    const resultCount = get(this, 'resultCount');
    const perPage = get(this, 'perPage');

    return resultCount >= perPage;
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
