/*globals config*/
import DockClock from './dock-clock';

document.addEventListener('DOMContentLoaded', () => {
  /* jshint unused:false */
  const dock_clock = new DockClock(document.getElementById('clock'), {
    address: config.address,
    password: config.password,
  });
});
