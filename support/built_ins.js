require("./functional");
require("./prelude");
require('./types');
require('../functor').expose();
require('../applicative');
require('../monad');

Maybe = makeType('Maybe');
Either = Constructor(function(left, right){
  this.left = left;
  this.right = right;
});

//+ maybe :: b -> (a -> b) -> Maybe a -> b
maybe = function(f, g, x) {
	return x.val ? g(x.val) : f();
}.autoCurry();

//+ either :: (a -> c) -> (b -> c) -> Either a b -> c
either = function(f,g,x) {
    return x.right ? g(x.right) : f(x.left);
}.autoCurry();

// Some default instances:

Functor(Array, {
  fmap: function(f){
    return this.map(function(x){
      return f(x);
    });
  } // expand map function with lambda since map passes index in which messes with curried functions on applicatives
});

Functor(Function, {
  fmap: function(f){ return compose(f, this); }
});


//TODO write expose for all common requires and uncomment

Functor(Maybe, {
  fmap: function(f) {
    if(!this.val) return this;
    return Maybe(f(this.val));
  }
});

Functor(Either, {
  fmap: function(f) {
    if(!this.right) return this;
    return Either(this.left, f(this.right));
  }
});


Applicative(Array, {
  pure: Array, // needs to be infinate to be correct ziplist
  ap: function(a2) {
    return flatten(this.map(function(f){
      return a2.map(function(a){ return f(a); })
    }));
  }
});

Applicative(Function, {
  pure: K,
  ap: function(g){
    var f = this;
    return function(x) {
      return f(x, g(x));
    }
  }
});

Applicative(Maybe, {
  pure: Maybe,
  ap: function(m){
    var f = this.val;
    return f ? fmap(f, m) : Maybe(null);
  }
});


Monad(Maybe, {
  mjoin: function() {
    return falsy(this.val) ? Maybe(null) : this.val;
  },
  mresult: function(x){ return Maybe(x); }
});
