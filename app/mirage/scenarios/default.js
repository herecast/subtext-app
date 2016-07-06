/**
 * Seeds for development
 */
export default function(server) {
  server.loadFixtures();
  server.createList('content-metric',1);
  server.createList('ad-metric',1);
  const organizations = server.createList('organization',5);
  server.create('current-user', {
    managedOrganizations: organizations.slice(0,2)
  });
  server.createList('talk', 50);
  server.createList('comment',8);
  server.createList('promotion-banner', 50);
  server.createList('market-post', 100);
  server.createList('location', 8);

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
