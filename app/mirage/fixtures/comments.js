import moment from 'moment';

function generateComment(id) {
  return {
    id: id,
    content: faker.lorem.paragraph(1),
    user_name: faker.name.findName(),
    posted_at: moment(faker.date.recent(10)).toISOString(),
    comments: [{
      id: faker.random.number(100),
      user_name: faker.name.findName(),
      content: faker.lorem.paragraph(1),
      posted_at: moment(faker.date.recent(10)).toISOString(),
      comments: [{
        id: faker.random.number(100),
        user_name: faker.name.findName(),
        content: faker.lorem.paragraph(1),
        posted_at: moment(faker.date.recent(10)).toISOString()
      }]
    }]
  };
}

function allComments() {
  const events = [];

  for (let i = 1; i < 8; i += 1) {
    events.push(generateComment(i));
  }

  return events;
}

export default allComments();
