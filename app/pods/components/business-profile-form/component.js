import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { set, get } from '@ember/object';
import { isBlank } from '@ember/utils';
import Validation from '../../../mixins/components/validation';
/*eslint-disable ember/closure-actions*/

export default Component.extend(Validation, {
  tagName: 'form',
  classNames: ['BusinessProfileForm'],
  showSaveMessage: false,
  isNewBusiness: false,

  model: null,
  categories: null,
  closeAction: null,

  notify: service('notification-messages'),
  store: service(),

  init() {
    this._super();
    let model = get(this, 'model');

    if (isBlank(model)) {
      this.setProperties({
        model: get(this, 'store').createRecord('business-profile'),
        isNewBusiness: true
      });
    }

    if (isBlank(get(this, 'categories'))) {
      set(this,'categories', this.getCategories());
    }
  },

  getCategories() {
    return get(this, 'store').findAll('business-category').then( categories => {
      if (!get(this, 'isDestroying')) {
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
      }
    });
  },

  submit(e) {
    e.preventDefault();
    if (this.isValid()) {
      const isNew = get(this, 'model.isNew');
      const notify = get(this, 'notify');

      get(this, 'model').save().then(
        () => {
          if (isNew) {
            set(this, 'showSaveMessage', true);
          } else {
            notify.success('Business saved successfully!');
            this.sendAction('save');
          }
        },
        (errors) => {
          notify.error('Error: Failed to save business!');
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

    cancelBusinessProfileForm() {
      if (get(this, 'model.hasDirtyAttributes') && get(this, 'isNewBusiness')) {
        if (confirm('Are you sure you want to discard your changes without saving?')) {
          get(this, 'model').destroyRecord();
          this.sendAction('closeAction');
        }
      } else {
        this.sendAction('closeAction');
      }
    },

    gotIt() {
      this.sendAction('closeAction');
    }
  }
});
