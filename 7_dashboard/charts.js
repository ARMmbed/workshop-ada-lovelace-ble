var ctx = document.querySelector('#chart').getContext('2d');

var chart = window.chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: []
  },
  options: {
    scales: {
      xAxes: [{
        type: 'time',
        position: 'bottom',
        time: {
          format: 'HH:mm:ss',
          unit: 'minute'
        }
      }],
      yAxes: [{
        ticks: {
          min: 0
        },
        scaleLabel: {
          display: true,
          labelString: 'Sensor value'
        }
      }]
    }
  }
});

// at some point you probably want authentication ;-)
firebase.auth().signInAnonymously();

var borderColor = [
  'rgba(255,99,132,1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)'
];

var fillColor = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)'
];

var colorIx = -1;

var db = firebase.database();
var ref = db.ref();

ref.on('child_added', function(e) {
  var val = e.val();
  console.log('child added', e.key, val);

  var cix = (++colorIx) % 6;
  var ds = {
    label: e.key,
    fill: false,
    pointRadius: 0,
    pointHitRadius: 0,
    backgroundColor: fillColor[cix],
    borderColor: borderColor[cix],
    data: []
  };
  chart.data.datasets.push(ds);

  if (typeof val.value === 'object') {
    var ref = db.ref(e.key + '/value');
    ref.on('child_added', function(e) {
      console.log('new value on ' + e.key + '/value', e.val());

      ds.data.push({
        x: new Date(Number(e.val().ts)),
        y: Number(e.val().state)
      });
      chart.update();
    });
  }
});
