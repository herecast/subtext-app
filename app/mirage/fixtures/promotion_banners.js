import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  const startsAt = moment(faker.date.recent(-30));
  const imageUrl = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=750%C3%97250&w=750&h=250';

  return {
    id: id,
    title: titleize(faker.lorem.sentences(1)),
    click_count: faker.random.number(8),
    pubdate: startsAt.toISOString(),
    impression_count: faker.random.number(1000),
    image_url: imageUrl,
    redirect_url: "http://thelymeinn.com/"
  };
}

export default generateData(50, template);
