const express = require("express");
const fs = require("fs");
const homeHtmlFilePath = "./templates/home.html";
const oscarsPath = "";
const PORT = 3000;
const server = express();
const router = express.Router();

// Server config
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  fs.readFile(homeHtmlFilePath, "utf-8", (readError, data) => {
    if (readError) {
      res.status(500).send("Error inesperado :(");
    } else {
      try {
        res.set("Content-Type", "text/html");
        res.send(data);
      } catch (error) {
        res.status(500).send("Error inesperado :(");
      }
    }
  });
});

router.get("/oscars", (req, res) => {
  console.log(`El usuario ha solicitado ${req.url}`);
  res.setHeader("Content-Type", "text/plain; charset=UTF-8");

  if (req.url === "/oscars") {
    res.statusCode = 200;

    const years = [
      {
        year: "2011",
      },
      {
        year: "2012",
      },
      {
        year: "2013",
      },
      {
        year: "2014",
      },
      {
        year: "2015",
      },
    ];

    const yearString = JSON.stringify(years);
    res.end(yearString);
  } else {
    res.statusCode = 404;
    res.end("Error 404. Lo sentimos, no se ha encontrado la pagina.");
  }
});

router.post("/f1-driver", (req, res) => {
  fs.readFile(formulaOneDriversPath, (readError, data) => {
    if (readError) {
      res.status(500).send("Error inesperado :(");
    } else {
      try {
        const parsedData = JSON.parse(data);
        const lastId = parsedData[parsedData.length - 1].id;
        const newDriver = req.body;
        newDriver.id = lastId + 1;
        parsedData.push(newDriver);
        res.json(newDriver);

        // Guardamos datos en el fichero
        fs.writeFile(
          formulaOneDriversPath,
          JSON.stringify(parsedData),
          (error) => {
            if (error) {
              console.log("Ha ocurrido un error escribiendo el fichero");
              console.log(error);
            } else {
              console.log(
                `Fichero ${formulaOneDriversPath} guardado correctamente!`
              );
            }
          }
        );
      } catch (parseError) {
        res.status(500).send("Error inesperado :(");
      }
    }
  });
});

router.get("/f1-driver/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(formulaOneDriversPath, (readError, data) => {
    if (readError) {
      res.status(500).send("Error inesperado :(");
    } else {
      try {
        const parsedData = JSON.parse(data);
        const driver = parsedData.find((driver) => driver.id === id);

        if (driver) {
          res.json(driver);
        } else {
          res.status(404);
          res.send("no encontrado.");
        }
      } catch (parseError) {
        res.status(500).send("Error inesperado :(");
      }
    }
  });
});

// Server config
server.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor está levantado y escuchando en el puerto ${PORT}`);
});
