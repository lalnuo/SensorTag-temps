var SensorTag = require('sensortag');

var temps = [0, 0, 0, 0, 0];
var times = [0, 0, 0, 0, 0];
var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , screen = blessed.screen()
  , line = contrib.line(
      { style:
        { line: "yellow"
        , text: "green"
        , baseline: "black"}
      , xLabelPadding: 3
      , xPadding: 5
      , label: 'Temperature'})
  , data = {
      x: temps,
      y: times
   }

screen.append(line) //must append before setting data
line.setData([data])

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render()

SensorTag.discover(sensorTag => {
  sensorTag.connectAndSetUp(afterSetup.bind(null, sensorTag));

});

function afterSetup(sensorTag) {
  sensorTag.enableIrTemperature(irTemperatureEnabled.bind(null, sensorTag));
}

function irTemperatureEnabled(sensorTag) {
  sensorTag.notifyIrTemperature();
  sensorTag.on('irTemperatureChange', (_, temperature) => {
    temps.shift();
    temps.push(temperature);
    times.shift();
    times.push(new Date().toTimeString().split(' ')[0])
    var data = {
      x: times,
      y: temps,
    }
    line.setData([data])
    screen.render()
  })
}
