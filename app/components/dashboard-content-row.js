import Ember from 'ember';
import moment from 'moment';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { computed, get } = Ember;

export default Ember.Component.extend(TrackEvent, {
  tagName: ['tr'],
  type: '',

  isTalkOrComment: computed('type', function() {
    let type = get(this, 'type');
    return type === 'talk' || type === 'comment';
  }),

  hasTitle: computed.notEmpty('content.title'),

  contentType: computed(function() {
    const type = get(this, 'type') || '';

    if (type === 'market-post') {
      return 'Market';
    } else if (type === 'event-instance') {
      return 'Event';
    } else if (type === 'promotion-banner') {
      return 'Ad';
    } else if (type === 'comment') {
      return 'Talk';
    } else {
      return type.capitalize();
    }
  }),

  publishedAt: computed(function() {
    const date = get(this, 'content.publishedAt');
    const momentDate = (moment.isMoment(date)) ? date : moment(date);

    return (date) ? momentDate.format('l') : null;
  }),

  isEditable: computed(function() {
    const type = get(this, 'type');

    return type === 'market-post' || type === 'event-instance' || type === 'news';
  }),

  parentRoute: computed(function() {
    const type = get(this, 'type');

    if (type === 'market-post') {
      return 'market';
    } else if (type === 'event-instance') {
      return 'events';
    } else if (type === 'comment') {
      //have to convert based on parent type
      let parentContentType = get(this, 'content.parentContentType');
      if (parentContentType !== 'event-instance'){
        return parentContentType;
      } else {
        return 'events';
      }
    } else {
      return type;
    }
  }),

  parentContentId: computed('content.parentContentId','content.parentContentType', function() {
    if (get(this, 'content.parentContentType') === 'event' || get(this, 'content.parentContentType') === 'event-instance') {
      return get(this, 'content.parentEventInstanceId');
    } else {
      return get(this, 'content.parentContentId');
    }
  }),

  parentOrSelfId: computed('parentContentId','content.id',function() {
    if(get(this,'parentContentId')) {
      return get(this,'parentContentId');
    } else {
      return get(this,'content.id');
    }
  }),

  viewId: computed('isTalkOrComment', 'content.id', 'parentOrSelfId', function() {
    if( get(this,'isTalkOrComment') ){
      return get(this,'parentOrSelfId');
    } else {
      return get(this,'content.id');
    }
  }),

  viewRoute: computed(function() {
    return `${get(this, 'parentRoute')}.show`;
  }),

  contentAnchor: computed(function() {
    if(get(this,'isTalkOrComment')){
      return `comment-${this.get('content.id')}`;
    }else{
      return get(this, 'content.contentAnchor');
    }
  }),

  editRoute: computed(function() {
    return `${get(this, 'parentRoute')}.edit`;
  }),

  editId: computed(function() {
    const type = get(this, 'type');

    if (type === 'event-instance') {
      return get(this, 'content.eventId');
    } else {
      return get(this, 'content.id');
    }
  }),

  _getTrackingArguments(navControlText) {
    return {
      navControlGroup: 'Dashboard',
      navControl: navControlText
    };
  }
});
