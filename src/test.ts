import { struct } from 'fp-ts/lib/Eq';
import { Eq } from 'fp-ts/lib/Eq';
import { fromCompare } from 'fp-ts/lib/Ord';
import { contramap } from 'fp-ts/lib/Eq';
import { contramap as contramapOrd } from 'fp-ts/lib/Ord';
import { pipe } from 'fp-ts/lib/function';

const eqNumber: Eq<number> = {
  equals: (x, y) => x === y,
};

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some(item => E.equals(item, a));
}

elem(eqNumber)(4, [1, 2, 3]); // false

interface Point {
  x: number;
  y: number;
}

type Vector = {
  from: Point;
  to: Point;
};

const eqPoint: Eq<Point> = struct({
  x: eqNumber,
  y: eqNumber,
});

const test1: Point = {
  x: 10,
  y: 20,
};

const test2: Point = {
  x: 22,
  y: 29,
};

console.log(eqPoint.equals(test1, test2));

type User = {
  userId?: number;
  name: string;
  age?: number;
};

/** two users are equal if their `userId` field is equal */
const eqUser = contramap((user: User) => user.userId)(eqNumber);

eqUser.equals(
  { userId: 1, name: 'Giulio' },
  { userId: 1, name: 'Giulio Canti' }
); // true
eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 2, name: 'Giulio' }); // false

type Ordering = -1 | 0 | 1;

interface Ord<A> extends Eq<A> {
  readonly compare: (x: A, y: A) => Ordering;
}

const ordNumber: Ord<number> = fromCompare((x, y) =>
  x < y ? -1 : x > y ? 1 : 0
);

function min<A>(O: Ord<A>): (x: A, y: A) => A {
  return (x, y) => (O.compare(x, y) === 1 ? y : x);
}

min(ordNumber)(2, 1);

const byAge: Ord<User> = fromCompare((x, y) => ordNumber.compare(x.age, y.age));
const byAgeC: Ord<User> = contramapOrd((user: User) => user.age)(ordNumber);

const getYounger = min(byAge);

getYounger({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 });

const add = (a: number) => (b: number) => a + b;

add(3)(5);

import { flow, identity } from 'fp-ts/function';

const toUpperCase = (x: string) => x.toUpperCase();
const exclaim = (x: string) => `${x}!`;
// note: order here is reversed
const shout = flow(toUpperCase, exclaim);

shout('send in the clowns'); // "SEND IN THE CLOWNS!"

let output = pipe('send in the clowns', toUpperCase, exclaim); // "SEND IN THE CLOWNS!"

// * @example
//  * import { pipe } from 'fp-ts/function'
//  *
//  * const len = (s: string): number => s.length
//  * const double = (n: number): number => n * 2
//  *
//  * // without pipe
//  * assert.strictEqual(double(len('aaa')), 6)
//  *
//  * // with pipe
//  * assert.strictEqual(pipe('aaa', len, double), 6)
//  *
//  * @since 2.6.3
//  */
