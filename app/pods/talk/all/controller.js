import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const {
  get,
  inject
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  modals: inject.service(),
  secondaryBackground: true,

  queryParams: ['query', 'page', 'per_page'],

  page: 1,
  per_page: 24,

  defaultQuery: 'Everything',
  query: 'Everything',

  actions: {
    signIn() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in').then(()=> {
        this.send('didAuthenticate');
      });
    }
  }
});
