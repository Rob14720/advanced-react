import React from 'react'

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
    };
  }

  // Helper function to get x and y coordinates
  getXY() {
    const x = (this.state.index % 3) + 1;
    const y = Math.floor(this.state.index / 3) + 1;
    return { x, y };
  }

  // Helper function to calculate the next index based on the direction
  getNextIndex(direction) {
    const currentIndex = this.state.index;
    let nextIndex = currentIndex;

    switch (direction) {
      case 'up':
        if (currentIndex - 3 >= 0) {
          nextIndex = currentIndex - 3;
        } else {
          this.setState({ message: "You can't go up" });
        }
        break;
      case 'down':
        if (currentIndex + 3 < 9) {
          nextIndex = currentIndex + 3;
        } else {
          this.setState({ message: "You can't go down" });
        }
        break;
      case 'left':
        if (currentIndex % 3 !== 0) {
          nextIndex = currentIndex - 1;
        } else {
          this.setState({ message: "You can't go left" });
        }
        break;
      case 'right':
        if ((currentIndex + 1) % 3 !== 0) {
          nextIndex = currentIndex + 1;
        } else {
          this.setState({ message: "You can't go right" });
        }
        break;
      default:
        break;
    }

    return nextIndex;
  }

  // Event handler for moving the square
  move(direction) {
    const nextIndex = this.getNextIndex(direction);
    console.log(nextIndex)
    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
      }));
    }
  }

  // Event handler for resetting the state
  reset() {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
    });
  }

  // Event handler for changing the email input
  onChange(evt) {
    this.setState({ email: evt.target.value });
  }

  // Event handler for submitting the form
  async onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = this.getXY();

    // Construct payload
    const payload = {
      x,
      y,
      steps: this.state.steps,
      email: this.state.email,
    };

    // POST request to the server
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
        this.setState({ message: result.message, email: initialEmail });
        console.log(this.state);
      } else {
        const error = await response.json();
        this.setState({ message: error.message });
      }
    } catch (error) {
      console.error(error);
      this.setState({ message: 'An error occurred.' });
    }
  }

  render() {
    const { message, email, steps, index } = this.state;
    const { x, y } = this.getXY();
    const coordinatesMessage = `Coordinates (${x}, ${y})`;

    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">{coordinatesMessage}</h3>
          <h3 id="steps">You moved {steps} {steps === 1 ? 'time': 'times'}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === index ? ' active' : ''}`}
            >
              {idx === index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move('up')}>
            UP
          </button>
          <button id="right" onClick={() => this.move('right')}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move('down')}>
            DOWN
          </button>
          <button id="reset" onClick={() => this.reset()}>
            Reset
          </button>
        </div>
        <form onSubmit={(evt) => this.onSubmit(evt)}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={email}
            onChange={(evt) => this.onChange(evt)}
          />
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}

export default AppClass;