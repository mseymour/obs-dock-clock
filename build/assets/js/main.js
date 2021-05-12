/*globals config*/
import DockClock from './dock-clock';

document.addEventListener(() => {
  /* jshint unused:false */
  const dock_clock = new DockClock(document.getElementByID('clock'), {
    address: config.address,
    password: config.password,
  });
});
