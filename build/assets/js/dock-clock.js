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
      interval_ms: 1000,
    };

    this.element = element;
    this.options = Object.assign({}, default_options, options);

    this.obs = new OBSWebSocket();

    this.clocks = [];

    this.interval = null;

    this.setup();
  }

  /**
   * Starts the clock
   */
  setup() {
    let self = this;

    this.obs.connect({
      address: this.options.address,
      password: this.options.password,
    })
    .then(() => {
      // Set up clock
      this.clockSetUp();
    })
    .then(() => {
      // Set up tick
      let self = this;
      this.interval = setInterval(() => {
        self.tick();
      }, this.options.interval_ms);
    })
    .catch(err => {
        console.error('Promise error:', err);
    });

    this.obs.on('error', err => {
      console.error('Socket error:', err);
    });
  }

  /**
   * Set up individual clock
   */
  clockSetUp() {
    // Clock container, display
    let container = document.querySelector('#clock'),
        display;
    // Clock element templates
    const format            = 'h:ms',
          displayTemplate   = document.querySelector('#tmp-clock'),
          elementTemplate   = document.querySelector('#tmp-clock-element'),
          separatorTemplate = document.querySelector('#tmp-clock-separator');

    display = displayTemplate.content.cloneNode(true);

    [...format].forEach(char => {
      if (char === ':') {
        display.querySelector('.clock__display').appendChild(separatorTemplate.content.cloneNode(true));
      } else {
        let clone   = elementTemplate.content.cloneNode(true),
            element = clone.querySelector('.clock__element');
        element.setAttribute('data-element-type', char);
        display.querySelector('.clock__display').appendChild(clone);
      }
    });

    display.querySelector('.clock__label').textContent = 'Local Time';

    container.appendChild(display);
  }

  /**
   * A single clock tick.
   */
  tick() {
    console.log(this.obs);
  }

  /**
   * Destroys the clock.
   */
  destroy() {
    clearInterval(this.interval);
    this.obs.disconnect();
  }
}
