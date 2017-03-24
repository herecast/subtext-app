import Ember from 'ember';

export default function computedInitials(str) {
  if (Ember.isPresent(str)){
    const stopWords = ['a', 'an', 'at', 'and', 'by', 'etc', 'it', 'or', 'of', 'to', 'the'];
    const regex = new RegExp(/\b\w/g);

    //get rid of email characters
    str = str.replace(/(\@)|(\.)/g, '');

    let initials = str.match(regex) || [];
    let numberOfInitials = initials.length;

    if (numberOfInitials > 2) {
      let strWords = str.split(' ');

      let name = strWords.reduce((preVal,item) => {
        if ( !stopWords.includes(item.toLowerCase()) ) {
          preVal += ` ${item}`;
        }
        return preVal;
      }, '');

      initials = name.match(regex) || [];
    }

    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  }
}
