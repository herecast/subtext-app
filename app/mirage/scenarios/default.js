/**
 * Seeds for development
 */
export default function (server) {
  server.createList('ad-metric', 1);
  const promotionBanners = server.createList('promotion-banner', 50);
  const promotion = server.create('promotion', {
    banner: promotionBanners[0]
  });

  const organizations = server.createList('organization', 5, {
    profileAdOverride: promotion
  });

  [
    {"city": "Barnard", "state": "VT"},
    {"city": "Bath", "state": "NH"},
    {"city": "Bethel", "state": "VT"},
    {"city": "Bradford", "state": "VT"},
    {"city": "Bridgewater", "state": "VT"},
    {"city": "Bridgewater", "state": "NH"},
    {"city": "Brookfield", "state": "VT"},
    {"city": "Canaan", "state": "NH"},
    {"city": "Cavendish", "state": "VT"},
    {"city": "Charlestown", "state": "NH"},
    {"city": "Chelsea", "state": "VT"},
    {"city": "Claremont", "state": "NH"},
    {"city": "Corinth", "state": "VT"},
    {"city": "Cornish", "state": "NH"},
    {"city": "Croydon", "state": "NH"},
    {"city": "Dorchester", "state": "NH"},
    {"city": "Enfield", "state": "NH"},
    {"city": "Fairlee", "state": "VT"},
    {"city": "Goshen", "state": "NH"},
    {"city": "Grafton", "state": "NH"},
    {"city": "Grantham", "state": "NH"},
    {"city": "Groton", "state": "VT"},
    {"city": "Hanover", "state": "NH"},
    {"city": "Hartford", "state": "VT"},
    {"city": "Hartland", "state": "VT"},
    {"city": "Haverhill", "state": "NH"},
    {"city": "Lebanon", "state": "NH"},
    {"city": "Lyme", "state": "NH"},
    {"city": "Newbury", "state": "VT"},
    {"city": "New London", "state": "NH"},
    {"city": "Newport", "state": "NH"},
    {"city": "Norwich", "state": "VT"},
    {"city": "Orange", "state": "NH"},
    {"city": "Orford", "state": "NH"},
    {"city": "Piermont", "state": "NH"},
    {"city": "Plainfield", "state": "NH"},
    {"city": "Plymouth", "state": "VT"},
    {"city": "Pomfret", "state": "VT"},
    {"city": "Randolph", "state": "VT"},
    {"city": "Reading", "state": "VT"},
    {"city": "Rochester", "state": "VT"},
    {"city": "Royalton", "state": "VT"},
    {"city": "Ryegate", "state": "VT"},
    {"city": "Sharon", "state": "VT"},
    {"city": "Springfield", "state": "NH"},
    {"city": "Springfield", "state": "VT"},
    {"city": "Stockbridge", "state": "VT"},
    {"city": "Strafford", "state": "VT"},
    {"city": "Sunapee", "state": "NH"},
    {"city": "Thetford", "state": "VT"},
    {"city": "Topsham", "state": "VT"},
    {"city": "Tunbridge", "state": "VT"},
    {"city": "Unity", "state": "NH"},
    {"city": "Vershire", "state": "VT"},
    {"city": "Weathersfield", "state": "VT"},
    {"city": "West Fairlee", "state": "VT"},
    {"city": "West Newbury", "state": "VT"},
    {"city": "West Windsor", "state": "VT"},
    {"city": "Williamstown", "state": "VT"},
    {"city": "Windsor", "state": "VT"},
    {"city": "Woodstock", "state": "VT"}
  ].forEach((loc) => {
    server.create('location', loc);
  });

  server.create('current-user', {
    managedOrganizations: organizations.slice(0, 2),
    locationId: 'hartford-vt',
    email: 'test@test.com'
  });

  server.createList("venue", 5);
  server.createList('comment', 8);
  server.createList('content-metric', 1);
  server.createList('promotionCoupon', 10);
  server.createList('event-instance', 100);

  const listservContent = server.createList('content', 5, {
    contentOrigin: 'listserv'
  });
  const listservCarousel = server.create('carousel', {
    title: 'Local Listserv',
    carouselType: 'content',
    queryParams: {"organization_id": 447},
    contents: listservContent
  });
  server.create('feedItem', {
    modelType: 'carousel',
    carouselId: listservCarousel.id
  });

  const businessContent = server.createList('organization', 5);
  const businessesCarousel = server.create('carousel', {
    title: 'Businesses',
    carouselType: 'organization',
    queryParams: {"type": 'organization'},
    organizations: businessContent
  });
  server.create('feedItem', {
    modelType: 'carousel',
    carouselId: businessesCarousel.id
  });

  const mystuffContents = server.createList('content', 5, {
    authorId: 1,
    contentOrigin: 'ugc'
  });
  mystuffContents.forEach((content) => {
    server.create('feedItem', {
      contentId: content.id
    });
    server.create('bookmark', {
      userId: 1,
      contentId: content.id
    });
  });

  const mystuffCommentParent = server.create('content', {
    id: 1000,
    contentOrigin: 'ugc'
  });

  server.createList('comment', 10, {
    userId: 1,
    userName: "Thad Copeland",
    userImageUrl: null,
    parentContentId: mystuffCommentParent.id
  });

  server.createList('feedItem', 40);

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

  /**
   * Business Categories
   *
   * Create sub categories first, because Mirage doesn't let you mutate after
   * they're created
   */
  var ids = [100, 101, 102];
  var subCats = [];
  ids.forEach(function (id) {
    var cats = server.createList('business-category', 3, {parentIds: [id]});
    server.create('business-category', {
      id: id,
      childIds: cats.map(function (c) {
        return c.id;
      })
    });
    subCats.push(...cats);
  });

  subCats.forEach(function (category) {
    server.createList('business-profile', 4, {parentIds: [category.id]});
  });
}
