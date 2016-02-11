import Ember from 'ember';
import config from '../config/environment';
import ajax from 'ic-ajax';
import trackEvent from 'subtext-ui/mixins/track-event';

const { inject, get, RSVP, isPresent, computed } = Ember;

export default Ember.Controller.extend(trackEvent, {
  secondaryBackground: true,
  queryParams: ['page', 'per_page', 'sort', 'type'],
  contentModel: inject.service(),
  refresh: null,
  page: 1,
  per_page: 8,
  sort: 'pubdate DESC',
  type: '',

  showPasswordForm: false,

  ads: computed('page', 'sort', 'type', 'refresh', function() {
    const page = get(this, 'page');
    const per_page = get(this, 'per_page');
    const sort = get(this, 'sort');
    const type = get(this, 'type');

    if(type === 'promotion-banner') {
      return this.store.query('promotion-banner', {
        page: page,
        per_page: per_page,
        sort: sort
      });
    } else {
      return []; 
    }
  }),

  postings: computed('page', 'sort', 'type', 'refresh',function() {
    const contentModel = get(this, 'contentModel');
    const page = get(this, 'page');
    const per_page = get(this, 'per_page');
    const sort = get(this, 'sort');
    const type = get(this, 'type');
    const queryParams = [
      `page=${page}`,
      `per_page=${per_page}`,
      `sort=${sort}`
    ];

    if (isPresent(type)) {
      queryParams.push(`channel_type=${type}`);
    }

    const url = `${config.API_NAMESPACE}/dashboard?${queryParams.join('&')}`;

    if(type === 'promotion-banner') {
      return [];
    } else {
      let promise = new RSVP.Promise((resolve) => {
        ajax(url).then((response) => {

          const contents = response.contents.map((record) => {
            return contentModel.convert(record);
          });

          resolve(contents);
        });
      });

      return Ember.ArrayProxy.extend(Ember.PromiseProxyMixin).create({
        promise: promise
      });
    }
  }),

  actions: {
    saveUsername() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Profile Feature Submit',
        navControl: 'Submit Username Change'
      });

      this.get('currentUser.content').save();
    },

    submit() {
      this.get('currentUser.content').save();
    },

    togglePasswordForm(showPasswordForm) {
      if (!showPasswordForm) {
        this.trackEvent('selectNavControl', {
          navControlGroup: 'Profile Feature Edit',
          navControl: 'password'
        });
      }

      this.toggleProperty('showPasswordForm');
    },

    trackEditName() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Profile Feature Edit',
        navControl: 'username'
      });
    },

    sortBy(param) {
      this.setProperties({
        sort: param,
        page: 1
      });
    }
  }
});
