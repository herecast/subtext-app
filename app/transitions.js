export default function(){
  this.transition(
      this.hasClass('DirectoryFeedback-questionBox'),
      this.toValue(function(toValue,fromValue){
        return toValue.index > fromValue.index;
      }),
      this.use('toLeft',{duration:500}),
      this.reverse('toRight',{duration:500})
    );
}
