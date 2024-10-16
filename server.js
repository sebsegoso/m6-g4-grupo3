const express = require("express");
const yargs = require("yargs");
const bodyParser = require("body-parser");
const { Jimp } = require("jimp");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// validacion de key
const argv = yargs.option("key", {
  alias: "k",
  description: "Clave para iniciar el servidor",
  type: "number",
}).argv;

if (argv.key === 123) {
  app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
  });
} else {
  console.log("Clave incorrecta. No se puede iniciar el servidor.");
}

// endpoints
// form
app.get("/", (req, res) => {
  res.send(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/style.css">
        </head>
        <body>
          <form action="/process-image" method="POST">
            <label for="imageUrl">Ingresa la URL de la imagen:</label>
            <input type="url" id="imageUrl" name="imageUrl" required>
            <button type="submit">Enviar</button>
          </form>
        </body>
      </html>
    `);
});

// procesado y respuesta
app.post("/process-image", async (req, res) => {
  const imageUrl = req.body.imageUrl;

  try {
    const image = await Jimp.read(imageUrl);

    const resized = await image
      .greyscale()
      .resize({ w: 350 })
      .getBuffer("image/jpeg", { quality: 80 });

    resized.write("public/newImg.jpg");

    res.send(`
      <html>
       <head>
          <link rel="stylesheet" type="text/css" href="/style.css">
        </head>
        <body>
          <h1>Imagen procesada</h1>
          <img src="/newImg.jpg" alt="Imagen procesada">
        </body>
      </html>
    `);
  } catch (error) {
    res.send(`Error al procesar la imagen: ${error}`);
  }
});
