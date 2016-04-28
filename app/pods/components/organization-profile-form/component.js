import Ember from 'ember';
import Validation from '../../../mixins/components/validation';

const { get, set, isPresent } = Ember;

export default Ember.Component.extend(Validation, {
  tagName: 'form',

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

  save() {
    if(this.isValid()) {
      const model = get(this, 'model');
      model.save().then(()=>{
        if(isPresent(model.get('logo'))) {
          model.uploadLogo().then(()=>{
            this.notifySaved();
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
    }
  }
});
