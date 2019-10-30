import { get, computed } from '@ember/object';
import { readOnly, notEmpty, gt } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import sanitize from 'npm:sanitize-html';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  _maxDescriptionLength: 180,
  hideFollowers: false,

  caster: null,

  _sanitizeOutHtml(value = "") {
    const sanitizeOptions = {
      allowedTags: [],
      allowedAttributes: [],
      textFilter: (text) => {
        return this._textFilter(text);
      }
    };

    const strippedOfHTML = isPresent(value) ? sanitize(value, sanitizeOptions) : '';

    if (isPresent(value) && strippedOfHTML.length !== value.length) {
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
    const regex = new RegExp(Object.keys(allowedSpecialCharacters).join("|"), "gi");

    return text.replace(regex, function(matched){
      return allowedSpecialCharacters[matched];
    });
  },

  _descriptionIsTooLong: computed('caster.description.length', '_maxDescriptionLength', function() {
    return get(this, 'caster.description.length') > parseInt(get(this, '_maxDescriptionLength'));
  }),

  description: computed('_descriptionIsTooLong', 'caster.description', function() {
    let description = this._sanitizeOutHtml(get(this, 'caster.description'));

    if (get(this, '_descriptionIsTooLong')) {
      description = description.substr(0, get(this, '_maxDescriptionLength') - 3) + '...';
    }

    return htmlSafe(description);
  }),

  showDescription: gt('description.string.length', 0),

  showLocation: notEmpty('caster.location'),

  followerCount: readOnly('caster.activeFollowersCount'),

  showFollowers: computed('hideFollowers', 'followerCount', function() {
    const followerCount = parseInt(get(this, 'followerCount')) || 0;
    const hideFollowers = get(this, 'hideFollowers');
    return !hideFollowers && followerCount > 1;
  }),
});
