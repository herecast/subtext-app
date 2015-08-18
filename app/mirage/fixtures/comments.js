import moment from 'moment';

function generateComment(id) {

  const userImageUrl = (id % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200' : null;

  return {
    id: id,
    content: `<p><p>${faker.lorem.paragraph(1)}</p></p>`,
    parent_content_id: faker.random.number(1000),
    user_name: faker.name.findName(),
    user_image_url: userImageUrl,
    posted_at: moment(faker.date.recent(10)).toISOString()
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
