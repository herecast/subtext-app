/* global Sanitize */
/* global jQuery */
function fixBadLists(content) {
  // This filter is to fix <ul><ul><li></li></ul></ul>
  // pastes.  This can happen from google docs.
  // The editor doesn't understand them, 
  // and it makes it hard to undo the formatting.
  let $content = jQuery(content).clone();
  $content.find('ul > ul').wrap('<li>');
  $content.find('ol > ol').wrap('<li>');
  return $content[0];
}

export function sanitizeContent(rawContent) {
  // TODO TDD actual Sanitizer config
  const s = new Sanitize({
    elements: ['a', 'p', 'ul', 'ol', 'li', 'b', 'i', 'blockquote', 'pre', 'div',
               'h1','h2', 'h3', 'h4', 'h5', 'h6', 'img', 'iframe', 'br'],
    attributes: {
     a: ['href', 'title', 'target'],
     div: ['class'],
     span: ['style'],
     img: ['src', 'style', 'title','alt','class'],
     iframe: ['width', 'height', 'frameborder', 'src', 'class'] // youtube
    },
    protocols:  {
      a: { href: ['http', 'https', 'mailto'] }
    },
    add_attributes: {
      a: { rel: 'nofollow' },
      img: { class: 'img-responsive' }
      // iframe: {} // TODO responsive video embed classes
    }
  });
  
  return fixBadLists( s.clean_node(rawContent) );
}
