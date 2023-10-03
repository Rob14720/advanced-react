import React, { useState } from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;
const limitReachedMessage = "You can't go";

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getNextIndex(direction) {
    const currentIndex = index;
    let nextIndex = currentIndex;

    switch (direction) {
      case 'up':
        nextIndex = currentIndex - 3 >= 0 ? currentIndex - 3 : currentIndex;
        if (nextIndex === currentIndex) {
          setMessage(`${limitReachedMessage} up`);
        } else {
          setMessage(initialMessage);
        }
        break;
      case 'down':
        nextIndex = currentIndex + 3 < 9 ? currentIndex + 3 : currentIndex;
        if (nextIndex === currentIndex) {
          setMessage(`${limitReachedMessage} down`);
        } else {
          setMessage(initialMessage);
        }
        break;
      case 'left':
        nextIndex = currentIndex % 3 !== 0 ? currentIndex - 1 : currentIndex;
        if (nextIndex === currentIndex) {
          setMessage(`${limitReachedMessage} left`);
        } else {
          setMessage(initialMessage);
        }
        break;
      case 'right':
        nextIndex = (currentIndex + 1) % 3 !== 0 ? currentIndex + 1 : currentIndex;
        if (nextIndex === currentIndex) {
          setMessage(`${limitReachedMessage} right`);
        } else {
          setMessage(initialMessage);
        }
        break;
      default:
        break;
    }

    return nextIndex;
  }

  function move(direction) {
    const nextIndex = getNextIndex(direction);
    if(nextIndex !== index){
      setIndex(nextIndex);
      setSteps((prevSteps) => prevSteps + 1);
    }
    
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY();

    const payload = {
      x,
      y,
      steps,
      email,
    };

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
        setEmail('');
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred.');
    }
  }

  const { x, y } = getXY();
  const coordinatesMessage = `Coordinates (${x}, ${y})`;
  const stepsMessage = steps === 1 ? '1 time' : `${steps} times`;

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{coordinatesMessage}</h3>
        <h3 id="steps">You moved {stepsMessage}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>
          LEFT
        </button>
        <button id="up" onClick={() => move('up')}>
          UP
        </button>
        <button id="right" onClick={() => move('right')}>
          RIGHT
        </button>
        <button id="down" onClick={() => move('down')}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}