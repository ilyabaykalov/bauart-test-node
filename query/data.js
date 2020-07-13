let fs = require('fs');
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

  const jsonPath = `./output/apod_${ new Date().toISOString() }.json`;
  const imagePath = `./output/apod_${ new Date().toISOString() }.png`;

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

  const jsonPath = `./output/earth_${ new Date().toISOString() }.json`;
  const imagePath = `./output/earth_${ new Date().toISOString() }.png`;

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
        jsonPath,
        imagePath
      });
}

function addMars(req, res) {
  const result = req.body.result;

  const jsonPath = `./output/mars_weather_${ new Date().toISOString() }.json`;

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
