import Ember from 'ember';
import moment from 'moment';
import Mirage from 'ember-cli-mirage';

const { isPresent, isBlank, get } = Ember;

/*jshint multistr: true */

function filterCollectionByDate(mirageCollection, queryStart, queryEnd) {
  if (isPresent(queryStart) && isPresent(queryEnd)) {
    return mirageCollection.where((item) => {
      const itemStart = moment(item.startsAt);
      const itemEnd = moment(item.endsAt);

      return (itemStart >= queryStart && itemStart <= queryEnd) ||
        (itemEnd >= queryStart && itemEnd <= queryEnd);
    });
  } else if (isPresent(queryStart)) {
    return mirageCollection.where((item) => {
      const itemStart = moment(item.startsAt);

      return itemStart >= queryStart;
    });
  } else {
    return mirageCollection.all();
  }
}

export default function() {
  this.pretender.post.call(
    this.pretender,
    '/write-blanket-coverage',
    this.pretender.passthrough
  );

  this.namespace = '/api/v3';
  this.timing = 200; // delay for each request, automatically set to 0 during testing

  this.pretender.prepareBody = function(body) {
    if (typeof body === "string") {
      // For text/html requests
      return body;
    } else {
      return body ? JSON.stringify(body) : '{"error" : "not found"}';
    }
  };

  this.post('/users/sign_in', function(schema, request) {
    let user;

    if(request.requestBody.indexOf('{') >= 0) {
      //json
      let json = JSON.parse(request.requestBody)['user'];
      if(json['email']) {
        user = schema.currentUsers.where({email: json['email']}).models[0];
      } else {
        user = schema.currentUsers.first();
      }
    } else {
      let emailMatcher = /user\[email\]=([\w\.\-_@]+)/i;
      let matches = decodeURIComponent(request.requestBody).match(emailMatcher);

      if(matches) {
        let email = matches[1];
        user = schema.currentUsers.where({email: email}).models[0];
      } else {
        user = schema.currentUsers.first();
      }
    }

    if(user) {
      schema.currentUsers.create(user.attrs);
      return {
        token: "FCxUDexiJsyChbMPNSyy",
        email: user.email
      };
    } else {
      return new Mirage.Response(401, {}, {
        error: "Invalid email or password"
      });
    }
  });

  this.post('/users/email_signin_link', function(db, request) {
    const email = JSON.parse(request.requestBody)['email'] || "";

    if(email.indexOf('noaccount') > -1) {
      return new Mirage.Response(422, {'Content-Type': 'application/json'}, {error: 'no account matches the email provided'});
    } else {
      return {};
    }
  });

  this.post('/users/sign_in_with_token', function(db, request) {
    const token = JSON.parse(request.requestBody)['token'] || "";

    if(token === "valid") {
      const user = db.currentUsers.first();
      db.currentUsers.create(user.attrs);
      return {
        token: "FCxUDexiJsyChbMPNSyy",
        email: user.email
      };
    } else {
      return new Mirage.Response(422, {'Content-Type': 'application/json'}, {error: 'token invalid or expired'});
    }
  });

  this.post('/users/sign_up', function() {
  });

  this.post('/users/logout', function(schema) {
    schema.db.currentUsers.remove();
  });

  this.get('/user/', function({ db }, request) {
    const email = request.queryParams.email;
    let response;

    if (db.currentUsers.where({ email }).length > 0) {
      response = new Mirage.Response(200);
    } else {
      response = new Mirage.Response(404);
    }

    return response;
  });

  this.get('/current_user', function(schema) {
    var current_user = schema.currentUsers.first();
    if (current_user) {
      return current_user;
    } else {
      return new Mirage.Response(401);
    }
  });

  this.put('/current_user', function({ db, currentUsers }, request) {
    var id = 1;
    var currentUser;

    const contentType = request.requestHeaders['content-type'] || request.requestHeaders['Content-Type'] || "";

    if(contentType.indexOf('application/json') > -1) {

      var putData = JSON.parse(request.requestBody);
      var attrs = putData['current_user'];
      currentUser = currentUsers.find(id);
      currentUser.update(attrs);
    } else {
      currentUser = currentUsers.find(id);
    }

    // Sync location string
    if(currentUser.locationId) {
      var location = db.locations.find(currentUser.locationId);
      var locationString = `${location.city}, ${location.state}`;
      currentUser.location = locationString;
    }

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
    const startParam = moment(params.start_date, 'YYYY-MM-DD') || moment().format('YYYY-MM-DD');

    let results = filterCollectionByDate(eventInstances, startParam, params.date_end);

    const meta = {
      total: results.models.length,
      total_pages: Math.ceil( results.models.length / params.per_page )
    };
    results.models = results.models.slice(start, stop);

    let response = this.serializerOrRegistry.serialize(results, request);


    response.meta = meta;
    return new Mirage.Response(200, {}, response);

  });

  this.get('/event_instances/active_dates', function({ eventInstances }, request) {
    const params = request.queryParams;
    const startParam = moment(params.start_date, 'YYYY-MM-DD');

    let results = filterCollectionByDate(eventInstances, startParam, params.date_end);
    let sortedResults = results.sort((a, b) => {
      var dateA = a.startsAt;
      var dateB = b.startsAt;

      if (moment(dateA).isBefore(dateB)) {
        return -1;
      }
      if (moment(dateA).isAfter(dateB)) {
        return 1;
      }

      return 0;
    });
    let eventDays = sortedResults.models.map((event) => {
      return moment(event.startsAt).format('YYYY-MM-DD');
    });

    const eventCountsByDay = eventDays.reduce((totalEvents, date) => {
      if(date in totalEvents) {
        totalEvents[date] ++;
      } else {
        totalEvents[date] = 1;
      }
      return totalEvents;
    }, {});

    const daysWithEvents = Object.keys(eventCountsByDay).map((date) => {
      return { date: date, count: eventCountsByDay[date] };
    });

    return new Mirage.Response(200, {}, {active_dates: daysWithEvents});
  });

  // Locations
  this.get('/locations', function({locations}, request) {
    if('radius' in request.queryParams) {
      const limit = parseInt(request.queryParams.radius || 1);
      return {locations: locations.all().models.slice(0, parseInt(limit))};
    } else {
      return locations.all();
    }
  });

  this.get('/locations/locate', function ({ locations }) {
    return locations.first() || locations.create({id: 'Nowhere, VT', city: 'Nowhere', state: 'VT'});
  });

  this.get('/locations/:id', function ({ locations }, { params }) {
    const defaultAppLocation = 'sharon-vt';
    let location = locations.findBy({id: params.id});

    if(!location && params.id === defaultAppLocation) {
      location = server.create('location', {
        id: 'sharon-vt',
        city: 'sharon',
        state: 'vt'
      });
    }

    return location;
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
  this.get('/organizations', function(schema, request) {
    let organizations;

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    if ('query' in request.queryParams && request.queryParams.query.indexOf('empty') === 0) {
      organizations = [];
    } else if ('ids' in request.queryParams) {
      organizations = schema.organizations.all().filter((org) => {
        return request.queryParams.ids.indexOf(String(org.id)) !== -1;
      });
    } else if ('subtext_certified' in request.queryParams) {
      organizations = schema.organizations.all().filter((org) => {
        return org.certifiedSocial || org.certifiedStoryteller;
      });
    } else {
      organizations = schema.organizations.all();
    }
    return organizations;
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

  this.get('/event_categories', function() {
    return {'event_categories':[
      {'name':'Category1', 'slug':'Category1'},
      {'name':'Category2', 'slug':'Category2'},
      {'name':'Category3', 'slug':'Category3'}
    ]};
  });

  // Used by the event creation page to find enues
  this.get('/venues', function({ db }, request) {
    let venues = [];

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    const query = request.queryParams.query;
    if (query && query.indexOf('empty') !== 0) {
      venues = db.venues;
    }

    return {
      venues: venues
    };
  });

  this.get('/venues/:id/location', function({locations}) {
    const all_locations =  locations.all();
    return {locations: all_locations[Math.floor(Math.random()*all_locations.length)]};
  });

  this.del('/content_locations/:id', {}, 200);

  this.get('/comments');
  this.post('/comments');

  this.get('/contents/:id/similar_content', function({ contents }) {
    const allContents = contents.all();
    return {
      similar_content: allContents.models.slice(5)
    };
  });

  this.get('/promotions', (db, request) => {
    let limit = parseInt(request.queryParams.limit || 1);
    let promotions = [];

    for(var i = 0; i < limit; i++) {
      promotions.push({
        id: faker.random.number(1000),
        image_url: `https://placehold.it/600x500/61e49c/ffffff/&text=Ad`,
        redirect_url: `http://${faker.internet.domainName()}`,
        advertiser: faker.company.companyName,
        promotion_id: faker.random.number(1000)
      });
    }

    return {promotions:promotions};
  });

  this.get('/promotion_coupons/:id', function({db}, request) {
    return {promotionCoupon: db.promotionCoupons.find(request.params.id)};
  });

  this.post('/promotion_coupons/:id/request_email', function() {
    return true;
  });

  this.post('/promotion_banners/:id/track_click', function() {});
  this.post('/promotion_banners/:id/track_load', function() {});
  this.post('/promotion_banners/:id/impression', function() {});

  this.post('/ad_metrics', function() {});

  this.get('/market_categories', function({ db }) {
    return { marketCategories: db.marketCategories };
  });

  this.get('/market_categories/:id', function({ db }, request) {
    const marketCategory = db.marketCategories.find(request.params.id);

    return { marketCategory: marketCategory };
  });

  this.post('/password_resets', function() {
    return {};
  });

  this.put('/password_resets', function() {
    return {};
  });

  this.get('/password_resets/:token', function() {
    return {};
  });

  this.post('metrics/contents/:id/impressions', function() { return {}; });

  this.post('metrics/profiles/:id/impressions', function() { return {}; });

  this.get('/weather', function() {
    const weather = '<div class="pull-left has-tooltip" data-title="Powered by Forecast.io" id="forecast"><a href="http://forecast.io/#/f/43.7153482,-72.3078690" target="_blank">80° Clear</a></div><div class="pull-left" id="forecast_icon"><i class="wi wi-day-sunny"></i></div>';
    return new Mirage.Response(200, {'Content-Type': 'text/html'}, weather);
  });

  this.post('/images', function({ db }) {
    const image = db.images.insert({
      id: faker.random.number(1000),
      content_id: faker.random.number(100),
      primary: false,
      url: 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200'
    });

    return {
      image: image
    };
  });

  this.post('/images/upsert', function({ db }) {
    const image = db.images.insert({
      id: faker.random.number(1000),
      content_id: faker.random.number(100),
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
        return ids.includes(category.id.toString());
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

  // Listserv Digests
  this.get('/digests');
  this.post('/digests');
  this.get('/digests/:id');
  this.put('/digests/:id');
  this.del('/digests/:id');

  // Listserv Subscriptions
  this.get('/subscriptions');
  this.post('/subscriptions');
  this.get('/subscriptions/:id');
  this.put('/subscriptions/:id');
  this.del('/subscriptions/:id');

  this.delete('/subscriptions/:id/:token', () => {
    return new Mirage.Response(204);
  });

  this.patch('/subscriptions/:id/confirm', function() {
    return {};
  });

  this.patch('/subscriptions/:id/unsubscribe', function() {
    return {};
  });

  this.post('/registrations/confirmed', function({db, currentUsers}, request) {
    var putData = JSON.parse(request.requestBody);
    var attrs = putData['registration'];
    currentUsers.create(attrs);

    db.currentUsers.remove();
    var current_user = currentUsers.create(attrs);
    //mocks location join
    var location = db.locations.find(current_user.location_id);
    var locationString = `${location.city}, ${location.state}`;
    current_user.location = locationString;

    return {
      email: current_user.email,
      token: "f688d44f-3e2e-4b37-8493-4cfe9503e858"
    };
  });

  this.get('/listservs');
  this.get('/listservs/:id');

  this.get('/features');

  this.get('/contents/:id/promotions', function() {
    return {};
  });

  this.get('/users/:id/comments', function({comments}, request) {
    const { page, per_page } = request.queryParams;
    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
    const endIndex = startIndex + parseInt(per_page);

    let response = {};

    let myStuffComments = comments.all().filter((comment) => {
      return parseInt(get(comment, 'userId')) === parseInt(request.params.id);

    });

    response = this.serialize(myStuffComments.slice(startIndex, endIndex));

    response.meta = {
      total: myStuffComments.length,
      total_pages: Math.ceil( myStuffComments.length / per_page )
    };

    return new Mirage.Response(200, {}, response);
  });

  this.get('/users/:id/contents', function({feedItems}, request){
    const { page, per_page } = request.queryParams;
    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
    const endIndex = startIndex + parseInt(per_page);

    let response = {};

    let myStuffContents = feedItems.all().filter((feedItem) => {
      if (feedItem.modelType === 'content') {
          return parseInt(get(feedItem.content, 'authorId')) === parseInt(request.params.id);
        }
        return false;
    });

    response = this.serialize(myStuffContents.slice(startIndex, endIndex));

    response.meta = {
      total: myStuffContents.length,
      total_pages: Math.ceil( myStuffContents.length / per_page )
    };

    return new Mirage.Response(200, {}, response);
  });

  this.get('/users/:id/bookmarks', function({bookmarks}) {
    let response = this.serialize(bookmarks.all());

    return new Mirage.Response(200, {}, response);
  });

  this.post('/users/:id/bookmarks', function({bookmarks}) {
    let attrs = this.normalizedRequestAttrs();
    attrs.id = attrs.contentId;
    return bookmarks.create(attrs);
  });
  this.put('/users/:id/bookmarks/:id', function({bookmarks}) {
    let attrs = this.normalizedRequestAttrs();
    const bookmark = bookmarks.find(attrs.id);

    return bookmark.update(attrs);
  });
  this.delete('/users/:id/bookmarks/:id', function() {
    return new Mirage.Response(204);
  });

  this.get('/feed', function({db, feedItems}, request) {
    const typeMap = {
      stories: 'news',
      calendar: 'event',
      news: 'news',
      event: 'event',
      market: 'market',
      talk: 'talk'
    };

    const { page, per_page, content_type, query, organization_id } = request.queryParams;
    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
    const endIndex = startIndex + parseInt(per_page);

    let response;

    const showProfilePageContents = isPresent(organization_id);
    const justShowOneContentType = isPresent(content_type) && isBlank(query);

    if (showProfilePageContents) {
      let organizationFeedItems = feedItems.all().filter((feedItem) => {
        return feedItem.modelType === 'content' && feedItem.organizationId === organization_id;
      });

      response = this.serialize(organizationFeedItems.slice(startIndex, endIndex));

      response.meta = {
        total: organizationFeedItems.length,
        total_pages: Math.ceil( organizationFeedItems.length / per_page )
      };

    } else if (justShowOneContentType) {
      let oneContentTypeFeedItems;

      if (content_type === 'organization') {
        oneContentTypeFeedItems = feedItems.all().filter((feedItem) => {
          return feedItem.modelType === 'organization';
        });
      } else {
        oneContentTypeFeedItems = feedItems.all().filter((feedItem) => {
          if (feedItem.modelType === 'content') {
            return get(feedItem.content, 'contentType') === typeMap[ content_type ];
          }
          return false;
        });
      }

      response = this.serialize(oneContentTypeFeedItems.slice(startIndex, endIndex));

      response.meta = {
        total: oneContentTypeFeedItems.length,
        total_pages: Math.ceil( oneContentTypeFeedItems.length / per_page )
      };

    } else {
      response = this.serialize(feedItems.all().slice(startIndex, endIndex));
      response.meta = {
        total: feedItems.all().length,
        total_pages: Math.ceil( feedItems.all().length / per_page )
      };
    }

    return new Mirage.Response(200, {}, response);
  });

  this.post('/contents', function({schedules, contents, eventInstances}) {
    let attrs = this.normalizedRequestAttrs();
    const scheduleAttrs = attrs['schedules'];

    delete attrs['schedules'];
    const content = contents.create(attrs);


    if(isPresent(scheduleAttrs)) {
      scheduleAttrs.forEach((data) => {
        data['content'] = content;
        schedules.create(data);
      });
    }

    if(content.contentType === 'event') {
      let eventInstance = eventInstances.first();
      if(!isPresent(eventInstance)) {
        eventInstance = eventInstances.create(attrs);
        eventInstance.startsAt = (new Date()).toISOString();
      }

      content.eventInstanceId = eventInstance.id;
    }

    return content;
  });

  this.get('/contents/:id');

  this.put('/contents/:id', function({schedules, contents, eventInstances}, {params}) {
    let attrs = this.normalizedRequestAttrs();
    const scheduleAttrs = attrs['schedules'];
    const content = contents.find(params.id);

    delete attrs['schedules'];

    content.update(attrs);

    if(content.contentType === 'event') {
      if(isPresent(scheduleAttrs)) {
        scheduleAttrs.forEach((data) => {
          data['content'] = content;
          schedules.create(data);
        });
      }
    }
    return content;
  });

  this.get('/content_permissions', function(db, request) {
    const responseObj = {content_permissions: []};
    if (request.queryParams['content_ids'] != null) {
      request.queryParams['content_ids'].forEach(function(content_id) {
        responseObj['content_permissions'].push({content_id: content_id, can_edit: true});
      });
    }
    return responseObj;
  });

}
