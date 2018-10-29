import { helper as buildHelper } from '@ember/component/helper';
import { isEmpty } from '@ember/utils';
import cheerio from 'npm:cheerio';

export function isBlankOrEmptyHtmlTags(params) {
  var blank = isEmpty( params[0] );

  if( !blank ) {
    //params is the string, typically wrapped in <p></p> tags so never empty
    //check to see if wrapped
    let children = cheerio("<div>" + params[0] + "</div>").children();
    //if no wraps, is the content there?
    if( children.length <= 0 && params[0].length > 0 ) {
       return false;
     } else {
       blank = true;
     }
    //if children exist, we need to make sure at least one is non empty
    var inside;

    children.each(function(i, el){
      inside = cheerio(el).text();
      if(inside.length > 0) {
        blank = false;
        return;//out of each loop only
      }
    });
  }

  return blank;
}

export default buildHelper(isBlankOrEmptyHtmlTags);
