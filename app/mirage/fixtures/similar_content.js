import moment from 'moment';

function titleize(words) {
  return words.split(' ').map((word) => {
    return word.capitalize();
  }).join(' ');
}

// I'm not totally sure what this "other content" is, but I do know that it
// will not have an event_instance_id. In those cases, we are linking to the
// external content_url, instead of an event in this app.
function generateOtherContent(id) {
  return {
    content_id: id,
    content_url: `http://${faker.internet.domainName()}`,
    title: titleize(faker.lorem.sentences(1)),
    author: faker.name.findName(),
    pubdate: moment().toISOString(),
    content: faker.lorem.paragraph(1)
  };
}

function generateEventContent(id) {
  return {
    content_id: id,
    event_instance_id: id,
    content_url: `http://${faker.internet.domainName()}`,
    title: titleize(faker.lorem.sentences(1)),
    author: faker.name.findName(),
    pubdate: moment().toISOString(),
    content: faker.lorem.paragraph(1)
  };
}

function allSimilarContent() {
  const content = [];

  for (let i = 1; i < 4; i += 1) {
    content.push(generateEventContent(i));
    content.push(generateOtherContent(i+100));
  }

  return content;
}

export default allSimilarContent();
