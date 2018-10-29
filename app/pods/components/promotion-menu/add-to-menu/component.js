import Component from '@ember/component';
import { isPresent, isBlank } from '@ember/utils';
import { setProperties, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import Validation from 'subtext-ui/mixins/components/validation';
/* eslint-disable ember/closure-actions */

export default Component.extend(Validation, {
  classNames: 'PromotionMenu-AddToMenu',

  content: null,
  organization: null,
  contentHotlink: null,
  inputValue: null,

  inputPlaceholder: 'Short Title',

  store: service(),
  notify: service('notification-messages'),

  validateForm() {
    this.validatePresenceOf('inputValue');
  },

  _saveHotlink(linkObject) {
    const organization = get(this, 'organization');
    let customLinks = get(organization, 'customLinks');

    if (isBlank(customLinks)) {
      customLinks = [];
    }

    const existingLinkObject = customLinks.findBy('contentId', linkObject.contentId);

    if (isPresent(existingLinkObject)) {
      setProperties(existingLinkObject, linkObject);
    } else {
      customLinks.push(linkObject);
    }

    set(organization, 'customLinks', customLinks);

    return organization.save();
  },

  _removeHotlink() {
    const organization = get(this, 'organization');
    let customLinks = get(organization, 'customLinks');

    if (isBlank(customLinks)) {
      customLinks = [];
    }

    customLinks = customLinks.rejectBy('contentId', get(this, 'content.contentId'));

    set(organization, 'customLinks', customLinks);

    return organization.save();
  },

  actions: {
    saveHotlink() {
      if (this.isValid()) {
        const customLink = {
          title: get(this, 'inputValue'),
          contentId: get(this, 'content.contentId'),
          contentType: get(this, 'content.contentType'),
          eventInstanceId: get(this, 'content.eventInstanceId')
        };
        const notify = get(this, 'notify');

        this._saveHotlink(customLink).then(() => {
          notify.success('Menu button saved');
          this.sendAction('done');
        }).catch(
          () => notify.error('Unable to save menu button. Please try again.')
        );
      } else {
        set(this, 'inputPlaceholder', 'Please enter a short title');
      }
    },

    removeHotlink() {
      const notify = get(this, 'notify');

      this._removeHotlink().then(() => {
        notify.success('Menu button removed');
        this.sendAction('done');
      }).catch(
        () => notify.error('Unable to remove menu button. Please try again.')
      );
    },

    cancelHotlink() {
      set(this, 'inputValue', get(this, 'originalHotlinkTitle'));
      this.sendAction('done');
    }
  }
});
