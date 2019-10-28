import { isBlank, isPresent } from '@ember/utils';
import { get } from '@ember/object';
import moment from 'moment';
import Mirage, { faker } from 'ember-cli-mirage';

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
      return itemStart >= moment(queryStart);
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

  this.post('/users/sign_in', function({currentUsers}, request) {
    let user;

    if (request.requestBody.indexOf('{') >= 0) {
      //json
      let json = JSON.parse(request.requestBody)['user'];
      if (json['email']) {
        user = currentUsers.where({email: json['email']}).models[0];
      } else {
        user = currentUsers.first();
      }
    } else {
      let emailMatcher = /user\[email\]=([\w.\-_@]+)/i;
      let matches = decodeURIComponent(request.requestBody).match(emailMatcher);

      if(matches) {
        let email = matches[1];
        user = currentUsers.where({email: email}).models[0];
      } else {
        user = currentUsers.first();
      }
    }

    if(user) {
      currentUsers.create(user.attrs);
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

  this.post('/users/sign_up', function(db, request) {
    const json = JSON.parse(request.requestBody);
    const password = json.user.password || '';

    if (password.length < 8) {
      return new Mirage.Response(422, {'Content-Type': 'application/json'}, {error: `password length too short: 8 character minimum. Password provided was only ${password.length} characters.`});
    }

    const user = json['user'] || false;

    if (user) {
      db.currentUsers.create({
        email: user.email,
        handle: user.handle,
        locationId: user.location_id,
        name: user.name
      });

      return {
        token: "FCxUDexiJsyChbMPNSyy",
        email: user.email
      };
    }

    return new Mirage.Response(200, {}, {});
  }, { timing: 1500 });


  this.post('/users/logout', function(schema) {
    schema.db.currentUsers.remove();
    return new Mirage.Response(200, {}, {});
  });

  this.post('/users/:user_id/publisher_agreements', function() {
    return new Mirage.Response(200, {}, {});
  }, { timing: 1500 });


  this.get('/user/', function({currentUsers}, request) {
    const email = request.queryParams.email;
    const isACurrentUser = isPresent(currentUsers.findBy({email}));
    const bloggerOnboardingMatches = email === 'blog@blog.com' || email === 'test@test.com';
    let response;

    if (bloggerOnboardingMatches || isACurrentUser) {
      response = new Mirage.Response(200, {}, {});
    } else {
      response = new Mirage.Response(404, {}, {});
    }

    return response;
  }, { timing: 1000 });

  this.get('/current_user', function({currentUsers}) {
    var current_user = currentUsers.first();

    if (current_user) {
      return current_user;
    } else {
      return new Mirage.Response(401, {}, {});
    }
  });

  this.put('/current_user', function({currentUsers}, request) {
    var id = 1;
    var currentUser;

    const contentType = request.requestHeaders['content-type'] || request.requestHeaders['Content-Type'] || "";

    if (contentType.indexOf('application/json') > -1) {

      var putData = JSON.parse(request.requestBody);
      var attrs = putData['current_user'] || [];

      if (attrs.location_id) {
        delete attrs.location;
        attrs.locationId = attrs.location_id;
      }
      currentUser = currentUsers.find(id);
      currentUser.update(attrs);
    } else {
      currentUser = currentUsers.find(id);
    }

    return currentUser;
  });


  this.post('/users/resend_confirmation', function() {
    return {
      token: "FCxUDexiJsyChbMPNSyy",
      email: "embertest@subtext.org"
    };
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
  //  const startParam = moment(params.start_date, 'YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    let startParam;
    if (isPresent(params.start_date)) {
      startParam = moment(params.start_date, 'YYYY-MM-DD');
    } else {
      startParam =  moment().format('YYYY-MM-DD');
    }

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
    if('query' in request.queryParams) {
      const sliceStart = Math.floor(Math.random() * Math.floor(20));
      const sliceEnd = sliceStart + Math.floor(Math.random() * Math.floor(10));
      return {locations: locations.all().models.slice(sliceStart, sliceEnd)};
    } else {
      return locations.all();
    }
  });

  this.get('/locations/locate', function ({ locations }) {
    return locations.first() || locations.create({id: 'Nowhere, VT', city: 'Nowhere', state: 'VT'});
  });

  this.get('/locations/:id', function ({ locations }, { params }) {
    let location = locations.findBy({id: params.id});

    if (!location) {
      location = locations.create('location', {id: params.id});
    }

    return location;
  });

  // Used by the event filter bar to find locations
  this.get('/venue_locations', function(schema, request) {
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

  this.get('/event_instances/:id', function({eventInstances}, request) {
    return eventInstances.find(request.params.id) || {};
  });

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

  this.get('/comments', function({comments}) {
    const contentComments = comments.all().slice(0, 4);
    return contentComments;
  });
  this.post('/comments');

  this.get('/contents/:id/similar_content', function({ contents }) {
    const allContents = contents.all();
    return {
      similar_content: allContents.models.slice(0, 4)
    };
  });

  this.post('/contents/:id/moderate', function() {
    return new Mirage.Response(200, {}, {});
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

    return new Mirage.Response(200, {}, {promotions});
  });

  this.post('/casters/:caster_id/hides', function({casterHides}, request) {
    const caster_hide = JSON.parse(request.requestBody)['caster_hide'] || "";
    const casterHide = casterHides.create(caster_hide)

    return new Mirage.Response(200, {}, casterHide);
  });

  this.del('/casters/hides/:id', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.post('/casters/:caster_id/follows', function({casterFollows}, request) {
    const caster_follow = JSON.parse(request.requestBody)['caster_follow'] || "";
    const casterFollow = casterFollows.create(caster_follow)

    return new Mirage.Response(200, {}, casterFollow);
  });

  this.del('/casters/follows/:id', function() {
    return new Mirage.Response(200, {}, {});
  });


  this.get('/promotion_coupons/:id', function({db}, request) {
    return {promotionCoupon: db.promotionCoupons.find(request.params.id)};
  });

  this.post('/promotion_coupons/:id/request_email', function() {
    return true;
  });

  this.post('/promotion_banners/:id/track_click', function() {
    return new Mirage.Response(200, {}, {});
  });
  this.post('/promotion_banners/:id/track_load', function() {
    return new Mirage.Response(200, {}, {});
  });
  this.post('/promotion_banners/:id/impression', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.post('/ad_metrics', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.get('/market_categories', function({ db }) {
    return { marketCategories: db.marketCategories };
  });

  this.get('/market_categories/:id', function({ db }, request) {
    const marketCategory = db.marketCategories.find(request.params.id);

    return { marketCategory: marketCategory };
  });

  this.post('/password_resets', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.put('/password_resets', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.get('/password_resets/:token', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.post('metrics/profiles/:id', function() {
    return new Mirage.Response(200, {}, {});
   });

  this.post('metrics/contents/:id/impressions', function() {
    return new Mirage.Response(200, {}, {});
   });

  this.post('metrics/profiles/:id/impressions', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.post('metrics/contents/:id/clicks', function() {
    return new Mirage.Response(200, {}, {});
   });

  this.post('metrics/profiles/:id/clicks', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.post('/images', function({ db }) {
    const image = db.images.insert({
      id: faker.random.number(1000),
      content_id: faker.random.number(100),
      primary: false,
      url: 'https://via.placeholder.com/200x200.png?text=200x200'
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


  this.delete('/images/:id', function({ db }, request) {
    const id = request.params.id;
    const image = db.images.remove(id);
    return { image };
  });


  this.get('/contents/:id/metrics', function({ db }){
    return {
      content_metrics: db.contentMetrics[0]
    };
  });

  this.get('/users/:id/payments', function({ db }){
    const random = Math.random();

    let data = {};

    if (random >= 0.67) {
      data = db.contentPayments;
    } else if (random < 0.34) {
      return new Mirage.Response(403);
    }

    return {
      content_payments: data
    };

  });
  this.get('/users/:id/metrics', function({ db }){
    return {
      content_metrics: db.contentMetrics[0]
    };
  });

  this.get('/promotion_banners/:id/metrics', function({ db }){
    return {
      promotion_banner_metrics: db.adMetrics[0]
    };
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

  this.post('/contents/:id/promotions', function() {
    return new Mirage.Response(200, {}, {});
  });

  this.get('/contents/:id/promotions', function() {
    return new Mirage.Response(200, {}, {});
  });


  this.get('/casters/:id/contents', function({feedItems}, request){
    const { page, per_page, commented, caster_feed, drafts } = request.queryParams;
    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
    const endIndex = startIndex + parseInt(per_page);

    let response = {};
    let casterContents;

    if (drafts) {
      casterContents = feedItems.all().filter(() => { return false;});
    } else if (caster_feed) {
      casterContents = feedItems.all().filter(() => { return false;});
    } else if (commented) {
      casterContents = feedItems.all().filter(feedItem => {
        if (feedItem.modelType === 'content') {
          const content = get(feedItem, 'content');
          const comments = get(content, 'comments') || [];

          if (comments.length) {
            const hasMatchingComment = comments.filter(comment => {
              return parseInt(get(comment, 'userId')) === parseInt(request.params.id);
            });

            return hasMatchingComment.length > 0;
          }
        }
        return false;
      });
    } else {
      casterContents = feedItems.all().filter((feedItem) => {
        if (feedItem.modelType === 'content') {
          return parseInt(get(feedItem.content, 'casterId')) === parseInt(request.params.id);
        }
        return false;
      });
    }

    response = this.serialize(casterContents.slice(startIndex, endIndex));
    response.meta = {
      total: casterContents.length,
      total_pages: Math.ceil( casterContents.length / per_page )
    };

    return new Mirage.Response(200, {}, response);
  });

  this.get('/casters/:id/bookmarks', function({bookmarks}) {
    let response = this.serialize(bookmarks.all());

    return new Mirage.Response(200, {}, response);
  });

  this.post('/casters/:id/bookmarks', function({bookmarks}) {
    let attrs = this.normalizedRequestAttrs();
    attrs.id = attrs.contentId;
    return bookmarks.create(attrs);
  });
  this.put('/casters/:id/bookmarks/:id', function({bookmarks}) {
    let attrs = this.normalizedRequestAttrs();
    const bookmark = bookmarks.find(attrs.id);

    return bookmark.update(attrs);
  });
  this.delete('/casters/:id/bookmarks/:id', function() {
    return new Mirage.Response(204);
  });

  this.get('/feed', function({ feedItems}, request) {
    const typeMap = {
      posts: 'news',
      calendar: 'event',
      market: 'market',
    };

    const { page, per_page, content_type, query } = request.queryParams;
    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
    const endIndex = startIndex + parseInt(per_page);

    let response;

    const justShowOneContentType = isPresent(content_type) && isBlank(query);

    if (justShowOneContentType) {
      let oneContentTypeFeedItems;

      oneContentTypeFeedItems = feedItems.all().filter((feedItem) => {
        if (feedItem.modelType === 'content') {
          return get(feedItem.content, 'contentType') === typeMap[ content_type ];
        }
        return false;
      });

      response = this.serialize(oneContentTypeFeedItems.slice(startIndex, endIndex));
      let total=110;
      response.meta = {
        total: total,
        total_pages: Math.ceil( oneContentTypeFeedItems.length / per_page )
      };

    } else {
      response = this.serialize(feedItems.all().slice(startIndex, endIndex));

      let randomNumber = Math.random();
      const pioneerFeedCutoff = 100;


      let total = randomNumber >= 0.5 ? pioneerFeedCutoff + 10 : pioneerFeedCutoff - 10;
      total=110;
      response.meta = {
        total,
        total_pages: Math.ceil( feedItems.all().length / per_page )
      };
    }

    return new Mirage.Response(200, {}, response);
  }, {timing: 1200});

  this.post('/contents', function({schedules, contents, eventInstances}) {
    let attrs = this.normalizedRequestAttrs();
    const scheduleAttrs = attrs['schedules'];

    delete attrs['schedules'];
    const content = contents.create(attrs);

    if (isPresent(scheduleAttrs)) {
      scheduleAttrs.forEach((data) => {
        data['content'] = content;
        schedules.create(data);
      });
    }
    if (content.contentType === 'event') {
      let eventInstance = eventInstances.first();

      if (!isPresent(eventInstance)) {
        eventInstance = eventInstances.create(attrs);
        eventInstance.startsAt = (new Date()).toISOString();
      }

      content.update({
        eventInstanceId: eventInstance.id,
        eventInstanceIds: [eventInstance.id]
      });
    }

    return content;
  }, {timing: 1200});

  this.get('/contents/:id');

  this.put('/contents/:id', function({ schedules, contents }, {params}) {
    let attrs = this.normalizedRequestAttrs();
    const scheduleAttrs = attrs['schedules'];
    const content = contents.find(params.id);

    delete attrs['schedules'];

    content.update(attrs);

    if (content.contentType === 'event') {
      if(isPresent(scheduleAttrs)) {
        scheduleAttrs.forEach((data) => {
          data['content'] = content;
          schedules.create(data);
        });
      }
    }
    return content;
  });

  this.delete('/contents/:id', () => {
    return new Mirage.Response(204);
  }, {timing: 1200});

  this.get('/content_permissions', function(db, request) {
    const responseObj = {content_permissions: []};
    if (request.queryParams['content_ids'] != null) {
      request.queryParams['content_ids'].forEach(function(content_id) {
        responseObj['content_permissions'].push({content_id: content_id, can_edit: true});
      });
    }
    return responseObj;
  });

  this.get('/casters', ({casters}, request) => {
    const rawHandle = request.queryParams.handle;
    const handleWithoutAt = rawHandle.substring(1);

    let caster;

    if (handleWithoutAt === 'me') {
      caster = casters.first();
      caster.update({handle: handleWithoutAt});
    } else {
      caster = this.create('caster');
    }

    return new Mirage.Response(200, {}, caster);
  });

  this.get('/casters/:id', ({casters}, request) => {
    const caster = casters.find(request.params.id);

    return new Mirage.Response(200, {}, caster);
  });

  this.get('/casters/follows', ({casters}) => {
    const casterModels = casters.all();

    return new Mirage.Response(200, {}, casterModels);
  });

  this.post('/current_users/password_validation', function() {
    const responseCode = Math.random() > 0.3 ? 200 : 404;
    return new Mirage.Response(responseCode, {}, {});
  }, {timing: 600});

  this.get('/casters/handles/validation', function() {
    const responseCode = Math.random() > 0.3 ? 200 : 404;
    return new Mirage.Response(responseCode, {}, {});
  }, {timing: 600});


  this.get('/casters/emails/validation', function() {
    const responseCode = Math.random() > 0.3 ? 200 : 404;
    return new Mirage.Response(responseCode, {}, {});
  }, {timing: 600});

}
