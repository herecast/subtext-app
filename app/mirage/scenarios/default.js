/**
 * Seeds for development
 */
export default function(server) {
  server.loadFixtures();
  server.createList('content-metric',1);
  server.createList('ad-metric',1);

  /**
   * Business Categories
   *
   * Create sub categories first, because Mirage doesn't let you mutate after 
   * they're created
   */
  var ids = [100,101,102];
  var subCats = [];
  ids.forEach(function(id){
    var cats = server.createList('business-category', 3, {parent_ids: [id]});
    server.create('business-category', {
      id: id,
      child_category_ids: cats.map(function(c) {return c.id;})
    });
    subCats.push(...cats);
  });

  subCats.forEach(function(category) {
    server.createList('business-profile', 4, {category_ids: [category.id]});
  });
}
