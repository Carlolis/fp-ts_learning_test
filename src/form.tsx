import axios from 'axios';
import * as E from 'fp-ts/lib/Either';
import { absurd, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import React, { useState } from 'react';

interface LoginData {
  username: string;
  password: string;
}

interface LoginPayload {
  token: string;
}

const LoginError = t.literal('wrongCredential');

type LoginError = t.TypeOf<typeof LoginError>;

const FormError = t.union([
  t.literal('noEmail'),
  t.literal('passwordTooShort'),
]);

type FormError = t.TypeOf<typeof FormError>;

export default function Form() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (data: LoginData) => {
    const url = 'http://localhost:8080/api/authenticate';

    const asyncLogin = (url: string, data: LoginData) =>
      TE.tryCatch<LoginError, LoginPayload>(
        () => axios.post(url, data),
        reason => 'wrongCredential'
      );

    const handleErrorLogin = (error: LoginError) => {
      switch (error) {
        case 'wrongCredential':
          alert(error);
          break;
        default:
          // Absurd ensures all cases are handled.
          absurd(error);
      }
    };

    const handleErrorForm = (error: FormError) => {
      switch (error) {
        case 'noEmail':
          alert(error);
          break;
        case 'passwordTooShort':
          alert(error);
          break;
        default:
          // Absurd ensures all cases are handled.
          absurd(error);
      }
    };

    const handleSuccess = (payload: LoginPayload) => {
      setIsPending(false);
      setUsername('');
      setPassword('');
      alert(`payload: ${JSON.stringify(payload, null, 2)}`);
    };

    const passwordValidated = (
      data: LoginData
    ): E.Either<FormError, LoginData> => {
      return data.password.length > 3
        ? E.right(data)
        : E.left('passwordTooShort');
    };

    const emailValidated = (
      data: LoginData
    ): E.Either<FormError, LoginData> => {
      return data.username.length !== 0 ? E.right(data) : E.left('noEmail');
    };

    const validateForm = (data: LoginData): E.Either<FormError, LoginData> => {
      return pipe(passwordValidated(data), E.chain(emailValidated));
    };

    // chain => https://rlee.dev/practical-guide-to-fp-ts-part-2 ?

    /**
     * Composes computations in sequence, using the return value of one computation to determine the next computation.
     *
     */
    pipe(
      validateForm(data),
      E.fold(handleErrorForm, data => {
        setIsPending(true);
        pipe(
          asyncLogin(url, data),
          TE.mapLeft(handleErrorLogin),
          TE.map(handleSuccess)
        )();
      })
    );
  };

  return (
    <div className='search-params'>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit({ username, password });
        }}
      >
        <label htmlFor='location'>
          Email
          <input
            id='email'
            onChange={e => setUsername(e.target.value)}
            value={username}
            placeholder='username'
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='email'
          ></input>
        </label>
        <button disabled={isPending}>Submit</button>
      </form>
    </div>
  );
}
