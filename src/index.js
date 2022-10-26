import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import breakSound from './break.mp3'

const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
}

const mode = {
  pomodoro: "pomodoro",
  shortBreak: "shortBreak",
  longBreak: "longBreak",
}
const audio = new Audio(breakSound);

let mainButtonClass = "main-button"

class GlobalPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSeconds: 0,
      timerText: '',
      paused: true,
      interval: null,
      breakMode: false,
      sessions: 0,
      mode: null,
    }
  }

  componentDidMount() {
    this.changeMode(mode.pomodoro);
  }

  handleClick(params) {
    if (this.state.paused) {
      mainButtonClass = "main-button-active"
      this.startClock();
    } else {
      mainButtonClass = "main-button"
      this.stopClock();
    }
  }

  startClock() {

    this.setState({
      paused: false,
    })
    const interval = setInterval(() => {
      let seconds = this.state.timeSeconds - 1;
      let breakMode = this.state.breakMode;
      let sessions = this.state.sessions;

      this.setState({
        timeSeconds: seconds
      })

      if (seconds <= 0) {
        if (!breakMode) {
          sessions++;
          breakMode = true;

          if (sessions % timer.longBreakInterval === 0)
            this.changeMode(mode.longBreak)
          // seconds = timer.longBreak * 60;
          else
            this.changeMode(mode.shortBreak)
          // seconds = timer.shortBreak * 60;

        } else {
          breakMode = false;
          this.changeMode(mode.pomodoro)
        }
      }

      this.setState({
        interval: interval,
        breakMode: breakMode,
        sessions: sessions,
      })
      this.updateText(seconds);
    }, 1000);//should be 1000
  }

  stopClock() {

    clearInterval(this.state.interval);
    this.setState({
      paused: true,
    })
  }

  updateText(seconds) {
    const minutes = Math.floor(seconds / 60);
    const timerText = ('0' + minutes.toString()).slice(-2) + ':' + ('0' + (seconds % 60).toString()).slice(-2);
    this.setState({
      timerText: timerText,
    })
  }

  changeMode(modeVar) {
    let seconds

    toast(modeVar.toString());
    // console.log('change mode');

    switch (modeVar) {
      case mode.pomodoro:
        seconds = timer.pomodoro * 60;
        break;
      case mode.shortBreak:
        seconds = timer.shortBreak * 60;
        audio.play()
        break;
      case mode.longBreak:
        seconds = timer.longBreak * 60;
        break;
      default:
        console.error('default case in change Mode ');
        break;
    }
    this.updateText(seconds);
    document.body.style.backgroundColor = `var(--${modeVar})`;

    this.setState({
      timeSeconds: seconds,
      mode: modeVar,
    })

  }
  

  render() {
    const buttonText = this.state.paused ? "Start" : "Stop";
    let pomodoroStyle = 'normal';
    let shortStyle = 'normal';
    let longStyle = 'normal';





    switch (this.state.mode) {
      case mode.pomodoro:
        pomodoroStyle = 'bold';
        break;
        case mode.shortBreak:
          shortStyle = 'bold';
        break;
      case mode.longBreak:
        longStyle = 'bold';
        break;
      default:
        break;
    }
    return React.createElement('div',null,
    <ToastContainer/>,
    React.createElement('div', { className: "timer" },
      React.createElement('div', null,
        React.createElement('button', { className: "mode-button", style: { fontWeight: pomodoroStyle }, onClick: () => { this.changeMode(mode.pomodoro) } }, 'pomodoro'),
        React.createElement('button', { className: "mode-button", style: { fontWeight: shortStyle }, onClick: () => { this.changeMode(mode.shortBreak) } }, 'short break'),
        React.createElement('button', { className: "mode-button", style: { fontWeight: longStyle }, onClick: () => { this.changeMode(mode.longBreak) } }, 'long break'),
      ),
      React.createElement('div', { className: "clock" }, this.state.timerText),
      // React.createElement('div', null, this.state.sessions % 4),
      React.createElement('button', { className: mainButtonClass, onClick: () => { this.handleClick() } }, buttonText),
    ));
  }
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<GlobalPanel />);

