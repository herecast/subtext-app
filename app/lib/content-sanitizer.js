/* global Sanitize */

export function sanitizeContent(rawContent) {
  // TODO TDD actual Sanitizer config
  const s = new Sanitize({
    elements: ['a', 'p', 'ul', 'ol', 'li', 'b', 'i',
               'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'iframe'],
    attributes: {
     a: ['href', 'title', 'target'],
     img: ['src', 'style'],
     iframe: ['width', 'height', 'frameborder', 'src', 'class'] // youtube
    },
    protocols:  {
      a: { href: ['http', 'https', 'mailto'] }
    },
    add_attributes: {
      a: { rel: 'nofollow' }
      // iframe: {} // TODO responsive video embed classes
    }
  });

  return s.clean_node(rawContent);
}
