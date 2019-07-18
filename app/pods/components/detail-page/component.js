import { reads, oneWay, readOnly} from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { set, get, computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import LaunchingContent from 'subtext-app/mixins/components/launching-content';
import ModelResetScroll from 'subtext-app/mixins/components/model-reset-scroll';
import contentComments from 'subtext-app/mixins/content-comments';
import Component from '@ember/component';

export default Component.extend(ModelResetScroll, LaunchingContent, contentComments, {
  classNames: ['DetailPage'],
  classNameBindings: ['isPreview:is-preview'],
  'data-test-component': 'detail-page',
  'data-test-content': reads('model.contentId'),
  tagName: 'main',

  fastboot: service(),
  tracking: service(),
  session: service(),

  model: null,
  isPreview: false,
  goingToEdit: false,
  onClose: null,
  trackDetailEngagement: function() {},

  contentType: readOnly('model.contentType'),
  isEvent: readOnly('model.isEvent'),
  isMarket: readOnly('model.isMarket'),
  isNews: readOnly('model.isNews'),

  init() {
    this._super(...arguments);
    set(this, '_cachedModelId', get(this, 'model.id'));
  },

  organization: readOnly('model.organization'),
  userManagedOrganizations: oneWay('session.currentUser.managedOrganizations'),

  isOwnedByOrganization: readOnly('model.isOwnedByOrganization'),

  userCanEditNews: computed('session.isAuthenticated', 'userManagedOrganizations.@each.id', 'model.organizationId', function() {
    const managedOrganizations = get(this, 'userManagedOrganizations') || [];
    return isPresent(managedOrganizations.findBy('id', String(get(this, 'model.organizationId'))));
  }),

  modelContent: computed('model.content', function() {
    return htmlSafe(get(this, 'model.content'));
  }),

  modelSplitContentHead: computed('model.splitContent.head', function() {
    return htmlSafe(get(this, 'model.splitContent.head'));
  }),

  modelSplitContentTail: computed('model.splitContent.tail', function() {
    return htmlSafe(get(this, 'model.splitContent.tail'));
  }),

  hasContentTail: computed('model.splitContent.tail', function() {
    const tail = get(this, 'model.splitContent.tail') || '';

    return tail.length > 0;
  }),

  nextInstance: computed('model.{futureInstances.[],scheduleInstances.[]}', function() {
    // this will go away with further model consolidation
    const scheduleInstances = get(this, 'model.scheduleInstances');
    const futureInstances = get(this, 'model.futureInstances') || [];

    if (scheduleInstances) {
      return scheduleInstances.sortBy('startsAt').get('lastObject');
    } else {
      return futureInstances.get('firstObject');
    }
  }),

  _trackImpression() {
    const model = get(this, 'model');

    // Necessary to check fastboot here, in case
    // didUpdateAttrs calls this from fastboot.
    if (!get(this, 'fastboot.isFastBoot') && !(get(this, 'isPreview'))) {
      get(this, 'tracking').contentImpression(model.id);
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (this._cachedModelId !== get(this, 'model.id')) {
      this._trackImpression();
      this._cachedModelId = get(this, 'model.id');
    }
  },

  didInsertElement() {
    this._super();
    this._trackImpression();
  },

  actions: {
    goingToEdit() {
      set(this, 'goingToEdit', true);
    }
  }
});
