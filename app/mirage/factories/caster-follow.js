import { Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  casterName() { return faker.name.findName(); },
  casterHandle() { return faker.internet.userName(); },
  casterAvatarImageUrl () {
    var randomNumber = Math.random();
    return (randomNumber > 0.5) ? null : 'https://via.placeholder.com/200x200.png?text=200x200';
  },
  casterId(){ return faker.random.number(999); }
});
