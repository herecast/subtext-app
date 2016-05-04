import Ember from 'ember';
import Validation from '../../../mixins/components/validation';

const { get, set, isPresent, isBlank, computed } = Ember;

export default Ember.Component.extend(Validation, {
  tagName: 'form',

  _originalImageUrl: computed.oneWay('model.logoUrl'),

  submit(e) {
    e.preventDefault();
    this.save();
  },

  validateForm() {
    this.validatePresenceOf('model.name');
    this.validateImage('logo');
  },

  notifySaved() {
    if(this.attrs.didSave) {
      this.attrs.didSave(get(this, 'model'));
    }
  },

  imageFormVisible: false,

  displayImageForm: computed('model.logoUrl', 'imageFormVisible', function() {
    return get(this, 'imageFormVisible') || isBlank(get(this, 'model.logoUrl'));
  }),

  save() {
    if(this.isValid()) {
      const model = get(this, 'model');
      model.save().then(()=>{
        if(isPresent(model.get('logo'))) {
          model.uploadLogo().then(()=>{

            // Reload to update the logoUrl - one is not provided in the uploadLogo response
            model.reload().then(() => {
              this.notifySaved();
            });

          });
        } else {
          this.notifySaved();
        }
      }, (/*errors*/) => { });
    }
  },

  actions: {
    save() {
      this.save();
    },
    updateContent(content) {
      set(this, 'model.description', content);
    },
    showImageForm() {
      set(this, 'imageFormVisible', true);
    }
  }
});
