/**
 * Seeds for development
 */
export default function (server) {
  server.createList('ad-metric', 1);
  const promotionBanners = server.createList('promotion-banner', 10);
  server.create('promotion', {
    banner: promotionBanners[0]
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
    {"city": "Hartford", "state": "VT", "id": "19"},
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
  ].forEach((location) => {
    server.create('location', location);
  });

  const casterFollows = server.createList('caster-follow', 5);
  const casterHides = server.createList('caster-hide', 5);

  const currentCaster = server.create('caster', {
    locationId: 18,
    email: 'test@test.com',
    casterHides,
    casterFollows
  });


  server.createList('caster', 10);
  server.createList("venue", 5);
  server.createList('comment', 8);
  server.createList('content-metric', 1);
  server.createList('content-payment', 6);
  server.createList('promotionCoupon', 10);
  server.createList('event-instance', 10);

  const casterContents = server.createList('content', 5, {
    casterId: currentCaster.id,
    contentOrigin: 'ugc'
  });

  casterContents.forEach((content) => {
    server.create('feedItem', {
      contentId: content.id
    });
    server.create('bookmark', {
      casterId: currentCaster.id,
      contentId: content.id
    });
  });

  const casterCommentParent = server.create('content', {
    contentOrigin: 'ugc'
  });

  const comments = server.createList('comment', 3, {
    userId: 1,
    userName: "Thad Copeland",
    avatarImageUrl: null,
    parentContent: casterCommentParent
  });

  casterCommentParent.update({
    comments: comments
  });

  server.create('feed-item', {
    content: casterCommentParent
  });

  const casterCommentParent2 = server.create('content', {
    contentOrigin: 'ugc'
  });

  const comments2 = server.createList('comment', 3, {
    userId: 1,
    userName: "Thad Copeland",
    avatarImageUrl: null,
    parentContent: casterCommentParent2
  });

  casterCommentParent2.update({
    comments: comments2
  });

  server.create('feed-item', {
    content: casterCommentParent2
  });


  server.createList('feedItem', 20);

}
