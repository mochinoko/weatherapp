
var mysql = require('mysql');
const connection=createDatabaseConnection();

let data =JSON.parse(`
  {
  "station_id": 3,
  "sensors":
  [
    {"sensor_id": 4,
    "measurement": 17},
    {"sensor_id": 5,
    "measurement": 19}
  ]
  }
  `);

let datenow =new Date(Date.now()).toLocaleString();
dataPulseReceived(data, datenow);

// dataPulseReceived(data, timenow);

function dataPulseReceived(data, timenow) {
    var connection = mysql.createConnection({
      host:'localhost',
      user:'weatherapp',
      password: 'qwerty',
      database: 'weatherapp'
    });


connection.connect();

for(let i=0; i< data.sensors.length; i++) {
      let sql = `INSERT INTO sensor_data (measurement, station_id, measurement_time, sensor_id)
      VALUES(${data.sensors[i].measurement}, ${data.station_id}, "${timenow}",  ${data.sensors[i].sensor_id})`;

      connection.query(sql, function(error, results) {
        if (error == true) console.log("something went wrong");
        else{
          /*  var resultObject = JSON.parse(JSON.stringify(results));
            console.log(resultObject);*/
            console.log(data.sensors.length + " rows added to the database " );
            }
      });
  }
}



//what node server code is like:

selectSpecificSensorData(3).then(results=> {
  console.log(results);
});

selectSpecificSensorData(4).then(results=> {
  console.log(results);
});

selectSpecificSensorData(10).then(results=> {
  console.log(results);
});

getAllSensorData().then(results => {
  console.log(results);
});

changeStationStatus('error', 1).then(results => {
  console.log(results);
});

changeStationStatus("error", "3").then(results => {
  console.log(results);
});

let GPS = '60.17 24.94';
getSensorDataByLocation(GPS).then(results => {
  console.log(results);
});

function selectSpecificSensorData(sensor_id) {

  var connection = createDatabaseConnection();
  connection.connect();

  let sql = `SELECT measurement FROM sensor_data WHERE sensor_id=${sensor_id}`

  return new Promise((resolve, reject)=> {
    connection.query(sql, (error, results) => {
      if(error) reject(error)
      else if(results.length === 0 ) resolve("No records found")
      else {
        resolve(JSON.stringify(results));
      }
    });
    connection.end();
  });
}

function getAllSensorData() {
  let sql = `SELECT * FROM sensor_data`;

  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if(error) reject(error)
      else {
        resolve(JSON.stringify(results));
      }
    });
  });
}

function changeStationStatus(status, station_ID) {

  let sql=
  `UPDATE stations SET status = "${status}" WHERE station_ID = ${station_ID}`;

  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results)=> {
      if(error) reject(error);
      else if(typeof station_ID !== "number" ) {
        resolve("Nope. It has to be some number.") ;
      }
      else {
        resolve(`Statation ID ${station_ID} changed to ${status}`);
      }
    });
  });
}

function getSensorDataByLocation(GPS) {
  let sql =
  `SELECT sensor_data.* FROM sensor_data, stations, sensors
   WHERE GPS = '60.17 24.94' AND sensor_data.station_id= stations.station_ID
   AND sensors.sensor_ID = sensor_data.sensor_id
  `;
  return new Promise((resolve, reject)=> {
    connection.query(sql, (error, results)=> {
      if(error) reject(error)
      else {
        resolve(`results from ${GPS} are` + JSON.stringify(results));
      }
    })
  })
}

function createDatabaseConnection(){
  var connection = mysql.createConnection({
    host:'localhost',
    user:'weatherapp',
    password: 'qwerty',
    database: 'weatherapp'
  });
  return connection;
}
