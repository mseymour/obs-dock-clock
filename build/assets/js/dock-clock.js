/*globals OBSWebSocket*/
import ClockDisplay from './clock-display';
import Alert from './alert';

/**
 * DockClock Class
 *
 * Here we do all of the fancy websocket and DOM things to create a nice-looking
 * clock to use in either an OBS browser dock or in a standalone browser!
 */
export default class DockClock {
  /**
   * Constructor method
   * @constructor
   * @param element  The target element of the class for generating the clock
   * @param [options]  The options for the class
   */
  constructor(element, options = {}) {
    this.initialTime = new Date();

    const default_options = {
      address:     'localhost:4444',
      password:    '',
      interval_ms: 1000,
      // interval_ms: 500,
    };

    this.element = element;
    this.options = Object.assign({}, default_options, options);

    this.obs = new OBSWebSocket();

    this.clocks = [];

    this.interval = null;

    this.isStreaming = false;
    this.streamTime  = null;
    this.isRecording = false;
    this.recordTime  = null;

    this.setup();
  }

  /**
   * Starts the clock
   */
  setup() {
    let self = this;

    this.obs.connect({
      address:  this.options.address,
      password: this.options.password,
    })
    .then(() => {
      // Set up clock
      this.clockSetUp();
    })
    .catch(err => {
        console.error('Promise error:', err);
        const alert = new Alert({
          title:       err.error,
          description: err.description
        });
        alert.display();
    });

    this.obs.on('AuthenticationSuccess', data => {
      // Set up tick
      self.interval = setInterval(() => {
        self.tick();
      }, self.options.interval_ms);
    });

    this.obs.on('StreamStatus', data => {
      self.isStreaming = data.streaming;
      self.streamTime  = data.totalStreamTime;
      self.isRecording = data.recording;
      self.recordTime  = data.totalRecordTime;
    });

    this.obs.on('error', err => {
      console.error('Socket error:', err);
      const alert = new Alert({
        title: err.error,
        description: err.description
      });
      alert.display();
    });

    this.obs.on('ConnectionClosed', data => {
      self.destroy();
      const alert = new Alert({
        title: 'Connection Closed',
        description: 'OBS was closed.'
      });
      alert.display();
    });
  }

  /**
   * Set up individual clock
   */
  clockSetUp() {
    // Clock container, display
    let container = document.querySelector('#clock');
    this.clocks.push(new ClockDisplay(container, 'Local Time', 'clock'));
    this.clocks.push(new ClockDisplay(container, 'Timer', 'timer', this.initialTime));
  }

  /**
   * A single clock tick.
   */
  tick() {
    this.clocks.forEach(clock => clock.update());
  }

  /**
   * Destroys the clock.
   */
  destroy() {
    console.debug('Disonnecting from WebSocket and stopping clock...');
    clearInterval(this.interval);
    this.obs.disconnect();
  }
}
