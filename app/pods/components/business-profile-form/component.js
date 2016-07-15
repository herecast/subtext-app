import Ember from 'ember';
import Validation from '../../../mixins/components/validation';

const { inject, get, set, isBlank, computed } = Ember;

export default Ember.Component.extend(Validation, {
  tagName: 'form',
  classNames: ['BusinessProfileForm'],
  showSaveMessage: false,

  // Required when component is rendered
  model: null,

  toast: inject.service(),
  store: inject.service(),

  categories: computed(function() {
    return get(this, 'store').findAll('business-category').then( categories => {
      categories.forEach(category => {

        const parent_ids = category.get('parent_ids') || [];

        if (parent_ids.length > 0) {
          const parent = categories.find( category => {
            return parseInt(category.id) === parseInt(parent_ids[0]);
          });
          category.set('fullName', `${parent.get('name')} > ${category.get('name')}`);
        } else {
          category.set('fullName', `${category.get('name')}`);
        }
      });

      return categories;
    });


  }),

  submit(e) {
    e.preventDefault();
    if (this.isValid()) {
      const isNew = get(this, 'model.isNew');
      const toast = get(this, 'toast');

      get(this, 'model').save().then(
        () => {
          if (isNew) {
            set(this, 'showSaveMessage', true);
          } else {
            toast.success('Business saved successfully!');
            this.sendAction('save');
          }
        },
        (errors) => {
          toast.error('Error: Failed to save business!');
          this.handleErrorResponse(errors);
        }
      );
    }
  },

  handleErrorResponse(/*errors*/) {
    // TODO update this.errors to reflect the API once the API error codes have been updated
  },

  validateForm() {
    this.validatePresenceOf('model.name');
    this.validatePresenceOf('model.address');
    this.validatePresenceOf('model.city');
    this.validatePresenceOf('model.state');
    this.validateEmail();
  },

  validateEmail() {
    const email = get(this, 'model.email');
    if (isBlank(email) || !this.hasValidEmail(email)) {
      set(this, 'errors.email', 'Valid email is required');
    } else {
      set(this, 'errors.email', null);
      delete get(this, 'errors')['email'];
    }
  },

  actions: {
    validateEmail() {
      this.validateEmail();
    },
    gotIt() {
      this.sendAction('save');
    }
  }
});
