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
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  handleDecrement() {
    //console.log(this);//undefined.In other words, the this keyword inside the event handler is undefined.But we need the this keyword to point to the current component instance as we have to update the state.
    //The reason for it being undefined is just the way JS works. When React calls this event handler, behind the scenes it first creates a copy of this function, and hence the function call is just a normal function call which is not bound to any object.This is why the function looses it's binding to the this keyword.
    //In summary, all event handlers called from inside JSX looses its binding to 'this'.


    //setState() works similar to state setter functions we receive from useState hook call.There are two ways to update state:
    //setting state using callback. curState is the entire current state object
    this.setState(curState => {
      return {count: curState.count - 1}
    });

    //setting state by passing the new value.
    // this.setState({count: this.state.count - 1})
  }

  handleIncrement() {
    this.setState(curState => { return {count: curState.count + 1}})
  }

  render() {

    const date = new Date('june 21 2027');
    date.setDate(date.getDate() + this.state.count);

    return (
      <div>
        <button onClick={this.handleDecrement}>-</button>
        <span>
          {
            date.toDateString()
          }
        </span>
        <button onClick={this.handleIncrement}>+</button>
      </div>
    );
  }
}

export default Counter;
