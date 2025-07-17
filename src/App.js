import React from "react";

//React.Component is the parent class.
// It gives us a couple of methods and one of them is the render() method.Every single react component that is written with classes needs to include this method.This method is equivalent to the function body of a function component.It returns some JSX.
//In class component if we want to add some state, first call the constructor, it receives props and calls the parent constructor as well by using the super() method.
class Counter extends React.Component {
  constructor(props) {
    super(props);

    //initialising state
    //In class components there is a huge state object and not multiple state variables like in functional component
    this.state = { count: 5 };
  }

  render() {
    return (
      <div>
        <button>-</button>
        <span>
          {
            //'this' points to the current component instance
            this.state.count
          }
        </span>
        <button>+</button>
      </div>
    );
  }
}

export default Counter;
