import Ember from 'ember';
import moment from 'moment';

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
  'venue_locate_name', 'venue_url',
  'event_url', 'contact_phone', 'contact_email',
  'title', 'subtitle', 'ends_at', 'starts_at'
];

const marketPostBaseProperties = [
  'id', 'title', 'image_url', 'published_at'
];

const talkBaseProperties = [
  'id', 'title', 'author_image_url', 'published_at', 'user_count',
  'pageviews_count', 'author_name'
];

const newsBaseProperties = [
  'id', 'title', 'content_snippet', 'published_at', 'author_id', 'author_name',
  'publication_name','publication_id', 'image_url'
];

export default function() {
  this.namespace = 'api/v1';
  this.timing = 200; // delay for each request, automatically set to 0 during testing

  this.get('/current_user', function() {
    const createdAt = moment(faker.date.recent(-30));

    return {
      current_user: {
        id: 1,
        name: faker.name.findName(),
        email: faker.internet.email(),
        created_at: createdAt.toISOString(),
        location: 'Norwich, VT',
        test_group: 'Consumer',
        listserv_id: 1,
        listserv_name: 'Norwich Listserv'
      }
    };
  });

  this.get('/event_instances', function(db, request) {
    const params = request.queryParams;

    // The event index endpoint returns a subset of all available properties
    let events = db.event_instances.map((event) => {
      return Ember.getProperties(event, eventBaseProperties);
    });

    events = filterByCategory(events, params.category);
    events = filterByDate(events, params.date_start, params.date_end);

    return {
      event_instances: events
    };
  });

  // Used by the event filter bar to find locations
  this.get('/locations', function(db, request) {
    const locations = [];

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    if (request.queryParams.query.indexOf('empty') !== 0) {
      for (let i = 1; i < 5; i += 1) {
        locations.push(faker.address.streetAddress());
      }
    }

    return {
      locations: locations
    };
  });

  // Used by the news filter bar to find publications
  this.get('/publications', function(db, request) {
    const publications = [];

    // For demo purposes - if someone starts a search with 'empty' we return
    // no results so we can see what that looks like in the UI
    if (request.queryParams.query.indexOf('empty') !== 0) {
      for (let i = 1; i < 5; i += 1) {
        publications.push(faker.company.companyName());
      }
    }

    return {
      publications: publications
    };
  });

  this.get('/event_instances/:id', function(db, request) {
    const event = db.event_instances.find(request.params.id);
    const baseProperties = Ember.copy(eventBaseProperties);
    const showProperties = ['content_id', 'can_edit', 'event_id', 'admin_content_url'];
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

    data.event_instances = db.event_instances.slice(0,3);

    return {
      event: data
    };
  });

  this.post('/events', function(db, request) {
    const putData = JSON.parse(request.requestBody);

    const eventAttrs = putData['event'];
    const event = db.events.insert(eventAttrs);

    const instanceAttrs = putData['event']['event_instances'];
    const instances = db.event_instances.insert(instanceAttrs);

    event.event_instances = instances;
    event.event_instances.forEach((instance) => {
      instance.can_edit = true;
      instance.event_id = event.id;
    });

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

  this.post('/events/:id/moderate', function() {
    return { };
  });

  this.post('/comments/:id/moderate', function() {
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

  this.get('/similar_content', function(db) {
    return {
      similar_content: db.similar_content
    };
  });

  this.get('/related_promotion', function() {
    return {
      related_promotion: {
        redirect_url: `http://${faker.internet.domainName()}`
      }
    };
  });

  this.get('/market_posts', function(db, request) {
    const params = request.queryParams;

    let posts = db.market_posts.map((post) => {
      return Ember.getProperties(post, marketPostBaseProperties);
    });

    posts = filterByDate(posts, params.date_start, params.date_end);

    return {
      market_posts: posts
    };
  });

  this.get('/market_posts/:id');

  this.post('/market_posts', function(db, request) {
    const putData = JSON.parse(request.requestBody);

    const attrs = putData['market_post'];
    const post = db.talks.insert(attrs);

    // This is so we show the edit button on the post show page
    post.can_edit = true;

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

  this.get('/talk', function(db, request) {
    const params = request.queryParams;

    let talks = db.talks.map((talk) => {
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

    let news = db.news.slice(0,14).map((article) => {
      return Ember.getProperties(article, newsBaseProperties);
    });

    news = filterByDate(news, params.date_start, params.date_end);

    return {
      news: news
    };
  });

  this.get('/news/:id');
}
