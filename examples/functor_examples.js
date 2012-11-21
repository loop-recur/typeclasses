require('../support/functional');
require('../support/prelude');
require('../support/types');
require('../functor');

// Array

var r = fmap(function(x){ return x+1 }, [1,2,3]);
console.log(r);
//=> [2,3,4]

var r = fmap(reverse, ['bingo', 'pajama']);
console.log(r);
//=> ['ognib', 'amajap']



// MAYBE

var Maybe = Constructor(function(val){
  this.val = val;
});

Functor(Maybe, {
  fmap: function(f) {
    return this.val ? Maybe(f(this.val)) : Maybe(null);
  }
});

var r = fmap(replace(/-/g, ''), Maybe(null));
console.log(r);
//=> Maybe(null)

var r = fmap(replace(/-/g, ''), Maybe("123-456-789"));
console.log(r);
//=> Maybe(123456789)

var r = fmap(function(letters){ return letters[0]; }, Maybe('abc'));
console.log(r);
//=> Maybe('a')

var r = fmap(first, Maybe('abc'));
console.log(r);
//=> Maybe('a')



// Logger

var Logger = Constructor(function(x){
  this.val = x;
});

Functor(Logger, {
  fmap: function(f) {
    console.log('logger: value is '+this.val);
    var result = f(this.val);
    console.log('logger: result is '+result);
    return Logger(result);
  }
});

var r = fmap(last, Logger('abc'));
console.log(r);
//=> Maybe('c')



// Composed!

var holy_crap = Array(Maybe(Logger(3)),
                      Maybe(Logger(4)),
                      Maybe(null));

var fmap3 = function(f, x) {
  return fmap(fmap(fmap(f)), x);
}

var r = fmap3(function(n){ return n + 2; }, holy_crap);
console.log(r);
// logger: value is 3
// logger: result is 5
// logger: value is 4
// logger: result is 6
//=> [ Maybe(Logger(5)), Maybe(Logger(6)), Maybe(null) ]
