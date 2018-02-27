export default function(){
  this.transition(
    this.hasClass('disclose'),

    this.use('toDown',{duration:300}),
    this.reverse('toUp',{duration:300})
  );

  this.transition(
    this.fromRoute('directory.search.results'),
    this.toRoute('directory.show'),

    this.use('toLeft',{duration:300}),
    this.reverse('toRight',{duration:300})
  );

  this.transition(
    this.hasClass('useFade'),

    this.use('fade')
  );

  this.transition(
    this.hasClass('filtertray'),

    this.toValue(true),
    this.use('toLeft', {duration: 300}),
    this.reverse('toRight', {duration: 300})
  );

  this.transition(
    this.hasClass('search'),

    this.toValue(true),
    this.use('toLeft', {duration: 300}),
    this.reverse('toRight', {duration: 300})
  );


  this.transition(
    this.hasClass('Mystuff-toLeft'),
    this.use('toLeft', {duration: 300})
  );
  this.transition(
    this.hasClass('Mystuff-toRight'),
    this.use('toRight', {duration: 300})
  );
}
