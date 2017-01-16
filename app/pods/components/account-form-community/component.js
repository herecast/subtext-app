import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const { get, inject } = Ember;

export default Ember.Component.extend(Validation, {
  classNames: ['AccountFormCommunity'],

  notify: inject.service('notification-messages'),

  // Component should be instantiated with currentUser object
  model: null,

  actions: {
    setLocation(id, name) {
      if(location) {
        this.get('model').setProperties({
          locationId:  id,
          location: name
        });
        const notify = get(this, 'notify');
        get(this, 'model').save().then(
          () => {
            notify.success('Successfully saved changes');
          },
          () => notify.error('Error: unable to save changes')
        );
      }
    }
  }
});
