import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery(query) {
     let url = this._super(...arguments);

     const {user_id, include} = query;

     if (user_id) {
       url += `/${user_id}`;
       delete query.user_id;
     }

     if (include) {
       url += `/${include}`;
       delete query.include;
     }

     return url;
   }
});
