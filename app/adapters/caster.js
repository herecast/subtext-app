import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  queryRecord(store, type, query) {
    let handle = query.handle || false;

    if (handle && handle.indexOf('@') === 0) {
      handle = handle.replace('@', '');
      query.handle = handle;
      return this._super(store, type, query);
    }

    return this._super(...arguments);
  },

  urlForQuery(options) {
     let url = this._super(...arguments);

     const { user_id, include, query } = options;

     if (user_id) {
       url += `/${user_id}`;
       delete options.user_id;
     }

     if (include) {
       url += `/${include}`;
       delete options.include;
     }

     if (query) {
       url += '/follows';
     }

     return url;
   }
});
