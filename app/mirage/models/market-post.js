import { Model, /*hasMany,*/ belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  //images: hasMany('image'),
  organization: belongsTo('organization')
});
