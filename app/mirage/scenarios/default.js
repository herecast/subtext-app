/**
 * Seeds for development
 */
export default function(server) {
  server.loadFixtures();
  server.createList('ad-metric',1);
  const promotionBanners = server.createList('promotion-banner', 50);
  const promotion = server.create('promotion', {
    banner: promotionBanners[0]
  });

  const organizations = server.createList('organization', 5, {
    profileAdOverride: promotion
  });

  server.create('current-user', {
    managedOrganizations: organizations.slice(0,2)
  });
  server.createList('location', 8);
  server.createList("venue", 5);
  server.createList('talk', 50);
  server.createList('comment',8);
  server.createList('market-post', 100);
  server.createList('market-category', 3, { trending: true });
  server.createList('market-category', 6, { featured: true });
  server.createList('market-category', 21);
  server.createList('content-metric',1);
  server.createList('location', 8);

  const user1 = server.create('user', {location_id: 1});
  const user2 = server.create('user', {location_id: 1});

  const listserv = server.create('listserv');
  const listserv2 = server.create('listserv');
  const listserv3 = server.create('listserv');

  server.create('digest', {
    id: listserv.id
  });

  server.create('digest', {
    id: listserv2.id
  });

  server.create('digest', {
    id: listserv3.id
  });

  server.create('subscription', {
    confirmedAt: null,
    listserv: listserv,
    user: user1,
    email: user1.email
  });

  server.create('subscription', {
    listserv: listserv,
    user: user1,
    email: user1.email,
    confirmedAt: '2012-08-01'
  });

  server.create('subscription', {
    listserv: listserv,
    email: 'embertest3@subtext.org',
    confirmedAt: null,
    user: null
  });

  server.create('subscription', {
    listserv: listserv,
    user: user2,
    email: user2.email,
    confirmedAt: '2012-08-01'
  });

  server.create('listserv-content', {
    listserv: listserv,
    body: 'No Content',
    user: user1,
    senderEmail: user1.email
  });

  server.create('listserv-content', {
    listserv: listserv,
    user: user2,
    senderEmail: user2.email
  });

  server.create('listserv-content', {
    listserv: listserv,
    user: null
  });
  server.create('listserv-content', {
    listserv: listserv,
    id: 4,
    verifiedAt: '2012-08-01',
    user: null
  });

  /**
   * Business Categories
   *
   * Create sub categories first, because Mirage doesn't let you mutate after
   * they're created
   */
  var ids = [100,101,102];
  var subCats = [];
  ids.forEach(function(id){
    var cats = server.createList('business-category', 3, {parentIds: [id]});
    server.create('business-category', {
      id: id,
      childIds: cats.map(function(c) {return c.id;})
    });
    subCats.push(...cats);
  });

  subCats.forEach(function(category) {
    server.createList('business-profile', 4, {parentIds: [category.id]});
  });
}
