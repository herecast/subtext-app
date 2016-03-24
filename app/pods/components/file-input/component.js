import Ember from 'ember';

const {
  get,
  computed,
  isPresent
} = Ember;

export default Ember.Component.extend({
  allowedExtensions: null, // String
  accept: computed.alias('allowedExtensions'),

  validate(file) {
    const allowedExtensions = get(this, 'allowedExtensions');
    if(isPresent(allowedExtensions)) {
      const extList = allowedExtensions.split(/[,\s]+/);
      const fileNameSplit = file.name.split('.');
      const fileExt = fileNameSplit[fileNameSplit.length - 1];

      if(isPresent(fileExt)) {
        if(extList.contains(`.${fileExt.toLowerCase()}`)) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  },

  allAreValid(files) {
    // We can't use Array.every because FileList doesn't implement it.
    var isValid = false;
    for(var i = 0; i < files.length; i++) {
      isValid = this.validate(files.item(i));
    }
    return isValid;
  },

  triggerError() {
    if( isPresent(this.attrs['fileError']) ) {
      const allowedExtensions = get(this, 'allowedExtensions');
      const errMsg = `Only files with these extensions: ${allowedExtensions} are allowed.`;
      this.attrs.fileError(errMsg);
    }
  },

  actions: {
    didSelectFiles(files) {
      if(this.allAreValid(files)) {
        this.attrs.action(files);
      } else {
        this.triggerError();
      }
    }
  }
});
