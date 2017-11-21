import Ember from 'ember';

const {get, computed, isEmpty, inject} = Ember;

export default Ember.Component.extend({
  store: inject.service(),

  customLinks: null,

  customLinksWithContent: computed('customLinks.@each.content_id', function() {
    const customLinks = get(this, 'customLinks');

    if (isEmpty(customLinks)) {
      return [];
    } else {
      const store = get(this, 'store');

      return customLinks.map(customLink => {
        return {
          title: customLink.title,
          content: store.findRecord('feed-content', customLink.content_id)
        };
      });
    }
  })
});
