import { get, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import sanitize from 'npm:sanitize-html';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  organization: null,
  _maxOrganizationDescriptionLength: 180,
  hideSubscribers: false,

  _sanitizeOutHtml(value="") {
    const sanitizeOptions = {
      allowedTags: [],
      allowedAttributes: [],
      textFilter: (text) => {
        return this._textFilter(text);
      }
    };

    const strippedOfHTML = isPresent(value) ? sanitize(value, sanitizeOptions) : '';

    if (strippedOfHTML.length !== value.length) {
      return strippedOfHTML.trim();
    }

    return strippedOfHTML;
  },

  _textFilter(text) {
    const allowedSpecialCharacters = {
       "&quot;": '"',
       "&amp;": '&',
       "&lt;": '<',
       "&gt;": '>'
    };
    const regex = new RegExp(Object.keys(allowedSpecialCharacters).join("|"),"gi");

    return text.replace(regex, function(matched){
      return allowedSpecialCharacters[matched];
    });
  },

  organizationDescriptionIsTooLong: computed('organization.description.length', '_maxOrganizationDescriptionLength', function() {
    return get(this, 'organization.description.length') > parseInt(get(this, '_maxOrganizationDescriptionLength'));
  }),

  organizationDescription: computed('organizationDescriptionIsTooLong', 'organization.description', function() {
    let description = this._sanitizeOutHtml(get(this, 'organization.description'));

    if (get(this, 'organizationDescriptionIsTooLong')) {
      description = description.substr(0, get(this, '_maxOrganizationDescriptionLength')-3) + '...';
    }

    return htmlSafe(description);
  }),

  showLocation: computed('organization.{city,state}', function() {
    return isPresent(get(this, 'organization.city')) && isPresent(get(this, 'organization.state'));
  }),

  subscriberCount: readOnly('organization.activeSubscriberCount'),

  showSubscribers: computed('hideSubscribers', 'subscriberCount', function() {
    const subscriberCount = parseInt(get(this, 'subscriberCount')) || 0;
    const hideSubscribers = get(this, 'hideSubscribers');
    return !hideSubscribers && subscriberCount > 1;
  }),
});
