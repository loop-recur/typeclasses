Functor = function(type, defs) {
  type.prototype.fmap = defs.fmap;
}

fmap = function(f, obj) {
  return obj.fmap(f);
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

Functor(Maybe, {
  fmap: function(f) {
    if(falsy(this.val)) return this;
    return Maybe(f(this.val));
  }
});

Functor(Either, {
  fmap: function(f) {
    if(falsy(this.right)) return this;
    return Either(this.left, f(this.right));
  }
});

Functor(ZipList, {
  fmap: function(f) {
    return ZipList(this.val.map(function(x){
      return f(x);
    }));
  }
});
