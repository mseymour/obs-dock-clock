/**
 * A Clock Display, typically shown with the current time or a timer.
 */
export default class ClockDisplay {
  static get formatTimerMapping() {
    return {
      'h': 'hours',
      'm': 'minutes',
      's': 'seconds',
      'u': 'milliseconds',
      'a': 'period'
    };
  }

  /**
   * Make a Clock Face.
   *
   * @param {Element} container - The container for the clock display
   * @param {string} label - The clock display's label
   * @param  {string} clockType} - The clock type - either 'clock' or 'timer'
   * @param {Date|null} initialTime - THe time that the clock represents
   */
  constructor(container, label, clockType, initialTime = null) {
    this.now = null;
    this.label = label;
    this.clockType = clockType;
    this.initialTime = initialTime;
    this.clock = null;

    // Clock element templates
    const format = {
      clock: 'h:m[sa]',
      timer: 'h:m:s[ux]'
    };
    const displayTemplate   = document.querySelector('#tmp-clock'),
          separatorTemplate = document.querySelector('#tmp-clock-separator'),
          elementTemplate   = document.querySelector('#tmp-clock-element'),
          digitTemplate     = document.querySelector('#tmp-clock-digit'),
          periodTemplate    = document.querySelector('#tmp-clock-period'),
          statusTemplate    = document.querySelector('#tmp-clock-status');

    let display = displayTemplate.content.cloneNode(true),
        currentParent = display.querySelector('.clock__display');

    const processFormatChar = (char) => {
      if (char === ':') {
        currentParent.appendChild(separatorTemplate.content.cloneNode(true));
      } else if (char === '[') {
        let clone   = elementTemplate.content.cloneNode(true),
            element = clone.querySelector('.clock__element');
        currentParent.appendChild(clone);
        currentParent = element;
      } else if (char === ']') {
        currentParent = currentParent.parentElement;
      } else {
        let elementClone = elementTemplate.content.cloneNode(true),
            itemClone    = null,
            element      = elementClone.querySelector('.clock__element');
        element.dataset.elementType = char;

        // hours, minutes, seconds, microseconds
        if (char === 'h' || char === 'm' || char === 's' || char === 'u') {
          // Add repeating digits
          let digits = char !== 'u' ? 2 : 3;
          for (var i = 0; i < digits; i++) {
            itemClone = digitTemplate.content.cloneNode(true);
            itemClone.querySelector('[data-digit]').dataset.digit = i;
            element.appendChild(itemClone);
          }
          // am/pm period
        } else if (char === 'a') {
          itemClone = periodTemplate.content.cloneNode(true);
          element.appendChild(itemClone);
          // OBS status
        } else if (char === 'x') {
          itemClone = statusTemplate.content.cloneNode(true);
          element.appendChild(itemClone);
        }
        currentParent.appendChild(elementClone);
      }
    };

    [...format[clockType]].forEach(char => processFormatChar(char));

    display.querySelector('.clock__label').textContent = this.label;

    container.appendChild(display);
    this.clock = container.lastElementChild;
  }

  /**
   * Get the time elapsed in an object
   */
  getTimerObject() {
    let result = {
          period: null,
          milliseconds: null,
          seconds: null,
          minutes: null,
          hours: null,
        };

    this.now = new Date();

    if (this.clockType === 'timer') {
      let milliseconds, seconds, minutes, hours;
      milliseconds = this.now - this.initialTime;
      seconds = milliseconds / 1000;
      minutes = seconds / 60;
      hours = minutes / 60;

      result.milliseconds = milliseconds % 1000;
      result.seconds = Math.floor(seconds % 60);
      result.minutes = Math.floor(minutes % 60);
      result.hours = Math.floor(hours % 24);
    } else if (this.clockType === 'clock') {
      result.milliseconds = this.now.getMilliseconds();
      result.seconds = this.now.getSeconds();
      result.minutes = this.now.getMinutes();
      result.hours = ((this.now.getHours() + 11) % 12 + 1);
      result.period = this.now.getHours() >= 12 ? 'pm' : 'pm';
    }

    return result;
  }

  /**
   * Update the display
   */
  update() {
    const timer = this.getTimerObject();
    let elements = this.clock.querySelectorAll('.clock__element');
    [...elements].forEach(element => {
      let key = ClockDisplay.formatTimerMapping[element.dataset.elementType];
      if (typeof key === 'undefined') return;

      // Key us expected to be a digit
      if (key !== 'period') {
        let value = String(timer[key]).padStart((key !== 'milliseconds' ? 2 : 3), '0');
        [...value].forEach((char, index) => {
          // @TODO Add values to digits
        });
      } else if (key === 'period') {

      }
      // console.log(ClockDisplay.formatTimerMapping, element.dataset.elementType, ClockDisplay.formatTimerMapping[element.dataset.elementType]);

    });
  }
}
