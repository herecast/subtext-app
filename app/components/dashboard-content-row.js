import Ember from 'ember';
import moment from 'moment';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { computed, get } = Ember;

export default Ember.Component.extend(TrackEvent, {
  tagName: ['tr'],
  type: '',

  isTalk: computed.equal('type', 'talk'),

  contentType: computed(function() {
    const type = get(this, 'type') || '';

    if (type === 'market-post') {
      return 'Market';
    } else if (type === 'event-instance') {
      return 'Event';
    } else if (type === 'promotion-banner') {
      return 'Ad';
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

    return type === 'market-post' || type === 'event-instance';
  }),

  parentRoute: computed(function() {
    const type = get(this, 'type');

    if (type === 'market-post') {
      return 'market';
    } else if (type === 'event-instance') {
      return 'events';
    } else {
      return type;
    }
  }),

  parentContentId: computed('content.parentContentId','content.parentContentType', function() {
    if (get(this, 'content.parentContentType') === 'event') {
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

  viewId: computed('isTalk','content.id','parentOrSelfId',function(){
    if(get(this,'isTalk')){
      return get(this,'parentOrSelfId');
    } else {
      return get(this,'content.id');
    }
  }),

  viewRoute: computed(function() {
    return `${get(this, 'parentRoute')}.show`;
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
