import Ember from 'ember';

const {
  computed,
  get,
  isPresent
} = Ember;

export default Ember.Controller.extend({
  page: 1,
  perPage: 8,
  query: null,
  totalCount: computed.oneWay('news.content.meta.total'),

  news: computed('model.id', 'page', 'perPage', 'query', function() {
    const organizationId = get(this, 'model.id');
    const page = get(this, 'page');
    const perPage = get(this, 'perPage');
    const query = get(this, 'query');

    return this.store.query('news', {
      organization_id: organizationId,
      page: page,
      per_page: perPage,
      query: query
    });
  }),

  featuredNews: computed('news.[]', 'page', 'query', function() {
    const page = get(this, 'page');
    const query = get(this, 'query');
    if(isPresent(query) || page > 1) {
      return null;
    } else {
      const news = get(this, 'news');
      return news.slice(0,2);
    }
  }),

  moreContent: computed('news.[]', 'page', 'query', function() {
    const news = get(this, 'news');
    const page = get(this, 'page');
    const query = get(this, 'query');

    if(isPresent(query) || page > 1) {
      return news;
    } else {
      return news.slice(2);
    }
  })
});
