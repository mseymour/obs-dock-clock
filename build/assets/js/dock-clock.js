/*globals OBSWebSocket*/

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
    const default_options = {
      address: 'localhost:4444',
      password: '',
      interval_ms: 500,
    };

    this.element = element;
    this.options = Object.assign({}, options, default_options);

    this.obs = new OBSWebSocket();

    this.intervalMilliseconds = this.options.interval_ms;
    this.interval = null;
  }

  /**
   * Starts the clock
   */
  setup() {
    this.obs.connect({
      address: this.options.address,
      password: this.options.password,
    }).then(function () {
      this.interval = setInterval(function () {
        this.tick();
      }, this.intervalMilliseconds);
    });
  }

  /**
   * A single clock tick.
   */
  tick() {
    console.log('tick!');
  }

  /**
   * Destroys the clock.
   */
  destroy() {
    clearInterval(this.interval);
    this.obs.disconnect();
  }
}
