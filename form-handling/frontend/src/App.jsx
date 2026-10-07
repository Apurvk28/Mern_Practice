import React, { useState } from 'react';

function App() {
  const [title, settitle] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("form submitted with name:", title);
    settitle('');
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input 
          type="text"
          placeholder="enter your name"
          value={title}
          onChange={(e) => {
            settitle(e.target.value);
            console.log(e.target.value); 
          }}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

export default App;
