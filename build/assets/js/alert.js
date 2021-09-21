export let alertCounter = 0;

/**
 * Alert class
 *
 * Implements alert dialogs.
 */
export default class Alert {
  constructor(options) {
    const default_options = {
      title: 'Something happened',
      description: 'Something happened',
    };
    this.options = Object.assign({}, default_options, options);

    const modalTemplate = document.querySelector('#tmp-alert');

    this.modal = modalTemplate.content.cloneNode(true);
  }

  display() {
    document.body.appendChild(this.modal);
    this.modal = document.body.lastElementChild;
    const alert = this.modal.querySelector('.alert');
    const title = this.modal.querySelector('#alertDialogTitle');
    const desc = this.modal.querySelector('#alertDialogDesc');

    // Set unique attributes
    const id = ++alertCounter;
    alert.setAttribute('aria-labelledby', alert.getAttribute('aria-labelledby') + id);
    alert.setAttribute('aria-describedby', alert.getAttribute('aria-describedby') + id);
    title.setAttribute('id', title.getAttribute('id') + id);
    desc.setAttribute('id', desc.getAttribute('id') + id);

    // Set modal content
    title.textContent = this.options.title;
    desc.textContent = this.options.description;

    // Add event listener for clicking close button
    // @TODO Apply to clicking on outside of modal as well
    const that = this;
    this.modal.querySelector('[data-close]').addEventListener('click', () => that.destroy());
    this.modal.classList.add('alert-cover--opening');

    // Handle removing/adding classes after animation
    this.modal.addEventListener('animationend', function handle () {
      this.removeEventListener('animationend', handle);
      that.modal.classList.remove('alert-cover--opening');
      that.modal.classList.add('alert-cover--open');
    });
  }

  destroy() {
    const modal = this.modal;
    // Add class for closing animation, remove after completion
    this.modal.classList.add('alert-cover--closing');
    this.modal.addEventListener('animationend', function handle () {
      this.removeEventListener('animationend', handle);
      modal.remove();
    });
  }
}
