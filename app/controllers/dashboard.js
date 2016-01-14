import Ember from 'ember';
import config from '../config/environment';
import ajax from 'ic-ajax';

const { inject, get, RSVP, isPresent, computed } = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  queryParams: ['page', 'per_page', 'sort', 'type'],
  contentModel: inject.service(),

  page: 1,
  per_page: 8,
  sort: 'pubdate DESC',
  type: '',

  showPasswordForm: false,
  
  postings: computed('page','sort','type',function() {
    const contentModel = get(this, 'contentModel');
    const page = get(this,'page');
    const per_page = get(this,'per_page');
    const sort = get(this,'sort');
    const type = get(this,'type');
    const queryParams = [
      `page=${page}`,
      `per_page=${per_page}`,
      `sort=${sort}`
    ];

    if (isPresent(type)) {
      queryParams.push(`channel_type=${type}`);
    }

    const url = `${config.API_NAMESPACE}/dashboard?${queryParams.join('&')}`;

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
  }),
  
  actions: {
    submit() {
      this.get('currentUser.content').save();
    },
    togglePasswordForm() {
      this.toggleProperty('showPasswordForm');
    }
  }
});
