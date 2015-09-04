import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

export default Ember.Controller.extend(PaginatedFilter, {
  queryParams: ['page', 'per_page', 'sort'],

  page: 1,
  per_page: 8,
  sort: 'pubdate DESC',

  showPasswordForm: false,
  actions: {
    submit() {
      this.get('currentUser.content').save();
    },
    togglePasswordForm() {
      this.toggleProperty('showPasswordForm');
    }
  }
});
