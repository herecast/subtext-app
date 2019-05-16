import { isPresent } from '@ember/utils';

export default function computedInitials(str) {
  if (isPresent(str) && str.length > 2){
    const stopWords = ['a', 'an', 'at', 'and', 'by', 'etc', 'it', 'or', 'of', 'to', 'the'];
    const regex = new RegExp(/\b\w/g);

    //get rid of email characters
    str = str.replace(/(@)|(\.)/g, '');

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
  } else {
    return str;
  }
}
