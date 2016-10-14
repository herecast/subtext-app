import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const { get, inject } = Ember;

export default Ember.Component.extend(Validation, {
  classNames: ['AccountFormCommunity'],

  toast: inject.service(),

  // Component should be instantiated with currentUser object
  model: null,

  actions: {
    submit() {
      const toast = get(this, 'toast');
      get(this, 'model').save().then(
        () => toast.success('Successfully saved changes'),
        () => toast.error('Error: unable to save changes')
      );
    }
  }
});
