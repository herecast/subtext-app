import { ActiveModelSerializer, Serializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  embed: 'true',
  include: Object.freeze(['location', 'organization_hide', 'organization_subscription']),

  serialize(object/*, request*/) {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    if (object.managedOrganizationIds.length > 0) {
      json.current_user.managed_organization_ids = object.managedOrganizationIds;
    }

    return json;
  }
});
