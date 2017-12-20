import Ember from 'ember';

const { computed, isPresent, get, inject:{service} } = Ember;

export default Ember.Mixin.create({
  session: service(),

  currentUser: computed.oneWay('session.currentUser'),
  organizations: computed.oneWay('currentUser.managedOrganizations'),

  userCanEditFeedCard: computed('session.isAuthenticated', 'organizations.@each.id', 'model.organizationId', function() {
    const managedOrganizations = get(this, 'organizations') || [];
    const cardOwnerOrganizationId = get(this, 'model.organizationId') || null;
    const userIsManagerOfOwningOrganization = isPresent(managedOrganizations.findBy('id', String(cardOwnerOrganizationId)));

    const canEditProperty = get(this, 'model.canEdit') || false;

    const authorIdOfContent = get(this, 'model.authorId');
    const userIsAuthorOfContent = get(this, 'currentUser.id') === authorIdOfContent;
    
    return canEditProperty || userIsManagerOfOwningOrganization || userIsAuthorOfContent;
  })
});
