import Ember from 'ember';

const {get, computed} = Ember;

export default Ember.Component.extend({
  classNames: ['ListservForm'],

  type: null,

  headingText: computed('type', function() {
    const typeData = {
      subscribe: '',
      unsubscribe: 'Unsubscribe from Digest',
      manage: 'Manage your Subscription',
      enhance: 'Enhance your post'
    };

    return typeData[get(this, 'type')];
  })
});
