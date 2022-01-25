const express = require("express");
const ytdl = require("ytdl-core");
const parser = require("body-parser");
const app = express();

//const fs = require("fs");

const port = 3000;

app.use(parser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});

app.get("/download", async (req, res, next) => {
  try {
    let videoURL = String(req.query.url);
    let id = ytdl.getURLVideoID(videoURL);
    let data = await ytdl.getInfo(id);
    let p;
    switch (req.query.quality) {
      case "360p":
        p = 134;
        break;
      case "480p":
        p = 135;
        break;
      case "720p":
        p = 136;
        break;
      case "1080p":
        p = 137;
        break;

      default:
        p = 134;
        break;
    }

    let format = ytdl.chooseFormat(data.formats, { quality: p });
    if (!format) return res.json(`Format ${req.query.quality} wasnt found`);
    //let file = ytdl.downloadFromInfo(data, { format: format });
    //   .pipe(
    //     fs.createWriteStream(`${data.videoDetails.title} ${req.body.quality}`)
    //   );
    res.redirect(format.url);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.json(`An Error Occured \n Details: \n ${err}`);
});

app.listen(port, () => console.log(` listening on port ${port}!`));
