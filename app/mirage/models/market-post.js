import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  //images: hasMany('image'),
  organization: belongsTo('organization'),
  comments: hasMany('comment')
});
