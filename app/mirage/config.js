import Ember from 'ember';
import moment from 'moment';
import Mirage from 'ember-cli-mirage';

const { isPresent } = Ember;

/*jshint multistr: true */

// This is just a dumb method to make it look like we're doing filtering
function filterByCategory(events, category) {
  if (category === 'Everything') {
    return events;
  } else {
    const size = 20 + category.length;

    return events.slice(0, size);
  }
}

function filterCollectionByDate(mirageCollection, queryStart, queryEnd) {
  if (isPresent(queryStart) && isPresent(queryEnd)) {
    return mirageCollection.where((item) => {
      const itemStart = moment(item.startsAt);
      const itemEnd = moment(item.endsAt);

      return (itemStart >= queryStart && itemStart <= queryEnd) ||
        (itemEnd >= queryStart && itemEnd <= queryEnd);
    });
  } else {
    return mirageCollection.all();
  }
}

const eventBaseProperties = [
  'id', 'content_id', 'content', 'image_url', 'cost', 'cost_type',
  'venue_name', 'venue_address', 'venue_city', 'venue_state',
  'venue_zip', 'venue_id', 'venue_latitude', 'venue_longitude',
  'venue_locate_name', 'venue_url', 'registration_deadline',
  'registration_url', 'registration_phone', 'registration_email',
  'event_url', 'contact_phone', 'contact_email',
  'title', 'subtitle', 'ends_at', 'starts_at', 'event_id', 'publishedAt'
];

const marketPostBaseProperties = [
  'id', 'title', 'imageUrl', 'publishedAt', 'contentId', 'myTownOnly'
];

const talkBaseProperties = [
  'id', 'title', 'author_image_url', 'published_at', 'commenter_count',
  'view_count', 'author_name'
];

const newsBaseProperties = [
  'id', 'title', 'content', 'publishedAt', 'authorId', 'authorName',
  'organizationName','organizationId', 'imageUrl', 'organization'
];

function dashboardTalks(db,start,stop) {
  return db.talks.slice(start,stop).map((item) => {
    const record = Ember.getProperties(item, talkBaseProperties);
    record.content_type = 'talk_of_the_town';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    return record;
  });
}
function dashboardTalkComments(db,start,stop) {
  return db.news.slice(start,stop).map((item) => {
    const record = Ember.getProperties(item, talkBaseProperties);
    record.content_type = 'Comment';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    return record;
  });
}
function dashboardNews(db,start,stop) {
  return db.news.slice(start,stop).map((item) => {
    const record = Ember.getProperties(item, newsBaseProperties);
    record.content_type = 'news';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    record.updated_at = moment(faker.date.recent(-30)).toISOString();
    return record;
  });
}
function dashboardMarketPosts(db,start,stop) {
  return db.marketPosts.slice(start,stop).map((item) => {
    const record = Ember.getProperties(item, marketPostBaseProperties);
    record.content_type = 'MarketPost';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    return record;
  });
}
function dashboardEvents(db,start,stop) {
  return db.eventInstances.slice(start,stop).map((item) => {
    const record = Ember.getProperties(item, eventBaseProperties);
    record.content_type = 'event';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    return record;
  });
}

function dashboardAds(db,start,stop) {
  return db.promotionBanners.slice(start,stop);
}

function mixedContent(db, params={}) {
  const contents = [];

  // per_page is the number of non-news content items returned by the api and
  // when combined with news_per_page is ADDITIVE, ie: {news_per_page: 5, per_page: 2}
  // will result in 7 items being returned from the api
  const {news_per_page} = params || 2;

  dashboardNews(db, 0, news_per_page).forEach(record => {
    contents.push(record);
  });

  dashboardTalks(db,0,2).forEach((record)=> {
    contents.push(record);
  });

  dashboardMarketPosts(db,0,1).forEach((record)=> {
    contents.push(record);
  });

  dashboardEvents(db,0,3).forEach((record)=> {
    contents.push(record);
  });

  dashboardMarketPosts(db,0,2).forEach((record)=> {
    contents.push(record);
  });

  dashboardEvents(db,0,1).forEach((record)=> {
    contents.push(record);
  });

  dashboardTalkComments(db,0,2).forEach((record)=> {
    contents.push(record);
  });

  dashboardMarketPosts(db,0,1).forEach((record)=> {
    contents.push(record);
  });

  return contents;
}

export default function() {
  this.pretender.post.call(
    this.pretender,
    '/write-blanket-coverage',
    this.pretender.passthrough
  );

  this.namespace = 'api/v3';
  this.timing = 200; // delay for each request, automatically set to 0 during testing

  this.pretender.prepareBody = function(body) {
    if (typeof body === "string") {
      // For text/html requests
      return body;
    } else {
      return body ? JSON.stringify(body) : '{"error" : "not found"}';
    }
  };

  this.post('/users/sign_in', function() {
    return {
      token: "FCxUDexiJsyChbMPNSyy",
      email: "embertest@subtext.org"
    };
  });

  this.post('/users/sign_up', function() {
  });

  this.post('/users/logout', function() {});

  this.get('/current_user', function({ db, currentUsers }) {
    var currentUser = currentUsers.find(1);

    //mocks location join
    var location = db.locations.find(currentUser.locationId);
    var locationString = `${location.city}, ${location.state}`;
    currentUser.location = locationString;

    return currentUser;
  });

  this.put('/current_user', function({ db, currentUsers }, request) {
    var id = 1;
    var currentUser;

    if(request.requestHeaders['Content-Type'].indexOf('application/json') > -1) {

      var putData = JSON.parse(request.requestBody);
      var attrs = putData['currentUser'];
      currentUser = currentUsers.update(id, attrs);
    } else {
      currentUser = currentUsers.find(id);
    }

    //mocks location join
    var location = db.locations.find(currentUser.locationId);
    var locationString = `${location.city}, ${location.state}`;
    currentUser.location = locationString;

    return currentUser;
  });

  this.post('/users/email_confirmation', function() {
    return {
      token: "FCxUDexiJsyChbMPNSyy",
      email: "embertest@subtext.org"
    };
  });

  this.get('/event_instances', function({ eventInstances }, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    let results = filterCollectionByDate(eventInstances, params.date_start, params.date_end);
    results.models = filterByCategory(results.models, params.category);
    results.models = results.models.slice(start, stop);

    return results;
  });

   // Used in the user dashboard to find locations
  this.get('/locations', function({ db }) {
    return {
      locations: db.locations
    };
  });


  // Used by the event filter bar to find locations
  this.get('/venue_locations', function({ db }, request) {
    const venueLocations = [];

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    if (request.queryParams.query.indexOf('empty') !== 0) {
      for (let i = 1; i < 5; i += 1) {
        venueLocations.push(faker.address.streetAddress());
      }
    }

    return {
      venue_locations: venueLocations
    };
  });

  // Used by the news filter bar to find organizations
  this.get('/organizations', function({ db }, request) {
    let organizations;

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    if ('query' in request.queryParams && request.queryParams.query.indexOf('empty') === 0) {
      organizations = [];
    } else if ('ids' in request.queryParams) {
      organizations = db.organizations.filter((org) => {
        return request.queryParams.ids.indexOf(String(org.id)) !== -1;
      });
    } else {
      organizations = db.organizations;
    }
    return {
      organizations: organizations
    };
  });

  this.get('/organizations/:id');
  this.put('/organizations/:id', function({ db }, request) {
    if (request && request.requestBody && typeof request.requestBody === 'string') {
      var id = request.params.id;
      var putData = JSON.parse(request.requestBody);
      var attrs = putData['organization'];
      var org = db.organizations.update(id, attrs);

      return {organization: org};
    } else {
      // We're using the UPDATE action to upload event images after the event
      // has been created. Mirage can't really handle this, so we ignore it.
      console.log('Ignoring image upload');
    }
  });

  this.get('/event_instances/:id', 'event-instance');

  this.get('/events/:id', function({ db }, request) {
    const event = db.events.find(request.params.id);
    const baseProperties = Ember.copy(eventBaseProperties);
    const showProperties = [
      'contentId', 'category'
    ];
    const properties = baseProperties.concat(showProperties);
    const data = Ember.getProperties(event, properties);

    data.schedules = db.schedules;

    return {
      event: data
    };
  });

  this.post('/events', function({ db }, request) {
    const putData = JSON.parse(request.requestBody);

    const eventAttrs = putData['event'];
    const event = db.events.insert(eventAttrs);


    const scheduleAttrs = putData['event']['schedules'];
    const schedules = db.schedules.insert(scheduleAttrs);

    event.schedules = schedules;
    event.schedules.forEach((schedule) => {
      schedule.event_id = event.id;
    });

    event.first_instance_id = 1;

    return {
      event: event
    };
  });

  this.post('/events/:id/publish', function({ db }, request) {
    db.events.update(request.params.id, {published: true});
    const event = db.events.find(request.params.id);

    return {
      event: Ember.getProperties(event, eventBaseProperties)
    };
  });

  this.post('/contents/:id/moderate', function() {
    return { };
  });

  this.put('/events/:id', function({ db }, request) {
    if (request && request.requestBody && typeof request.requestBody === 'string') {
      var id = request.params.id;
      var putData = JSON.parse(request.requestBody);
      var attrs = putData['event'];
      var event = db.events.update(id, attrs);

      const scheduleAttrs = putData['event']['schedules'];
      event.schedules = db.schedules.insert(scheduleAttrs);
      event.schedules.forEach((schedule) => {
        schedule.event_id = event.id;
      });

      event.first_instance_id = 1;

      return {event: event};
    } else {
      // We're using the UPDATE action to upload event images after the event
      // has been created. Mirage can't really handle this, so we ignore it.
      console.log('Ignoring image upload');
    }
  });

  this.del('/events/:id');

  // Used by the event creation page to find venues
  this.get('/venues', function({ db }, request) {
    let venues = [];

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    if (request.queryParams.query.indexOf('empty') !== 0) {
      venues = db.venues;
    }

    return {
      venues: venues
    };
  });

  this.get('/comments');

  this.post('/comments');

  this.get('/listservs');

  this.get('/contents/:id/similar_content', function({ db }) {
    return {
      similar_content: mixedContent(db)
    };
  });

  this.get('/contents/:content_id/related_promotion', function() {
    return {
      related_promotion: {
        banner_id: faker.random.number(1000),
        image_url: 'https://placeholdit.imgix.net/~text?txtsize=31&txt=BannerAd&w=750&h=150',
        redirect_url: `http://${faker.internet.domainName()}`,
        advertiser: faker.company.companyName,
        promotion_id: faker.random.number(1000)
      }
    };
  });

  this.post('/promotion_banners/:id/track_click', function() {});

  this.get('/market_posts', function({ marketPosts }, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;
    const queryStart = params.date_start;
    const queryEnd = params.date_end;
    let results;

    results = filterCollectionByDate(marketPosts, queryStart, queryEnd);

    results.models = results.models.slice(start, stop);

    return results;
  });

  this.get('/market_posts/:id', 'market-post');

  this.get('/market_posts/:id/contact', function({ db }, request) {
    const post = db.marketPosts.find(request.params.id);

    return {
      market_post: {
        id: post.id,
        contact_phone: faker.phone.phoneNumber(),
        contact_email: faker.internet.email()
      }
    };
  });

  this.post('/market_posts', function({ db }, request) {
    const putData = JSON.parse(request.requestBody);

    const attrs = putData['market_post'];
    const post = db.marketPosts.insert(attrs);

    // This is so we show the edit button on the post show page
    post.can_edit = true;
    post.content_id = post.id;

    return {
      market_post: post
    };
  });

  this.put('/market_posts/:id', function({ db }, request) {
    if (request && request.requestBody && typeof request.requestBody === 'string') {
      var id = request.params.id;
      var putData = JSON.parse(request.requestBody);
      var attrs = putData['market_post'];
      return db.marketPosts.update(id, attrs);
    } else {
      // We're using the UPDATE action to upload market images after the post
      // has been created. Mirage can't really handle this, so we ignore it.
      console.log('Ignoring image upload');
    }
  });

  this.post('/password_resets', function() {
    return {};
  });

  this.put('/password_resets/:token', function() {
    return ' ';
  });

  this.get('/password_resets/:token', function() {
    return {};
  });

  this.get('/talk', function({ talks }, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    let results = filterCollectionByDate(talks, params.date_start, params.dateEnd);
    results.models = results.models.slice(start, stop);

    return results;
  });

  this.get('/talk/:id');

  this.post('/talk', function({ db }, request) {
    const putData = JSON.parse(request.requestBody);

    const attrs = putData['talk'];
    const talk = db.talks.insert(attrs);

    // This is so we show the edit button on the talk show page
    talk.canEdit = true;

    return {
      talk: talk
    };
  });

  this.put('/talk/:id', function({ db }, request) {
    if (request && request.requestBody && typeof request.requestBody === 'string') {
      var id = request.params.id;
      var putData = JSON.parse(request.requestBody);
      var attrs = putData['talk'];
      var data = db.talks.update(id, attrs);
      return data;
    } else {
      // We're using the UPDATE action to upload talk images after the talk
      // has been created. Mirage can't really handle this, so we ignore it.
      console.log('Ignoring image upload');
    }
  });

  this.get('/news', function({ news }, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;
    const organizationId = params.organizationId;
    const query = params.query;

    let results = filterCollectionByDate(news, params.date_start, params.dateEnd);

    if(isPresent(organizationId)) {
      results.models = results.models.filter((item)=> {
        return item.organizationId.toString() === organizationId;
      });
    }

    if(isPresent(query)) {
      results.models = results.models.filter((item)=> {
        return isPresent(item.title) && (item.title.indexOf(query) > -1);
      });
    }

    // Get the total number of results, then cut the results by the current start and stop points
    let total = results.models.length;
    results.models = results.models.slice(start,stop);

    // Build the response with the meta total
    let response =  this.serializerOrRegistry.serialize(results, request);
    response.meta = {
      total: total
    };

    return new Mirage.Response(200, {}, response);
  });

  this.get('/news/:id');
  this.delete('/news/:id');

  this.post('news');

  this.put('news/:id', function({ db }, request) {
    const id = request.params.id;
    const data = JSON.parse(request.requestBody);

    const news = db.news.update(id, data['news']);

    return { news: news };
  });

  this.get('/contents', function({ db }, request) {
    return {
      contents: mixedContent(db, request.queryParams)
    };
  });

  this.get('/dashboard', function({ db }, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    let contents = [];

    if(params['channel_type'] === 'news') {
      contents = dashboardNews(db,start,stop);
    } else if(params['channel_type'] === 'talk') {
      contents = dashboardTalks(db,start,stop);
    } else if(params['channel_type'] === 'events') {
      contents = dashboardEvents(db,start,stop);
    } else if(params['channel_type'] === 'market') {
      contents = dashboardMarketPosts(db,start,stop);
    } else {
      contents = mixedContent(db).slice(start, stop);
    }

    return {
      contents: contents
    };
  });

  this.get('/promotion_banners', function({ db }, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    return {
      promotionBanners: dashboardAds(db,start,stop)
    };
  });

  this.get('/weather', function() {
    const weather = '<div class="pull-left has-tooltip" data-title="Powered by Forecast.io" id="forecast"><a href="http://forecast.io/#/f/43.7153482,-72.3078690" target="_blank">80° Clear</a></div><div class="pull-left" id="forecast_icon"><i class="wi wi-day-sunny"></i></div>';
    return new Mirage.Response(200, {'Content-Type': 'text/html'}, weather);
  });

  this.post('/images', function({ db }) {
    const image = db.images.insert({
      id: faker.random.number(1000),
      primary: false,
      url: 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200'
    });

    return {
      image: image
    };
  });

  this.put('/images/:id', function({ db }, request) {
    const id = request.params.id;
    const image = db.images.update(id, {});

    return {
      image: image
    };
  });

  this.get('/contents/:id/metrics', function({ db }){
    return {
      content_metrics: db.contentMetrics[0]
    };
  });

  this.get('/promotion_banners/:id/metrics', function({ db }){
    return {
      promotion_banner_metrics: db.adMetrics[0]
    };
  });

  this.get('/businesses', function({ db, businessProfiles }, request) {
    const { query } = request.queryParams; // category location, maxDistance, openAt
    let profiles = this.serialize(businessProfiles.all());

    if (query === "nothing") {
      return {
        businessProfiles: []
      };
    } else if ('organizationId' in request.queryParams) {
      const organizationId = Number(request.queryParams.organizationId);

      return {
        businessProfiles: profiles.filter((item) => {
          return item.organizationId === organizationId;
        })
      };
    } else {
      return {
        businesses: profiles['business_profiles']
      };
    }
  });

  this.get('/businesses/:id', function({ db, businessProfiles }, request) {
    return this.serialize(businessProfiles.find(request.params.id));
  });

  this.post('/businesses');
  this.put('/businesses/:id');

  this.get('/business_categories', function({ db, businessCategories }, request) {
    // For coalesceFindRequests
    const ids = request.queryParams['ids'];
    let categories = this.serialize(businessCategories.all());

    if( !Ember.isEmpty(ids) ) {
      categories.filter(function(category) {
        return ids.contains(category.id.toString());
      });
    }

    return categories;
  });

  this.get('/business_categories/:id', function({ db, businessCategories }, request){
    return this.serialize(businessCategories.find(request.params.id));
  });

  this.post('/businesses/:id/feedback', function(){
    return {
      id: 3,
      user_id: 1,
      business_id: 7
    };
  });

  this.put('/businesses/:id/feedback', function(){
    return {
      id: 3,
      user_id: 1,
      business_id: 7
    };
  });
}
