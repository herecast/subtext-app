/* global DOMStringList*/
import Ember from 'ember';

const {RSVP, $, run} = Ember;

export default function absorbPasteEvent(e) {
  return new RSVP.Promise((resolve) => {
    // See: https://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser/6804718#6804718
    // Browsers that support the 'text/html' type in the Clipboard API (Chrome, Firefox 22+)
    if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) {

      // Check for 'text/html' in types list. We cannot fall back to 'text/plain' as
      // Safari/Edge don't advertise HTML data even if it is available
      const types = e.clipboardData.types;
      if (((types instanceof DOMStringList) && types.contains("text/html")) || (types.indexOf && types.indexOf('text/html') !== -1)) {

        // Extract data and pass it to callback
        const pastedData = e.clipboardData.getData('text/html');

        // Stop the data from actually being pasted
        e.stopPropagation();
        e.preventDefault();

        resolve(pastedData);
      } else {
        redirectPasteEvent(resolve);
      }
    } else {
      redirectPasteEvent(resolve);
    }
  });
}

export function redirectPasteEvent(resolve) {
  const $pasteTarget = $('<div contenteditable="true" />')
    .css({
      position: "fixed",
      opacity: 0
    })
    .appendTo(document.body)
    .focus();

  run.later(() => {
    resolve($pasteTarget.html());
    $pasteTarget.remove();
  }, 50);
}
