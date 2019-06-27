const { Client, logger } = require('camunda-external-task-client-js'); 
const config = { baseUrl: 'http://localhost:8080/engine-rest/', use: logger, asyncResponseTimeout: 10000 };
const client = new Client(config);
const pdf = require('pdfkit'); // first npm install pdfkit 
const fs = require('fs'); // this is already in nodejs, so dont care about

client.subscribe('angebot', async function({ task, taskService }) {

const myDoc = new pdf;
var gesamtPreis = task.variables.get('gesamtPreis');
var name = task.variables.get('name');
var rabattID = task.variables.get('rabattID');
var komplexitaet = task.variables.get('komplexitaet');
var themenvielfalt = task.variables.get('themenvielfalt');


var newPrice = (gesamtPreis-gesamtPreis*rabattID/100);

myDoc.pipe(fs.createWriteStream(`${name}.pdf`));

// Head
myDoc.font('Times-Roman');
myDoc.fontSize(24);
myDoc.text('Angebot');
// PPM picture
myDoc.image('ppm.png',430,40,{fit:[100,100]})
// Body
myDoc.fontSize(16);
myDoc.text('Wir freuen uns, dass Sie mit uns in Geschäftsverbindung treten wollen. Wir haben Ihr Thema gesichtet und eingehend geprüft. Dabei haben wir folgende Punkte festgehalten und anschließend daraus einen Preis ermittelt.',70,175);
myDoc.text(`- Ihr Thema lautet '${name}'`,70,300);
myDoc.text(`- Die Komplexität wird '${komplexitaet}' eingestuft`,70,325);
myDoc.text(`- Es sollen '${themenvielfalt}' Bereiche bearbeitet werden`,70,350);
myDoc.text(`- Ein kostenfreier Zeitstrahl`,70,375);
myDoc.text(`Unser kalkulierter Preis für Sie beträgt ${newPrice}€`,70,425);
// End
myDoc.text(`Diese Preise sind Nettopreise. Unser Angebot ist 2 Wochen gültig. Bitte melden Sie sich bis dahin, ob Sie unser Angebot annehmen möchten.`,70,475);
myDoc.text(`Mit freundlichen Grüßen`,70,550);
myDoc.text(`Ihr PPM-Team`,70,575);	 
myDoc.text(`PPM - Wir stehen für Projekte und Zeitsträhle.`,70,675, {
  width: 410,
  align: 'center'
}
);
myDoc.end();

console.log(`Das Angebot von ${newPrice}€ für das Projekt '${name}' wurde erfolgreich gedruckt`);

await taskService.complete(task);
});