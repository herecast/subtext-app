import Ember from 'ember';
import moment from 'moment';

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

function filterByDate(events, startDate, endDate) {
  if (!!startDate && !!endDate) {
    const queryStart = moment(startDate);
    const queryEnd = moment(endDate).endOf('day');

    return events.filter((event) => {
      const eventStart = moment(event.starts_at);
      const eventEnd = moment(event.ends_at);

      return (eventStart >= queryStart && eventStart <= queryEnd) ||
        (eventEnd >= queryStart && eventEnd <= queryEnd);
    });
  } else {
    return events;
  }
}

function titleize(words) {
  return words.split(' ').map((word) => {
    return word.capitalize();
  }).join(' ');
}

function generateInstance(id) {
  // All events start at a random time between 7am and 12pm
  const startHour = faker.random.number({min: 7, max: 12});
  const startsAt = moment(faker.date.recent(-30)).hour(startHour).minute(0).second(0);

  // All are up to 8 hours long so they don't go past midnight
  const hourSpan = faker.random.number({min: 2, max: 8});
  const endsAt = moment(startsAt).add(hourSpan, 'hours');

  return {
    id: id,
    subtitle: titleize(faker.lorem.sentences(1)),
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString()
  };
}

function allInstances() {
  const events = [];

  for (let i = 1; i < 10; i += 1) {
    events.push(generateInstance(i));
  }

  return events;
}

const eventBaseProperties = [
  'id', 'content_id', 'content', 'image_url', 'cost', 'cost_type',
  'venue_name', 'venue_address', 'venue_city', 'venue_state',
  'venue_zip', 'venue_id', 'venue_latitude', 'venue_longitude',
  'venue_locate_name', 'venue_url', 'registration_deadline',
  'registration_url', 'registration_phone', 'registration_email',
  'event_url', 'contact_phone', 'contact_email',
  'title', 'subtitle', 'ends_at', 'starts_at', 'event_id'
];

const marketPostBaseProperties = [
  'id', 'title', 'image_url', 'published_at', 'content_id'
];

const talkBaseProperties = [
  'id', 'title', 'author_image_url', 'published_at', 'commenter_count',
  'view_count', 'author_name'
];

const newsBaseProperties = [
  'id', 'title', 'content', 'published_at', 'author_id', 'author_name',
  'publication_name','publication_id', 'image_url'
];

function mixedContent(db) {
  const contents = [];

  db.news.slice(0,2).map((item) => {
    const record = Ember.getProperties(item, newsBaseProperties);
    record.content_type = 'news';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    contents.push(record);
  });

  db.talks.slice(0,2).map((item) => {
    const record = Ember.getProperties(item, talkBaseProperties);
    record.content_type = 'talk_of_the_town';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    contents.push(record);
  });

  db.market_posts.slice(0,1).map((item) => {
    const record = Ember.getProperties(item, marketPostBaseProperties);
    record.content_type = 'MarketPost';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    contents.push(record);
  });

  db.event_instances.slice(0,3).map((item) => {
    const record = Ember.getProperties(item, eventBaseProperties);
    record.content_type = 'event';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    contents.push(record);
  });

  db.market_posts.slice(0,2).map((item) => {
    const record = Ember.getProperties(item, marketPostBaseProperties);
    record.content_type = 'market';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    contents.push(record);
  });

  db.event_instances.slice(0,1).map((item) => {
    const record = Ember.getProperties(item, eventBaseProperties);
    record.content_type = 'Event';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    contents.push(record);
  });

  db.talks.slice(0,2).map((item) => {
    const record = Ember.getProperties(item, talkBaseProperties);
    record.content_type = 'Comment';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    contents.push(record);
  });

  db.market_posts.slice(0,1).map((item) => {
    const record = Ember.getProperties(item, marketPostBaseProperties);
    record.content_type = 'market';
    record.view_count = faker.random.number(100);
    record.comment_count = faker.random.number(100);
    contents.push(record);
  });

  return contents;
}


export default function() {
  this.namespace = 'api/v3';
  this.timing = 200; // delay for each request, automatically set to 0 during testing

  this.post('/users/sign_in', function() {
    return {
      token: "FCxUDexiJsyChbMPNSyy",
      email: "embertest@subtext.org"
    };
  });

  this.post('/users/sign_up', function() {
  });

  this.post('/users/logout', function() {});

  this.get('/current_user', function(db) {
    var current_user = db.current_users.find(1);

    //mocks location join
    var location = db.locations.find(current_user.location_id);
    var locationString = `${location.city}, ${location.state}`;
    current_user.location = locationString;

    return {
      current_user: current_user
    };
  });

  this.put('/current_user', function(db, request) {
    var id = 1;
    var putData = JSON.parse(request.requestBody);
    var attrs = putData['current_user'];
    var current_user = db.current_users.update(id, attrs);

    //mocks location join
    var location = db.locations.find(current_user.location_id);
    var locationString = `${location.city}, ${location.state}`;
    current_user.location = locationString;

    return {
      current_user: current_user
    };
  });

  this.post('/users/email_confirmation', function() {
    return {
      token: "FCxUDexiJsyChbMPNSyy",
      email: "embertest@subtext.org"
    };
  });

  this.get('/event_instances', function(db, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    // The event index endpoint returns a subset of all available properties
    let events = db.event_instances.map((event) => {
      return Ember.getProperties(event, eventBaseProperties);
    });

    events = filterByCategory(events, params.category);
    events = filterByDate(events, params.date_start, params.date_end);
    events = events.slice(start, stop);

    return {
      event_instances: events
    };
  });

   // Used in the user dashboard to find locations
  this.get('/locations', function(db) {
    return {
      locations: db.locations
    };
  });


  // Used by the event filter bar to find locations
  this.get('/venue_locations', function(db, request) {
    const venue_locations = [];

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    if (request.queryParams.query.indexOf('empty') !== 0) {
      for (let i = 1; i < 5; i += 1) {
        venue_locations.push(faker.address.streetAddress());
      }
    }

    return {
      venue_locations: venue_locations
    };
  });

  // Used by the news filter bar to find publications
  this.get('/publications', function(db, request) {
    const publications = [];

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    if (request.queryParams.query.indexOf('empty') !== 0) {
      for (let i = 1; i < 5; i += 1) {
        publications.push({
          id: i,
          name: faker.company.companyName()
        });
      }
    }

    return {
      publications: publications
    };
  });

  this.get('/event_instances/:id', function(db, request) {
    const event = db.event_instances.find(request.params.id);
    const baseProperties = Ember.copy(eventBaseProperties);
    const showProperties = ['content_id', 'can_edit', 'admin_content_url', 'comment_count'];
    const properties = baseProperties.concat(showProperties);
    const data = Ember.getProperties(event, properties);
    data.event_instances = allInstances();

    return {
      event_instance: data
    };
  });

  this.get('/events/:id', function(db, request) {
    const event = db.events.find(request.params.id);
    const baseProperties = Ember.copy(eventBaseProperties);
    const showProperties = [
      'content_id', 'category'
    ];
    const properties = baseProperties.concat(showProperties);
    const data = Ember.getProperties(event, properties);

    data.schedules = db.schedules;

    return {
      event: data
    };
  });

  this.post('/events', function(db, request) {
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

  this.post('/events/:id/publish', function(db, request) {
    db.events.update(request.params.id, {published: true});
    const event = db.events.find(request.params.id);

    return {
      event: Ember.getProperties(event, eventBaseProperties)
    };
  });

  this.post('/contents/:id/moderate', function() {
    return { };
  });

  this.put('/events/:id', function(db, request) {
    if (request && request.requestBody && typeof request.requestBody === 'string') {
      var id = request.params.id;
      var putData = JSON.parse(request.requestBody);
      var attrs = putData['event'];
      var data = db.events.update(id, attrs);
      return data;
    } else {
      // We're using the UPDATE action to upload event images after the event
      // has been created. Mirage can't really handle this, so we ignore it.
      console.log('Ignoring image upload');
    }
  });

  this.del('/events/:id');

  // Used by the event creation page to find venues
  this.get('/venues', function(db, request) {
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

  this.get('/contents/:id/similar_content', function(db) {
    return {
      similar_content: mixedContent(db)
    };
  });

  this.get('/contents/:content_id/related_promotion', function() {
    return {
      related_promotion: {
        image_url: 'https://placeholdit.imgix.net/~text?txtsize=31&txt=BannerAd&w=750&h=150',
        redirect_url: `http://${faker.internet.domainName()}`
      }
    };
  });

  this.get('/market_posts', function(db, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    let posts = db.market_posts.slice(start,stop).map((post) => {
      return Ember.getProperties(post, marketPostBaseProperties);
    });

    posts = filterByDate(posts, params.date_start, params.date_end);

    return {
      market_posts: posts
    };
  });

  this.get('/market_posts/:id');

  this.get('/market_posts/:id/contact', function(db, request) {
    const post = db.market_posts.find(request.params.id);

    return {
      market_post: {
        id: post.id,
        contact_phone: faker.phone.phoneNumber(),
        contact_email: faker.internet.email()
      }
    };
  });

  this.post('/market_posts', function(db, request) {
    const putData = JSON.parse(request.requestBody);

    const attrs = putData['market_post'];
    const post = db.market_posts.insert(attrs);

    // This is so we show the edit button on the post show page
    post.can_edit = true;
    post.content_id = post.id;

    return {
      market_post: post
    };
  });

  this.put('/market_posts/:id', function(db, request) {
    if (request && request.requestBody && typeof request.requestBody === 'string') {
      var id = request.params.id;
      var putData = JSON.parse(request.requestBody);
      var attrs = putData['market_post'];
      var data = db.market_posts.update(id, attrs);
      return data;
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
    return {};
  });

  this.get('/password_resets/:token', function() {
    return {};
  });

  this.get('/talk', function(db, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    let talks = db.talks.slice(start, stop).map((talk) => {
      return Ember.getProperties(talk, talkBaseProperties);
    });

    talks = filterByDate(talks, params.date_start, params.date_end);

    return {
      talk: talks
    };
  });

  this.get('/talk/:id');

  this.post('/talk', function(db, request) {
    const putData = JSON.parse(request.requestBody);

    const attrs = putData['talk'];
    const talk = db.talks.insert(attrs);

    // This is so we show the edit button on the talk show page
    talk.can_edit = true;

    return {
      talk: talk
    };
  });

  this.put('/talk/:id', function(db, request) {
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

  this.get('/news', function(db, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    let news = db.news.slice(start,stop).map((article) => {
      return Ember.getProperties(article, newsBaseProperties);
    });

    news = filterByDate(news, params.date_start, params.date_end);

    return {
      news: news
    };
  });

  this.get('/news/:id');

  this.get('/contents', function(db) {
    return {
      contents: mixedContent(db)
    };
  });

  this.get('/dashboard', function(db, request) {
    const params = request.queryParams;
    const stop = (params.page * params.per_page);
    const start = stop - params.per_page;

    return {
      contents: mixedContent(db).slice(start, stop)
    };
  });

  this.get('/weather', function() {
    const weather = '<div class="pull-left has-tooltip" data-title="Powered by Forecast.io" id="forecast"> \
    <a href="http://forecast.io/#/f/43.7153482,-72.3078690" target="_blank"> \
    80° Clear \
    </a> \
    </div> \
    <div class="pull-left" id="forecast_icon"> \
    <i class="wi wi-day-sunny"></i> \
    </div>';

    return weather;
  });

  this.post('/images', function(db) {
    const image = db.images.insert({
      id: faker.random.number(1000)
    });

    return {
      image: image
    };
  });

  this.put('/images/:id', function(db, request) {
    const id = request.params.id;
    const image = db.images.update(id, {});

    return {
      image: image
    };
  });
}
