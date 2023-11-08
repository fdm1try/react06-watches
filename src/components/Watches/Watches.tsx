import './Watches.css';
import { Component } from 'react';

export interface IWatches {
  name: string;
  timezone: string;
  onClick?: () => void;
}

interface IState {
  unixTime: number;
}

export class Watches extends Component<IWatches, IState> {
  active: boolean = true;
  timezoneOffset: number = 0;
  state: IState = { unixTime: 0 };

  static parseTimezoneOffset(timezone: string): number {
    const match = /(GMT|UTC)(([+-])(\d{1,2})(:\d{1,2})?)?/.exec(timezone);
    console.log(match);
    if (!match) throw new Error('Invalid timezone format!');
    const sign: string = match[3] ? match[3] : '';
    const hours: number = match[4] ? Number(`${sign}${match[4]}`) : 0;
    if (hours > 14 || hours < -12) 
      throw new Error('Hours are specified outside the time zone range!');
    const minutes: number = match[5] ? Number(`${sign}${match[5].slice(1,)}`) : 0;
    if ([0, 30, 45].indexOf(minutes) === -1) 
      throw new Error('Minutes are specified outside the time zone range!');
    return (hours * 60) + minutes;
  }

  constructor(props: IWatches) {
    super(props);
    this.updateLoop = this.updateLoop.bind(this);
  }

  updateLoop() {
    if (!this.active) return;
    const timestamp = Math.floor((new Date()).getTime() / 1000) + this.timezoneOffset;
    if (this.state.unixTime !== timestamp) {
      this.setState({...this.state, unixTime: timestamp});
    }
    window.requestAnimationFrame(this.updateLoop);
  }

  componentDidMount() {
    this.active = true;
    this.timezoneOffset = Watches.parseTimezoneOffset(this.props.timezone) * 60;
    this.updateLoop();
  }

  componentWillUnmount() {
    this.active = false;
  }

  componentDidUpdate(prevProps: Readonly<IWatches>): void {
    if (prevProps.timezone !== this.props.timezone) {
      this.timezoneOffset = Watches.parseTimezoneOffset(this.props.timezone) * 60;
    }
  }

  render() {
    const elapsed = this.state.unixTime % (86_400);
    const hours = elapsed / 3_600;
    const minutes = (elapsed % 3_600) / 60;
    const seconds = elapsed % 60;
    return (
      <div className='watches' onClick={this.props.onClick}>
        <div style={{ transform: `rotate(${30 * (hours % 12)}deg)` }} className='watches-arrow-hours'></div>
        <div style={{ transform: `rotate(${6 * minutes}deg)` }} className='watches-arrow-minutes'></div>
        <div style={{ transform: `rotate(${6 * seconds}deg)` }} className='watches-arrow-seconds'></div>
        <div className='watches-daytime'>{hours < 12 ? 'AM' : 'PM'}</div>
        <div className='watches-digit watches-digit_12'>12</div>
        <div className='watches-digit watches-digit_3'>3</div>
        <div className='watches-digit watches-digit_6'>6</div>
        <div className='watches-digit watches-digit_9'>9</div>
      </div>
    )
  }
}
