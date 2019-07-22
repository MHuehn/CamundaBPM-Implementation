# CamundaBPM-Implementation
## Allgemein
In dieser Implementierung wird ein Prozess in der Camunda Business Process Engine (CamundaBPM) implementiert. Der implementierte Prozess beinhaltet die folgenden Prozesselemente. 

## Prozess

![alt text](https://github.com/MCikus/CamundaBPM-Implementation/blob/master/pictures/Prozess.PNG?raw=true "BPMN")

1. Send Task
2. Business Rule Task
3. User Task
4. Service Task
5. Call Activity
6. Default Sequence Flow
7. Data-based Exclusive Gateway (XOR)
8. Inclusive Gateway
9. Event Based Gateway
10. Message Startevent
11. Message Endevent
12. Intermediate Catching/Throwing Message Event
13. Intermediate Timer Event
14. Terminate Event

In diesem Beispiel werden keine zusätzlichen Java-Klassen oder NodeJS Scripte geschrieben. Der geschriebene Code beläuft sich auf wenige Zeilen (3) und ist darüberhinaus hoch wiederverwendbar. Alle die für den implementierten Prozess vorgesehenen Ressourcen befinden sich eingebettet in der XML der .bpmn-Datei dieses Repositories. 

## Requirements

Um den Prozess Lokal lauffähig zu bekommen, werden folgende Tools benötigt.

1. CamundaBPM (Apache Tomcat i.d.r unter `camunda-bpm-tomcat-7.10.0\server\apache-tomcat-9.0.12\bin`)
2. Camunda Modeler
3. Editor (Notepad++ o.ä)
4. Gmail Adresse
5. Konfigurationen und Einstellungen

Zunächst ist CamundaBPM zu installieren. Es ist sicherzustellen, dass die Umgebungsvariablen JAVA_HOME und JRE_HOME gesetzt sind.

Um CamundaBPM richtig (Konfiguration und Einstellungen) aufzusetzen werden folgende Pakete benötigt, welche i.d.r. unter folgendem Pfad abgelegt werden können. `..\camunda-bpm-tomcat-7.10.0\server\apache-tomcat-9.0.12\lib`. Ggf. befinden sich bereits einige Bibliotheken im Verzeichnis. Doppelte Bibliotheken (auch mit unterschiedlichen Versionen!) sind zu vermeiden. 

1. camunda-bpm-mail-core-1.2.0.jar
2. camunda-connect-core-1.1.0.jar
3. javax.mail-1.5.5.jar
4. slf4j-api-1.7.7.jar

Außerdem ist eine Konfigurationsdatei in das Verzeichnis camunda-bpm-tomcat-7.10.0\server\apache-tomcat-9.0.12\conf abzulegen:
Das folgende Beispiel kann so übernommen und mit einem Texteditor als `mail-config.properties` abgespeichert werden.

```console
# send mails via SMTP
mail.transport.protocol=smtp

mail.smtp.host=smtp.gmail.com
mail.smtp.port=465
mail.smtp.auth=true
mail.smtp.ssl.enable=true
mail.smtp.socketFactory.port=465
mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory

# poll mails via IMAPS
mail.store.protocol=imaps

mail.imaps.host=imap.gmail.com
mail.imaps.port=993
mail.imaps.timeout=10000

# additional config
mail.poll.folder=INBOX
mail.sender=ContactTest@irgendwas.com
mail.sender.alias=CamundaUser

mail.attachment.download=true
mail.attachment.path=attachments

# credentials
mail.user=NUTZER9@gmail.com
mail.password=PASSWORT
```

Hier muss lediglich in den "credentials" die E-Mail Adresse sowie Passwort eingesetzt werden. Ggf. muss die Sicherheitseinstellungen des Google Kontos angepasst werden. Die Sicherheitseinstellungen können hier gesetzt werden. [https://www.google.com/settings/security/lesssecureapps](https://www.google.com/settings/security/lesssecureapps)

Anschließend muss im Verzeichnis das Programm `startup.bat` für Windows oder `startup.sh` für Linux/MacOs im Verzeichnis `..\camunda-bpm-tomcat-7.10.0\server\apache-tomcat-9.0.12\bin` angepasst werden. Diese wird mit einem Editor geöffnet und zu beginn folgender Befehl eingefügt.

* Für Windows in der .bat Variante -> `set "MAIL_CONFIG=../conf/mail-config.properties"`
* Für Linux/MacOS in der .sh Variante -> `export MAIL_CONFIG="../conf/mail-config.properties"`

Damit ist die Umgebung konfiguriert. 

## Implementierung der Tasks im Camunda Modeler

### 1. User Task

Erlaubt das direkte Eingeben von Daten durch einen Benutzer auf der Camunda BPM Plattform durch Formulare.
Im Camunda Modeler wird nachdem die User Task im Prozess eingefügt wurde folgende Einstellung vorgenommen.

#### 1.1 General/Assignee 
Hier wird der Bearbeiter festgelegt der im System dazu berechtigt ist die Aufgabe zu bearbeiten. Zur Vereinfachung wurde hier "demo" eingetragen, damit die Aufgabe nicht erst angenommen werden muss.

#### 1.2 Forms/Forms Fields 
Hier können die Input Felder für die Nutzer eingefügt werden. Diese können auch im weiteren Verlauf innerhalb des Prozesses aufgegriffen werden um diese z.B. in Mailseinzubinden oder um Regeln zu definieren. Hier können verschiedene DatenTypen ausgewählt werden. Innerhalb des Prozesses werden vor allem die Datentypen `long` und `boolean` verwendet.

### 2. Inclusive Gateway
In diesem Gateway wird keine konkrete Logik konfiguriert. Das Gateway gibt dem Modellierenden lediglich die Regeln vor wie die ein- und ausgehenden Sequenzflüsse zu konfigurieren sind. 

### 3. Sequence Flow (Default)
Der Sequenzfluss bildet die eigentliche Logik vom Gateway ab.

#### 3.1 General/Details
Eine sehr elegante und leichte Art Regeln für Sequenzflüsse einzubinden ist im Feld "Condition Type" Expression aus dem Dropdown-Menü auszuwählen. Die Expression wird im anschließend folgenden Expression Feld bestimmt. Im Beispiel wurde im Formular der User Task ein Boolean verwendet der dazu genutzt werden kann. Dabei wird die Formular ID (interesst) abgeglichen mit der Wahrscheitswert abgefragt. `${interesst == true}`

#### 3.2 Default Sequence Flow
Im Rahmen der Implementierung bedarf es neben der grafischen Einbindung in BPMN keine weiteren konfigurationen, da dieser Sequenzfluss immer triggert, wenn sonst keine Expression true ist. 

### 4. Send Task
Erlaubt z.B. des automatisierte Senden von E-Mails auf der Camunda BPM Plattform. Konkret wird dies durch einen Connector implementiert, was keinerlei Programmierkenntnisse benötigt.
Dokumentation von Camunda: [klick](https://github.com/camunda/camunda-bpm-mail#camunda-bpm-mail)

#### 4.1 Connectors und Input Parameters
Im Camunda Modeler wird die Task als Send Task definiert. Task auswählen und "Properties Panel" öffnen. Anschließend im Reiter "General" auf "Connector" setzen und als Connector-ID `mail-send` setzen.

Im Reiter "Connector" innerhalb "Input Parameters" auf "+" klicken und folgende Parameter anlegen
      
| Name    | Type | Value |
| ----    | ---- | ----- |
| to      | Text | Empfänger E-Mail-Adresse |
| subject | Text | Betreff |
| text    | Text | Inhalt der E-Mail |
        
### 5. Receive Task
Hier beginnt der schwierigste Teil der Implementierung. Laut der Dokumentation von Camunda werden für receive Tasks eher Service Tasks verwendet, weil hierbei die technischen Möglichkeiten offener sind und die Connector-ID `mail-poll` gesetzt werden kann.

#### 5.1 Implementierung in der Send Task.
Die Logik der Receive Task wird im Listener der Send Task abgebildet. Es wird dort die korrelation zur Receive Task aufgebaut die momentan eine "Running Process Instance" offen hat. Der Prozess wartet dort. Message Name in der Receive Task vorher umbenennen auf einen wiederverwendbaren Namen, welcher im nächsten Abschnitt im Script aufgegriffen wird.


#### 5.1.1 Script
Es wird in der Send Task, welche an die Receive sendet folgende einstellungen vorgenommen. 
Reiter Listeners öffnen, Listeners auf "+" klicken. Execution Listener "start". Listener Type auf "Script" setzen. Script Format (in diesem Fall) "Javascript" eintippen. Script Type auf "Inline Script" setzen und als Script folgendes Script einbinden.

Message Name in der Receive Task vorher umbenennen auf einen wiederverwendbaren Namen

```javascript
var service = execution.getProcessEngineServices().getRuntimeService();
service.createMessageCorrelation("MessageName");
var id = service.createExecutionQuery().messageEventSubscriptionName("MessageName").singleResult();
service.messageEventReceived("MessageName", id.getId());
```

### 6. Message Event
Das Message Event wird genauso konfiguriert wie die Send Task aus 4. und weißt keinerlei technische Unterschiede dazu auf. 

### 7. Business Rule Task
In der Business Rule Task muss im Reiter General in Details für das Feld Implementation DMN ausgewählt werden, im Feld Decision Ref wird die ID der Tabelle eingetragen aus welcher der Output gezogen werden soll. Das Feld Binding wird auf latest gesetzt und im Feld Result Variable wird ebenfalls die ID der Ergebnisstabelle eingetragen. Zuletzt im Feld Map Decision Result wird ausgewählt, welche Art von Ergebnis aufgegriffen wird. In diesem Beispiel wird singleEntry verwendent. 

#### 7.1 DMN 
Die Business Rule Task verweißt in diesem Prozess auf ein DMN, welches in der CamundaBPM Engine durchgeführt wird. Dabei werden in diesem Beispiel zwei DMN Entscheidungen verwendet. Auf ein komplexeres Beispiel in DMN wird unter folgendem Link bereits umfassend eingegangen. [Zum DMN Projekt](https://github.com/MCikus/CamundaBPM-DMN-Implementation/)

#### 7.1.1 DRD Kalkulation
![alt text](https://github.com/MCikus/CamundaBPM-Implementation/blob/master/pictures/DMN2.PNG?raw=true "Kalkulation")

#### 7.1.2 DRD Kundenbindungsprozess
![alt text](https://github.com/MCikus/CamundaBPM-Implementation/blob/master/pictures/DMN1.png?raw=true "Kundenbindungsprozess")

### 8. Call Activity
BPMN 2.0 unterscheidet zwischen einem eingebetteten Subprozess und einer Call Activity. Aus theoretischer Sicht rufen beide einen Subprozess auf, wenn die Prozessausführung bei der Aktivität eintrifft.
Der Unterschied besteht darin, dass die Call Activity auf einen Prozess verweist, der sich außerhalb der Prozessinstanz befindet, während der Unterprozess in die ursprüngliche Prozessdefinition eingebettet ist. Der Hauptanwendungsfall für die Call Activity ist ein wiederverwendbarer Prozess, die aus mehreren anderen Prozessen aufgerufen werden kann und steht auch für sich alleine. Dabei können Variablen importiert und exportiert werden. 

#### 8.1 Konfiguration der Call Activity im Modeler
Im Reiter General CallActivity Type BPMN auswählen. Anschließend im Feld Called Element den Namen des aufgerufenen Prozesses eingeben und Binding auf latest setzen.

#### 8.2 Editieren der Call Activity in XML
In diesem Abschnitt wird die Variablenübergabe zwischen dem Subprozess der CallActivity und des aufrufenden Prozesses konfiguriert.
Es muss folgender Abschnitt in der Klammer eingefügt werden. <bpmn:callActivity id="Task1"...> INSERT HERE </bpmn:callActivity>

```xml
<bpmn:extensionElements>
<camunda:out variables="all" />
<camunda:in variables="all" />
</bpmn:extensionElements>
```

### 9. Event Based Gateway
Wird im Modeler nicht besonders implementiert. Die darauf folgendenden Events werden je nach Auslösung getriggert. 

### 10 Timer Event
Timer-Ereignisse sind Ereignisse, die von einem definierten Timer ausgelöst werden. Timer werden im Zeitformat ISO 8601 konfiguriert. Eine Timer-Definition muss genau eines der folgenden Elemente enthalten und wird im Reiter General im Feld Timer Definition Type eingestellt. Hierbei kann eine gewisse zeitspanne (Duration), ein Zeitzyklus (Cycle), oder ein bestimmtes Datum (Date) ausgewählt werden. Unter Timer Definition wird darauf die Dauer nach der erwähnten ISO8601 definiert und triggert sich in CamundaBPM wenn der Zeitpunkt eintritt selbst. 

### 11 Terminate Event
Wird im Modeler nicht besonders implementiert. Triggert sich sobald die Prozessinstanz diesen Zustand erreicht und bricht den gesamten Prozess ab. 

### 12 Service Task
Die Serive Task druckt ein Angebot auf der Basis der Variablen die während des Prozessdurchlaufs entstanden sind und ist damit eine Schnittstelle für einen externen Service. Dies wird im folgenden Beispiel durch ein NodeJS-Skript simuliert.
- Benötigte Programme: Camunda Modeler, Texteditor, NodeJS & NPM
- Ausführliche Erklärung in den Camunda Docs: [klick](https://docs.camunda.org/get-started/quick-start/service-task/#configure-the-service-task)
  - Im Camunda Modeler
    - Task als Service Task definieren
    - Task auswählen und "Properties Panel" öffnen
    - Im Reiter "General"
      - Implementation auf "External" setzen
      - Topic festlegen, woran die Task erkannt werden kann (z.B. "angebot")
  - Im Terminal/ Eingabeauffoderung
    - [NodeJS & NPM installieren](https://nodejs.org/en/download/)
    - [Arbeitsbereich vorbereiten](https://docs.camunda.org/get-started/quick-start/service-task/#create-a-new-nodejs-project)
    - [Camunda External Task Client JS installieren](https://docs.camunda.org/get-started/quick-start/service-task/#add-camunda-external-task-client-js-library)
  - Im Texteditor
    - Beispiel aus den [Camunda Docs](https://docs.camunda.org/get-started/quick-start/service-task/#implement-the-nodejs-script) übernehmen 
    - URL der REST Engine anpassen:
    ```javascript
    const config = { baseUrl: 'http://example.com:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };
    ```
    - Im Camunda Modeler gesetztes Topic einpflegen:
    ```javascript
    client.subscribe('topic hier einsetzen', async function({ task, taskService }) { ... });
    ```  
    - Eventuell Prozessvariablen und Ausgabe anpassen 
    - Dokument als "worker.js" im vorbereiteten Arbeitsbereich speichern
  - Im Terminal/ Eingabeaufforderung
    - Wenn nötig in das Arbeitsverzeichnis mit Hilfe von "cd" wechseln
    - mit "node ./worker.js" das angelegte NodeJS-Skript ausführen
- Beim Ausführen des BPMN-Prozesses in Camunda BPM wird die Service Task nun von dem angelegten Skript bedient

## Deployen und Starten
Anschließend wird der Prozess hochgeladen und kann ausgeführt werden. 
