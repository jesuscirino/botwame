const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia } = require("whatsapp-web.js");
const Excel = require("exceljs");

const RUTA_EXCEL = "./imags/contactos.xlsx";
const COL_NUMS = 2;
const CEL_MENSAJE = "A2";
const CEL_IMAGEN = "B2";
const LIBRO = new Excel.Workbook();

const SESION_JSON = "./session.json";
//var client;

const leerNumeros = async (ruta) => {
  let nums = [];
  await LIBRO.xlsx.readFile(ruta);
  console.log(`Archivo de excel ${RUTA_EXCEL} modificado:${LIBRO.modified}`);
  const hoja1 = LIBRO.getWorksheet("Hoja1");
  const hoja2 = LIBRO.getWorksheet("Hoja2");
  nums = hoja1
    .getColumn(COL_NUMS)
    .values.filter((value) => typeof value === "number");
  nums.unshift(hoja2.getCell(CEL_IMAGEN).value);
  nums.unshift(hoja2.getCell(CEL_MENSAJE).value);
  return nums;
};

const conSesGuardada = async () => {
  // Si exsite cargamos el archivo con las credenciales
  console.log("Si hay una sesión guardada");
  sessionData = require(SESION_JSON);
  let client = new Client({
    session: sessionData,
  });
  client.initialize();

  client.on("auth_failure", () => {
    console.log(
      "** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **"
    );
    process.exit(0);
  });
  return client;
};
const sinSesGuardada = async () => {
  console.log("No tenemos session guardada");
  let client = new Client();
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });
  client.initialize();

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

  return client;
};

(async () => {
  let datos = await leerNumeros(RUTA_EXCEL);
  let client = fs.existsSync(SESION_JSON)
    ? await conSesGuardada()
    : await sinSesGuardada();
  //await client.initialize();
  client.on("ready", async () => {
    console.log(`WhatsApp Listo ...`);
    //console.log(client.info.wid);
    //console.log(datos);
    let msg = datos.shift();
    let img = datos.shift();
    if (img === null) img = "";
    let media = undefined;
    try {
      media =
        img.includes(".jpg") | img.includes(".png")
          ? MessageMedia.fromFilePath(`./imags/${img}`)
          : null;
    } catch (error) {
      console.error(`no se encuentra el archivo: ${img} !!!`);
      process.exit(0);
    }
    datos.forEach(async (num) => {
      try {
        if (media === null) {
          await client
            .sendMessage(`521${num}@c.us`, msg)
            .then(console.log(`mensaje solo texto enviado a ${num}`));
        } else {
          await client
            .sendMessage(`521${num}@c.us`, media, { caption: msg })
            .then(console.log(`mensaje con imagen enviado a ${num}`));
        }
      } catch (error) {
        console.error(new Error(`error con ${num}`));
      }
    });
  });
  //console.log(client);
  //client.sendMessage("5215612047623@c.us", "hola");
})();
