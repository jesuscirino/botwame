const Excel = require("exceljs");
const RUTA_EXCEL = "../../botWB/contactos.xlsx";
const COL_NUMS = 1;
const CEL_MENSAJE = "A2";
const CEL_IMAGEN = "B2";
const LIBRO = new Excel.Workbook();
const leerLibro = async (ruta) => {
  await LIBRO.xlsx.readFile(ruta);
  console.log(`Archivo de excel ${RUTA_EXCEL} modificado:${LIBRO.modified}`);
  const hoja1 = LIBRO.getWorksheet("Hoja1");
  const hoja2 = LIBRO.getWorksheet("Hoja2");
  console.log(hoja1.getColumn(COL_NUMS).values);
  console.log(hoja2.getCell("A2").value);
};
(async () => {
  await leerLibro(RUTA_EXCEL);
})();
