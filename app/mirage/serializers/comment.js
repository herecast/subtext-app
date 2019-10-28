import { ActiveModelSerializer, Serializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  embed: 'true',
  include: Object.freeze(['parentContent']),

  serialize() {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    return json;
  }
});
