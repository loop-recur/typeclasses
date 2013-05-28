require('../support/functional');
require('../support/prelude');
require('../support/types');
require('../functor');
require('../applicative');

var fireEvent = function(){ console.log.apply(this, arguments); }; // for easy demo.

// curried funs for examples
var add = function(x,y) { return x + y; }.autoCurry();
var div = function(x,y) { return x / y; }.autoCurry();
var multiply = function(x,y){ return x * y; }.autoCurry()

Observable = Constructor(function(x) {
  this.val = x;
});

Functor(Observable, {
  fmap: function(f) {
    var new_val = f(this.val);
    if(this.val != new_val) fireEvent('changed', {val: new_val, previous_val: this.val});
    return Observable(new_val);
  }
});

Applicative(Observable, {
  pure: Observable,
  ap: function(o2) {
    return fmap(this.val, o2);
  }
});

var r = liftA(add, Observable(1), Observable(2))
console.log(r);

var r = pure(add).ap(Observable(1)).ap(Observable(2));
console.log(r);

var r = ap(pure(add), Observable(1), Observable(2));
console.log(r);



var r = pure(add).ap(Maybe(1)).ap(Maybe(2))
console.log(r);

var r = liftA(add, Maybe(1), Maybe(null));
console.log(r);




var r = ap([add(1), add(2)], [2,3])
console.log(r)

var r = ap(pure(add), ["ha","heh","hmm"], ["?","!","."])
console.log(r)

var r = [add, add].ap([2,3]).ap([4,5]);
console.log(r)


var r = liftA(add, [1,2], [3,4])
console.log(r)

var r = [add, multiply].ap([1,2]).ap([3,4]);
console.log(r)




var r = ZipList(add('hello'), add('goodbye')).ap(ZipList('world', 'horses'))
console.log(r)

var r = ap(ZipList(add('hello'), add('goodbye')), ZipList('world', 'horses'))
console.log(r)

var r = ZipList(add, add).ap(ZipList(1,2)).ap(ZipList('a','b'))
console.log(r)

var r = liftA(add, ZipList(1,2), ZipList(2,4));
console.log(r)



