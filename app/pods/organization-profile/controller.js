import Ember from 'ember';

const {
  computed,
  get,
  set,
  isPresent
} = Ember;

export default Ember.Controller.extend({
  queryParams: ['query', 'page'],
  page: 1,
  perPage: 8,
  query: "",
  totalCount: computed.oneWay('news.content.meta.total'),

  showAboutSection: computed('model.logoUrl', 'model.description', function(){
    const logo = get(this, 'model.logoUrl');
    const description = get(this, 'model.description');
    return isPresent(logo) || isPresent(description);
  }),
  
  showMoreContent: computed('moreContent.[]', 'query', function() {
    return get(this, 'moreContent.length') || get(this, 'query.length');
  }),

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
  }),

  actions: {
    updateQuery(q) {
      if(q.length > 2) {
        set(this, 'query', q);
      } else {
        set(this, 'query', "");
      }
      set(this, 'page', 1);
    },

    editProfile() {
      set(this, 'editMode', true);
    },

    cancelEdit() {
      if(get('model.hasDirtyAttributes')) {
        if(confirm('You have unsaved changes. Cancel editing?')) {
          set(this, 'editMode', false);
        }
      } else {
      set(this, 'editMode', false);
      }
    },

    closeModal() {
      set(this, 'editMode', false);
    }
  }
});
