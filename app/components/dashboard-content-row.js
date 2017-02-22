import Ember from 'ember';
import moment from 'moment';

const { computed, get } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-content-item'],
  'data-test-content-item': computed.reads('content.id'),
  classNameBindings: ["highlightRow:highlight"],
  tagName: ['tr'],
  type: '',

  highlightRow: computed('highlightContent', 'content.contentId', function() {
    return get(this, 'content.contentId').toString() === get(this, 'highlightContent').toString();
  }),

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

  newsDateStatus: computed('content.publishedAt', 'content{isDraft,isScheduled,isPublished}', function() {
    const content = get(this, 'content'),
          isNews  = get(this, 'type') === 'news';
    let dateStatus;

    if (isNews) {
      if (get(content, 'isDraft')) {
        dateStatus = `Draft last updated ${get(this, 'updatedAt')}`;
      } else if (get(content, 'isScheduled')) {
        dateStatus = `Scheduled to go live ${get(this, 'publishedAt')}`;
      } else if (get(content, 'isPublished')) {
        dateStatus = `Publish date ${get(this, 'publishedAt')}`;
      }
    }

    return dateStatus;
  }),

  updatedAt: computed(function() {
    const date = get(this, 'content.updatedAt');
    const momentDate = (moment.isMoment(date)) ? date : moment(date);

    return (date) ? momentDate.format('l') : null;
  }),

  publishedAt: computed(function() {
    const date = get(this, 'content.publishedAt');
    const momentDate = (moment.isMoment(date)) ? date : moment(date);

    return (date) ? momentDate.format('l') : null;
  }),

  timeSincePublished: computed(function(){
    const date = get(this, 'content.publishedAt');
    const momentDate = (moment.isMoment(date)) ? date : moment-from-now(date);
    
    const daysSincePublished = moment().diff(date, 'days')


    if (daysSincePublished >= 1) {
      return(date) ? momentDate.format('l') : null;
    } else {
      return (date) ? momentDate.fromNow() : null;
    }
  }),

  isEditable: computed('type', 'content.publishedAt', function() {
    const type = get(this, 'type');

    if (type === 'event-instance') {
      const publishedAtDate = get(this, 'content.publishedAt');
      return (publishedAtDate && moment(publishedAtDate).isAfter('2015-12-18'));
    }

    return type === 'market-post' || type === 'news';
  }),

  isDeletable: computed(function() {
    const isNews  = get(this, 'type') === 'news',
          isDraft = get(this, 'content.isDraft');

    return isNews && isDraft;
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
    const parentRoute = get(this, 'parentRoute');
    if (parentRoute === 'directory') {
      return 'directory.show';
    } else {
      return `${parentRoute}.all.show`;
    }
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
  })
});
