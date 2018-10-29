import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  allowedExtensions: null, // String
  accept: alias('allowedExtensions'),

  validate(file) {
    const allowedExtensions = get(this, 'allowedExtensions');
    if(isPresent(allowedExtensions)) {
      const extList = allowedExtensions.split(/[,\s]+/);
      const fileNameSplit = file.name.split('.');
      const fileExt = fileNameSplit[fileNameSplit.length - 1];

      if(isPresent(fileExt)) {
        if(extList.includes(`.${fileExt.toLowerCase()}`)) {
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
    const fileError = get(this, 'fileError');
    if(isPresent(fileError)) {
      const allowedExtensions = get(this, 'allowedExtensions');
      const errMsg = `Only files with these extensions: ${allowedExtensions} are allowed.`;
      fileError(errMsg);
    }
  },

  actions: {
    didSelectFiles(event) {
      const files = event.target.files;
  
      if (this.allAreValid(files)) {
        const action = get(this, 'action');
        if (action) {
          action(files);
        }
      } else {
        this.triggerError();
      }
    }
  }
});
