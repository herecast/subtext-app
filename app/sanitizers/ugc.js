/** Uses options found here:
 * https://www.npmjs.com/package/sanitize-html
 * https://github.com/punkave/sanitize-html
 */
import sanitize from 'npm:sanitize-html';

export default {
  allowedTags: ['a', 'span', 'p', 'ul', 'ol', 'li', 'b', 'i', 'blockquote', 'pre', 'div',
             'h1','h2', 'h3', 'h4', 'h5', 'h6', 'img', 'iframe', 'br'],

  allowedAttributes: {
    a: ['href', 'title', 'target'],
    div: ['class', 'style'],
    span: ['style'],
    img: ['src', 'style', 'title','alt','class'],
    iframe: ['width', 'height', 'frameborder', 'src', 'class'] // youtube
  },

  allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],

  nonTextTags: [ 'style', 'script', 'textarea', 'noscript' ],

  transformTags: {
    a: sanitize.simpleTransform('a', {rel: 'nofollow'}),
    img: sanitize.simpleTransform('img', {"class": 'img-responsive'})
  }
};
