<? 
echo "Hello, World";


$me = new Human(strtotime('1991-12-15'));

$me->sayName(); // "maasa yoshida"


while($me->isLive()){
  $me->work();

  if($me->isSleepy()){
    sleep(60 * 60 * 6);
  }
}
