/**
 * A Clock Display, typically shown with the current time or a timer.
 */
export default class ClockDisplay {
  /**
   * Make a Clock Face.
   *
   * @param {Element} container - The container for the clock display
   * @param {string} label - The clock display's label
   * @param {date} initialTime - THe time that the clock represents
   * @param  {string} clockType} - The clock type - either 'clock' or 'timer'
   */
  constructor(container, label, initialTime, clockType) {
    this.label = label;
    this.initialTime = initialTime;
    this.clockType = clockType;
    this.clock = null;

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

    display.querySelector('.clock__label').textContent = this.label;

    container.appendChild(display);
    this.clock = container.lastElementChild;
  }

  /**
   * Update the display
   */
  update() {
    console.log('Updating ' + this.label + '...');
    let now = Date.now(),
        display = this.clock.querySelector('.clock__display');
    [...display.children].forEach(child => {
      console.log(now, child);
      // TODO: Update clock/timer based on time difference from start and now
    });
  }
}
