import React from 'react';
// TBD Animation
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { BubbleSteps } from './bubble';

class Visualizer extends React.Component {

  INITIAL_STATE = { step: -1, list: props.list };

  constructor(props) {
    super(props);
    this.timeoutRef = null;
    this.steps = BubbleSteps(props.list);
    this.state = this.INITIAL_STATE;
  }

  restart() {
    console.log('restart');
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }
    this.timeoutRef = null;
    this.clear();
    this.setState(this.INITIAL_STATE);
  }

  next() {
    const { step, list } = this.state;
    const { steps } = this;
    // console.log(step, this.timeoutRef);
    let _step = Math.min(steps.length, step + 1);

    const current = steps[_step] || {};
    if (current.action == 'swap') {
      this.timeoutRef = null;
      // then update state.list
      const { i, j } = current;
      let _list = list.slice(0, i).concat(
        [list[j]],
        list.slice(i + 1, j),
        [list[i]],
        list.slice(j + 1));

      this.setState({ step: _step, list: _list });
    } else {
      if (current.action == 'swap-show') {
        this.timeoutRef = setTimeout(this.next.bind(this), 1000);
      }
      this.setState({ step: _step });
    }
  }

  start() {
    console.log('start');
    function invoke() {
      const { step } = this.state;
      console.log('start invoke', step, this.steps.length, this.timeoutRef);
      if (step >= this.steps.length > 0) {
        this.stop();
      } else {
        if (this.timeoutRef == null) {
          this.next();
        }
      }
    }
    this.intervalRef = setInterval(invoke.bind(this), 1000);
  }

  stop() {
    console.log('stop');
    setTimeout(this.clear.bind(this), 0);
  }

  clear() {
    console.log('clear', this.intervalRef, this.timeoutRef);
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
    this.intervalRef = null;
    console.log('clear end', this.timeoutRef, this.intervalRef);
  }

  cssName(current, index) {
    let action = (index == current.i || index == current.j) ? current.action : '';
    let anchored = (current.i == index) ? 'anchored' : '';
    return action + ' ' + anchored;
  }

  componentWillUnmount() {
    this.clear();
  }

  render() {
    const { step, list } = this.state;
    const current = this.steps[step] || {};
    return (
      <div className="visualizer">
        <div className="list">
          {list.map((item, index) =>
            // TBD Animation ReactCSSTransitionGroup
            <div className={this.cssName(current, index)} key={index}>{item}</div>
          )}
        </div>

        <button onClick={() => this.next()} disabled={step >= this.steps.length > 0 || !!this.timeoutRef}>next</button>
        <button onClick={() => this.start()} disabled={step >= this.steps.length > 0 || !!this.timeoutRef || !!this.intervalRef}>{(step < 0) ? 'start' : 'resume'}</button>
        <button onClick={() => this.stop()} disabled={0 > step || step >= this.steps.length > 0 || !this.intervalRef}>stop</button>

        <div className="status">
          {(step >= 0) && <em>{`${step} / ${this.steps.length}`}</em>}
          <span className="action">{current.action}</span>
          <span>{current.i}</span>
          <span>{current.j}</span>
          {(step >= 0) && <button onClick={() => this.restart()}>restart</button>}
        </div>
      </div>
    );
  };
}

export default Visualizer;





