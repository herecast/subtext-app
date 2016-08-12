export default function(){
  this.transition(
      this.hasClass('DirectoryFeedback-questionBox'),
      this.toValue(function(toValue,fromValue){
        return toValue.index > fromValue.index;
      }),
      this.use('toLeft',{duration:500}),
      this.reverse('toRight',{duration:500})
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
}
