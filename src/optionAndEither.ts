import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
type Account = { balance: number };

// withdraw :: Number -> Account -> Maybe(Account)
const withdraw =
  (amount: number) =>
  ({ balance }: Account): O.Option<Account> =>
    balance >= amount ? O.some({ balance: balance - amount }) : O.none;

//Theorie
const updateLedger = (account: Account) => account;

// remainingBalance :: Account -> String
const remainingBalance = ({ balance }: Account) =>
  `Your balance is $${balance}`;

// finishTransaction :: Account -> String
const finishTransaction = flow(updateLedger, remainingBalance);

// getTwenty :: Account -> String
const getTwenty = flow(
  withdraw(20),
  O.fold(() => "You're broke!", finishTransaction)
);

//Si on ne veut pas de sortie (message d'erreur) => O.map(finishTransaction). Ne fait rien si O._tag = "none"

getTwenty({ balance: 200.0 });
// 'Your balance is $180.00'

getTwenty({ balance: 10.0 });
// 'You\'re broke!'

// withdraw :: Number -> Account -> Either(string,Account)
const withdrawEither =
  (amount: number) =>
  ({ balance }: Account): E.Either<string, Account> =>
    balance >= amount
      ? E.right({ balance: balance - amount })
      : E.left("You're broke!");

function onLeft(errors: string): string {
  return `${errors}`;
}
// getTwenty :: Account -> String
const getTwentyEither = flow(
  withdrawEither(20),
  E.fold(onLeft, finishTransaction)
);

// string
const getTwentyEitherPipe = pipe(
  { balance: 100.0 },
  withdrawEither(20),
  E.fold(onLeft, finishTransaction)
);

console.log(getTwentyEitherPipe);

console.log(getTwentyEither({ balance: 100.0 }));
