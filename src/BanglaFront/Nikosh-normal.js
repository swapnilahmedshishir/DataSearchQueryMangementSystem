﻿import { jsPDF } from "jspdf";
var font =
const callAddFont = function () {
  this.addFileToVFS("Nikosh-normal.ttf", font);
  this.addFont("Nikosh-normal.ttf", "Nikosh", "normal");
};
jsPDF.API.events.push(["addFonts", callAddFont]);

export default font;