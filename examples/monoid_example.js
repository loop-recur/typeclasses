require('../support/functional');
require('../support/prelude');
require('../support/types');
require('../monoid');

newType(Number, "Sum");
newType(Number, "Product");
newType(Number, "Max");
newType(Number, "Min");
newType(Boolean, "All");
newType(Boolean, "Any");

Monoid(Sum, {
  mempty: function(){ return Sum(0) },
  mappend: function(x,y){ return Sum(x.val + y.val); }
});

Monoid(Product, {
  mempty: function(){ return Product(1) },
  mappend: function(x,y){ return Product(x.val * y.val); }
});

Monoid(Max, {
  mempty: function(){ return Max(0) },
  mappend: function(x,y){ return (x.val > y.val) ? x : y; }
});

Monoid(Min, {
  mempty: function(){ return Min(9007199254740992) }, // highest possible integer i guess...
  mappend: function(x,y){ return (x.val < y.val) ? x : y; }
});

Monoid(Any, {
  mempty: function(){ return Any(false) },
  mappend: function(x,y){ return Any(oror(x.val, y.val)) }
});

Monoid(All, {
  mempty: function(){ return All(true) },
  mappend: function(x,y){ return All(andand(x.val, y.val)) }
});

Monoid(Maybe, {
  mempty: function(){ return Maybe(null) },
  mappend: function(x,y){
    if(!x.val) return y;
    if(x.val && !y.val) return x;
    return Maybe(mappend(x.val, y.val));
  }
});

console.log("start function");

var getFirstName = function(x){
  return x.first_name;
}
var getMiddleName = function(x){
  return x.middle_name;
}
var getLastName = function(x){
  return x.last_name;
}

var r = mconcat(getFirstName, getMiddleName, getLastName);

var result = r({first_name: false,
                middle_name: false,
                last_name: true});

console.log('result is', result);

console.log('default number:');
var r = mconcat(1, 2, 3, 4, 5);
console.log(r);

console.log('default array:');
var r = mconcat([1,2,3], [4,5]);
console.log(r);

console.log('default boolean:')
var r = mconcat(false, false, true);
console.log(r);

console.log('default object:')
var r = mconcat({a: 1, b:"4"}, {a: 3, b:"5", c:3});
console.log(r);

console.log('default function:');
var f = mappend(test(/^a/i), test(/y$/i));
var r = filter(f, ["Adam", "Bo", "Jenny", "Frank"]);
console.log(r);

console.log("Maybe Sum:");
var r = mconcat(Maybe(Sum(3)), Maybe(Sum(4)), Maybe(Sum(4)));
console.log(r);

console.log("Maybe:");
var r = mconcat(Maybe(null), Maybe(3));
console.log(r);

console.log("Sum:")
var r = mconcat(Sum(1), Sum(2));
console.log(r);

console.log("product:")
var r = mappend(Product(1),Product(2));
console.log(r);

console.log("All:")
var r = mconcat(All(true),All(false));
console.log(r);

console.log('Any:')
var r = mconcat(Any(false),Any(true));
console.log(r);

console.log('Min:')
var r = mconcat(Min(11), Min(13), Min(4), Min(5));
console.log(r);



















