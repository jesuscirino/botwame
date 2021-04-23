const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const Excel = require("exceljs");

const RUTA_EXCEL = "../../botWB/contactos.xlsx";
const COL_NUMS = 1;
const CEL_MENSAJE = "A2";
const CEL_IMAGEN = "B2";
const LIBRO = new Excel.Workbook();

const SESION_JSON = "./session.json";
var client;

const leerLibro = async (ruta) => {
  await LIBRO.xlsx.readFile(ruta);
  console.log(`Archivo de excel ${RUTA_EXCEL} modificado:${LIBRO.modified}`);
  const hoja1 = LIBRO.getWorksheet("Hoja1");
  const hoja2 = LIBRO.getWorksheet("Hoja2");
  console.log(hoja1.getColumn(COL_NUMS).values);
  console.log(hoja2.getCell("A2").value);
};

const conSesGuardada = async () => {
  // Si exsite cargamos el archivo con las credenciales
  console.log("Si hay una sesión guardada");
  sessionData = require(SESION_JSON);
  client = new Client({
    session: sessionData,
  });

  client.on("auth_failure", () => {
    console.log(
      "** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **"
    );
    process.exit(0);
  });
};
const sinSesGuardada = async () => {
  console.log("No tenemos session guardada");
  client = new Client();
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("auth_failure", () => {
    console.log("** Error de autentificacion vuelve a generar el QRCODE **");
    process.exit(0);
  });

  client.on("authenticated", (session) => {
    // Guardamos credenciales de de session para usar luego
    sessionData = session;
    fs.writeFile(SESION_JSON, JSON.stringify(session), function (err) {
      if (err) {
        console.log(err);
        process.exit(0);
      }
    });
  });

  client.initialize();
};

(async () => {
  await leerLibro(RUTA_EXCEL);
  fs.existsSync(SESION_JSON) ? await conSesGuardada() : await sinSesGuardada();
  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.initialize();
})();
