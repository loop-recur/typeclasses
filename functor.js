;(function (window, global_module, global_exports, undefined) {
  var functor = {}

  //+ xmod :: Module
    , xmod = global_exports ? require('./support/xmod') : window.xmod

    , Functor = function(type, defs) {
        type.prototype.fmap = defs.fmap;
      }

    , fmap = function(f, obj) {
        return obj.fmap(f);
      }.autoCurry()
    ;

  functor.fmap = fmap;
  functor.Functor = Functor;

// Some default instances:

Functor(Array, {
  fmap: function(f){
    return this.map(function(x){
      return f(x);
    });
  } // expand map function with lambda since map passes index in which messes with curried functions
});

Functor(Function, {
  fmap: function(f){
    var g = this;
    return function(x){
      return f(g(x));
    }
  }
});

// Functor(Maybe, {
//   fmap: function(f) {
//     if(falsy(this.val)) return this;
//     return Maybe(f(this.val));
//   }
// });

// Functor(Either, {
//   fmap: function(f) {
//     if(falsy(this.right)) return Either(f(this.left), this.right);
//     return Either(this.left, f(this.right));
//   }
// });

// Functor(ZipList, {
//   fmap: function(f) {
//     return ZipList(this.val.map(function(x){
//       return f(x);
//     }));
//   }
// });

  // Attach references to helper functions and then export the module
  functor.expose = function(){ xmod.expose(window, functor) };
  xmod.exportModule('functor', functor, global_module, global_exports);

}(this, (typeof module == 'object' && module), (typeof exports == 'object' && exports)));
