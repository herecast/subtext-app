import { ActiveModelSerializer, Serializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  embed: 'true',
  include: ['comments'],

  serialize(/*object, request*/) {
    let json = Serializer.prototype.serialize.apply(this, arguments);
    if(json['contents']) {
      json['contents'].forEach((record) => {
        record.comment_count = record.comments.length;
      });
    }
    return json;
  }
});
