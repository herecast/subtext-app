import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  foo: 'bar',
  moreContent: computed('model.id', function() {
    const organizationId = get(this, 'model.id');
    return this.store.query('news', {
      organization_id: organizationId,
      page: 1,
      per_page: 6
    });
  })
});
