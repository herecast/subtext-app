import Ember from 'ember';
import moment from 'moment';

// This is just a dumb method to make it look like we're doing filtering
function filterByCategory(events, category) {
  if (category === 'everything') {
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

const eventBaseProperties = [
  'id', 'content_id', 'content', 'image_url', 'cost', 'cost_type',
  'venue_name', 'venue_address', 'venue_city', 'venue_state',
  'venue_zipcode', 'venue_id', 'venue_latitude', 'venue_longitude',
  'venue_locate_name', 'venue_url',
  'event_url', 'contact_phone', 'contact_email',
  'title', 'subtitle', 'ends_at', 'starts_at'
];

export default function() {
  this.namespace = 'api';
  this.timing = 200; // delay for each request, automatically set to 0 during testing

  this.get('/events', function(db, request) {
    const params = request.queryParams;

    // The event index endpoint returns a subset of all available properties
    let events = db.events.map((event) => {
      return Ember.getProperties(event, eventBaseProperties);
    });

    events = filterByCategory(events, params.category);
    events = filterByDate(events, params.startDate, params.stopDate);

    return {
      events: events,
      meta: {
        total: db.events.length
      }
    };
  });

  // Used by the event filter bar to find locations
  this.get('/events/venues', function(db, request) {
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

  this.get('/events/:id', function(db, request) {
    const event = db.events.find(request.params.id);
    const baseProperties = Ember.copy(eventBaseProperties);
    const showProperties = [
      'content_id', 'category'
    ];
    const properties = baseProperties.concat(showProperties);

    return {
      event: Ember.getProperties(event, properties)
    };
  });

  this.get('/event_instances');

  this.post('/events');

  this.post('/events/:id/publish', function(db, request) {
    db.events.update(request.params.id, {published: true});
    const event = db.events.find(request.params.id);

    return {
      event: Ember.getProperties(event, eventBaseProperties)
    };
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
}
