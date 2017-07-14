import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const { get, set, computed, isPresent, inject:{service} } = Ember;

export default Ember.Component.extend(Validation, {
  classNames: 'BizFeed-AddToMenu',

  content: null,
  organization: null,
  contentIsHotlink: false,
  inputValue: null,

  inputPlaceholder: 'Short Title',

  store: service(),

  validateForm() {
    this.validatePresenceOf('inputValue');
  },

  _saveHotlink(linkObject) {
    //NOTE: Setup for multiple links, but here limiting to only one
    const organization = get(this, 'organization');
    const linkArray = isPresent(linkObject) ? [linkObject] : [];

    set(organization, 'customLinks', linkArray);

    const organizationModel = get(this, 'store').peekRecord('organization', get(organization, 'id'));

    return organizationModel.save();
  },

  contentId: computed('content.{contentType,contentId,eventInstanceId}', function() {
    return get(this, 'content.contentType') === 'event' ? get(this, 'content.eventInstanceId') : get(this, 'content.contentId');
  }),

  actions: {
    saveHotlink() {
      if (this.isValid()) {
        const customLink = {
          title: get(this, 'inputValue'),
          content_id: get(this, 'contentId'),
          content_type: get(this, 'content.contentType')
        };

        this._saveHotlink(customLink).then(() => {
          this.sendAction('done');
        });
      } else {
        set(this, 'inputPlaceholder', 'Please enter a short title');
      }
    },

    removeHotlink() {
      const customLink = null;

      this._saveHotlink(customLink).then(() => {
        this.sendAction('done');
      });
    },

    cancelHotlink() {
      set(this, 'inputValue', get(this, 'originalHotlinkTitle'));
      this.sendAction('done');
    }
  }
});
