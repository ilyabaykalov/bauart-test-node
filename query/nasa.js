const fs = require('fs');
const request = require('request');

module.exports = {
  addAPOD: addAPOD,
  addEarth: addEarth,
  addMars: addMars
};

function addAPOD(req, res) {
  const title = req.body.title;
  const explanation = req.body.explanation;
  const url = req.body.url;

  const date = new Date().toISOString();

  const jsonPath = `./output/apod_${ date }.json`;
  const imagePath = `./output/apod_${ date }.png`;

  if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
  }

  request(url)
      .pipe(fs.createWriteStream(imagePath));

  fs.writeFileSync(jsonPath,
      JSON.stringify({
            title,
            explanation,
            url
          },
          null,
          '\t'));

  res.status(res.statusCode)
      .json({
        jsonPath,
        imagePath
      });
}

function addEarth(req, res) {
  const url = req.body.url;

  const date = new Date().toISOString();

  const jsonPath = `./output/earth_${ date }.json`;
  const imagePath = `./output/earth_${ date }.png`;

  if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
  }

  request(url)
      .pipe(fs.createWriteStream(imagePath));

  fs.writeFileSync(jsonPath,
      JSON.stringify({
            url
          },
          null,
          '\t'));

  res.status(res.statusCode)
      .json({
        imagePath
      });
}

function addMars(req, res) {
  const result = req.body.result;

  const date = new Date().toISOString();

  const jsonPath = `./output/mars_weather_${ date }.json`;

  if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
  }

  fs.writeFileSync(jsonPath,
      JSON.stringify({
            result
          },
          null,
          '\t'));

  res.status(res.statusCode)
      .json({
        jsonPath
      });
}
