import React from 'react';
// TBD Animation
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { BubbleSteps } from './bubble';

class Visualizer extends React.Component {

  INITIAL_STATE = { step: -1, list: props.list, delay: 1000 };

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
      console.log('start invoke steps', step, this.steps.length, 'refs', this.timeoutRef, this.intervalRef);
      if (step >= this.steps.length > 0) {
        this.stop();
      } else {
        if (this.timeoutRef == null) {
          this.next();
        }
      }
    }
    this.intervalRef = setInterval(invoke.bind(this), this.state.delay);
  }

  stop() {
    console.log('stop');
    const ref = this.intervalRef;
    if (ref) {
      setTimeout(() => { console.log('stop - ref', ref); clearInterval(ref); }, this.state.delay);
    }
    this.intervalRef = null;
  }

  clear() {
    console.log('clear', this.intervalRef, this.timeoutRef);
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
    this.intervalRef = null;
    console.log('clear end', this.timeoutRef, this.intervalRef);
  }

  delay(e) {
    const delay = e.target.value;
    console.log('delay', delay);
    this.setState({ delay });
  }

  cssName(current, index) {
    const action = (index == current.i || index == current.j) ? current.action : '';
    const anchored = (current.i == index) ? 'anchored' : '';
    return action + ' ' + anchored;
  }

  componentWillUnmount() {
    this.clear();
  }

  render() {
    const { step, list, delay } = this.state;
    const current = this.steps[step] || {};

    const disabled = (step >= this.steps.length > 0);
    const disabled_next = disabled || !!this.timeoutRef;
    const disabled_start = disabled || !!this.timeoutRef || !!this.intervalRef;
    const disabled_stop = disabled || 0 > step || !this.intervalRef; // note!
    const disabled_delay = disabled_start;
    return (
      <div className="visualizer">
        <div className="list">
          {list.map((item, index) =>
            <div className={this.cssName(current, index)} key={index}>{item}</div>
          )}
        </div>

        <button onClick={() => this.next()} disabled={disabled_next}>next</button>
        <button onClick={() => this.start()} disabled={disabled_start}>{(step < 0) ? 'start' : 'resume'}</button>
        <button onClick={() => this.stop()} disabled={disabled_stop}>stop</button>

        <label htmlFor="delay" className={(disabled_delay?'disabled':'')}>Speed <input type="range" id="delay" min="0" max="3000" step="100" value={delay} title={delay} onChange={(e) => this.delay(e)} disabled={disabled_delay} /> {delay}</label>

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





