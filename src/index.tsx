import React from 'react';
import ReactDOM from 'react-dom';
import Form from './form';

const App = () => {
  return (
    <div>
      <Form></Form>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
