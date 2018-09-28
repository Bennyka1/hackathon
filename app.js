/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");
var msg;
var carCompany;

var symbolcomputer;
var symbolspieler;
var anzahlrunden = 0;
var gewinnecomputer = 0;
var gewinnespieler = 0;
var gewinnbedingung = 3;

// Setup Restify Server
var server = restify.createServer();

server.get(/\/?.*/, restify.plugins.serveStatic({
  directory: '/public',
  default: 'index.html'
}))

server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
  openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westeurope.api.cognitive.microsoft.com';

var LuisModelUrl = 'https://westeurope.api.cognitive.microsoft.com/luis/v2.0/apps/0d3222b3-0b5f-48ce-b5cd-ffd99b01e9ea?subscription-key=18a62222b9aa4d2c96f6dbc4eeb7b738&spellCheck=true&bing-spell-check-subscription-key={YOUR_BING_KEY_HERE}&timezoneOffset=60&q=';

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Recognizer and and Dialog for preview QnAMaker service
var previewRecognizer = new builder_cognitiveservices.QnAMakerRecognizer({
  knowledgeBaseId: process.env.QnAKnowledgebaseId2,
  authKey: process.env.QnAAuthKey2 || process.env.QnASubscriptionKey2
});

var basicQnAMakerPreviewDialog = new builder_cognitiveservices.QnAMakerDialog({
  recognizers: [previewRecognizer],
  defaultMessage: 'No match! Try changing the query terms!',
  qnaThreshold: 0.3
}
  );

var secondRecognizer = new builder_cognitiveservices.QnAMakerRecognizer({
  knowledgeBaseId: process.env.QnAKnowledgebaseId,
  authKey: process.env.QnAAuthKey || process.env.QnASubscriptionKey
});

var secondQnAMakerPreviewDialog = new builder_cognitiveservices.QnAMakerDialog({
  recognizers: [secondRecognizer],
  defaultMessage: 'No match! Try changing the query terms!',
  qnaThreshold: 0.3
}
  );

bot.dialog('basicQnAMakerPreviewDialog', basicQnAMakerPreviewDialog);
bot.dialog('secondQnAMakerPreviewDialog', secondQnAMakerPreviewDialog);

// Recognizer and and Dialog for GA QnAMaker service
var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
  knowledgeBaseId: process.env.QnAKnowledgebaseId2,
  authKey: process.env.QnAAuthKey2 || process.env.QnASubscriptionKey2, // Backward compatibility with QnAMaker (Preview)
  endpointHostName: process.env.QnAEndpointHostName2
});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
  recognizers: [recognizer],
  defaultMessage: 'No match! Try changing the query terms!',
  qnaThreshold: 0.3
}
  );

var secondrecognizer = new builder_cognitiveservices.QnAMakerRecognizer({
  knowledgeBaseId: process.env.QnAKnowledgebaseId,
  authKey: process.env.QnAAuthKey || process.env.QnASubscriptionKey, // Backward compatibility with QnAMaker (Preview)
  endpointHostName: process.env.QnAEndpointHostName
});

var secondQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
  recognizers: [secondrecognizer],
  defaultMessage: 'No match! Try changing the query terms!',
  qnaThreshold: 0.3
}
  );

bot.dialog('basicQnAMakerDialog', basicQnAMakerDialog);
bot.dialog('secondQnAMakerDialog', secondQnAMakerDialog);

/*********************************************************
 * 
 * Welcome Message
 * 
 * 
 * 
 **********************************************************/


bot.on('conversationUpdate', function (message) {
  if (message.membersAdded) {
    message.membersAdded.forEach(function (identity) {
      if (identity.id === message.address.bot.id) {
        bot.send(new builder.Message()
          .address(message.address)
          .text("Hallo!"));
      }
    });
  }
});


bot.dialog('/',(session) => {
  console.log(carCompany);
  
  session.endDialog();
  session.replaceDialog("Greeting");

}).triggerAction({
  matches: '/'
});

/*********************************************************
 * 
 * Schere Stein Papier [Entwurf]
 * ToDo!!
 * 
 * 
 **********************************************************/

bot.dialog('SchereSteinPapier',(session) => {

    var ausgedachtezahl = Math.random() * 3;
    ausgedachtezahl = Math.round(ausgedachtezahl + 0, 5);

    if (ausgedachtezahl == 1) {
      symbolcomputer = "Schere"
    };
    if (ausgedachtezahl == 2) {
      symbolcomputer = "Stein";
    };
    if (ausgedachtezahl == 3) {
      symbolcomputer = "Papier";
    };

    session.send("Schere Stein oder Papier?");
    
  }).triggerAction({
    matches: 'SchereSteinPapier'
  });

  bot.dialog('stein',(session) => {
    symbolspieler = "Stein";
    if (symbolcomputer == "Schere" && symbolspieler == "Stein") {
      session.send("Du gewinnst gegen Schere");
    }
    if (symbolcomputer == "Papier" && symbolspieler == "Stein") {
      session.send("Computer gewinnt mit Papier");
      gewinnespieler++;
    }

    if (symbolspieler == symbolcomputer) {
      session.send("Spiel unentschieden");
    }
    session.endDialog();


  }).triggerAction({
    matches: 'SchereSteinPapierAntwort'
  });


  bot.dialog('schere',(session) => {
    symbolspieler = "Schere";
    if (symbolcomputer == "Stein" && symbolspieler == "Schere") {
      session.send("Computer gewinnt mit Stein");
      gewinnespieler++;
    }
    if (symbolcomputer == "Papier" && symbolspieler == "Schere") {
      session.send("Du gewinnst mit Papier");
      gewinnespieler++;
    }
    if (symbolspieler == symbolcomputer) {
      session.send("Spiel unentschieden");
    }
    session.endDialog();


  }).triggerAction({
    matches: 'SchereSteinPapierAntwort'
  });

  bot.dialog('papier',(session) => {
    symbolspieler = "Papier";

    if (symbolcomputer == "Schere" && symbolspieler == "Papier") {
      session.send("Computer gewinnt mit Schere");
      gewinnespieler++;
    }

    if (symbolcomputer == "Stein" && symbolspieler == "Papier") {
      session.send("Du gewinnst gegen Stein");
      gewinnespieler++;
    }

    if (symbolspieler == symbolcomputer) {
      session.send("Spiel unentschieden");
    }
    session.endDialog();

  }).triggerAction({
    matches: 'SchereSteinPapierAntwort'
  });


/*********************************************************
 * 
 * KnowledgeBase
 * ToDo!!
 * 
 **********************************************************/

bot.dialog('SupportDialogeCar',(session) => {
  console.log(carCompany);
  
  
  if(carCompany){
  session.replaceDialog("/"+ carCompany +"/manual");
  } else {
  session.replaceDialog("Greeting");  
  }

}).triggerAction({
  matches: 'SupportDialogeCar'
});
    
bot.dialog('Greeting',(session) => {
  msg = new builder.Message(session)
    .addAttachment({
    contentType: "application/vnd.microsoft.card.adaptive",
    content: {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "speak": "Hallo " + session.message.user.name + ", mit welchem Fahrzeug fährst du heute?",
      "version": "1.0",
      "body": [
        {
          "type": "TextBlock",
          "text": "Fahrzeugauswahl",
          "size": "large",
          "weight": "bolder"
        },
        {
          "type": "TextBlock",
          "text": "Mit welchem Fahrzeug fährst du heute?",
          "wrap": true
        },
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "Smart",
                  "weight": "bolder"
                },
                {
                  "type": "Image",
                  "url": "http://smartkits.eu/2475-large_default/pulse-logo.jpg",
                  "style": "default",
                  "selectAction": {
                    "type": "Action.Submit",
                    "title": "OK",
                    "data": {
                      "Company": "Smart"
                    }
                  }
                }
              ]
            },
            {
              "type": "Column",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "Mercedes",
                  "weight": "bolder"
                },
                {
                  "type": "Image",
                  "url": "https://images-na.ssl-images-amazon.com/images/I/61VaoHj7IbL._SX425_.jpg",
                  "style": "default",
                  "selectAction": {
                    "type": "Action.Submit",
                    "title": "OK",
                    "data": {
                      "Company": "Mercedes"
                    }
                  }
                }
              ]
            },
          ]
        }
      ]
    }
  });

  if (session.message && session.message.value) {

    session.endDialog(session.message.value.Company);
    session.replaceDialog("/" + session.message.value.Company);

  } else {

    if (session.message.text == "Smart") {
      session.endDialog();
      session.replaceDialog("/Smart");
    } else {
      session.send(msg);
    }
  }

}).triggerAction({
  matches: 'Greeting'
});

bot.dialog('/Smart',(session) => {
  carCompany = "Smart";

  msg = new builder.Message(session)
    .addAttachment({
    contentType: "application/vnd.microsoft.card.adaptive",
    content: {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.0",
      "speak": "Möchtest du eine kurze Einführung haben?",
      "body": [
        {
          "type": "TextBlock",
          "text": "Einführung in Fahrzeug",
          "size": "large",
          "weight": "bolder"
        },
        {
          "type": "TextBlock",
          "text": "Soll ich dir eine kurze Einführung zeigen?",
        },
      ],
      "actions": [
        {
          "type": "Action.Submit",
          "title": "Ja",
          "data": {
            "Introduction": "Ja"
          }
        },
        {
          "type": "Action.Submit",
          "title": "Nein",
          "data": {
            "Introduction": "Nein"
          }
        }
      ]
    }
  });

  if (session.message && session.message.value) {

    if (session.message.value.Introduction) {
      //session.send(session.message.value.Introduction);
      session.endDialog(session.message.value.Introduction);

      if (session.message.value.Introduction == "Ja") {
        session.endDialog(session.message.value.Company);
        session.replaceDialog("/Smart/Introduction");
      }

    } else {
      session.send(msg);
    }

  } else {
    if (session.message.text == "Ja") {
      session.endDialog();
      session.replaceDialog("/Smart/Introduction");
    } else {
      session.send(msg);
    }
  }

}).triggerAction({
  matches: '/Smart'
});

bot.dialog('/Mercedes',(session) => {
  carCompany = "Mercedes";

  msg = new builder.Message(session)
    .addAttachment({
    contentType: "application/vnd.microsoft.card.adaptive",
    content: {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.0",
      "speak": "Möchtest du eine kurze Einführung haben?",
      "body": [
        {
          "type": "TextBlock",
          "text": "Einführung in Fahrzeug",
          "size": "large",
          "weight": "bolder"
        },
        {
          "type": "TextBlock",
          "text": "Soll ich dir eine kurze Einführung zeigen?",
        },
      ],
      "actions": [
        {
          "type": "Action.Submit",
          "title": "Ja",
          "data": {
            "Introduction": "Ja"
          }
        },
        {
          "type": "Action.Submit",
          "title": "Nein",
          "data": {
            "Introduction": "Nein"
          }
        }
      ]
    }
  });

  if (session.message && session.message.value) {

    if (session.message.value.Introduction) {
      //session.send(session.message.value.Introduction);
      session.endDialog(session.message.value.Introduction);

      if (session.message.value.Introduction == "Ja") {
        session.endDialog(session.message.value.Company);
        session.replaceDialog("/Mercedes/Introduction");
      }

      if (session.message.value.Introduction == "Nein") {
        session.endDialog("Gute Fahrt!");
      }

    } else {
      session.send(msg);
    }

  } else {

    if (session.message.text == "Ja") {
      session.replaceDialog("/Mercedes/Introduction");
      session.endDialog();
    }

    if (session.message.text == "Nein") {
      session.endDialog("Gute Fahrt! :-)");
    }

    session.send(msg);

  }

}).triggerAction({
  matches: '/Mercedes'
});

bot.dialog('/Mercedes/Introduction',(session) => {
  session.say('Bei der elektronischen Sitzeinstellung , kannst du über die Sitzknöpfe in der Türtafel die Sitzposition einstellen');
  session.say('Bei der mechanischen Sitzeinstellung, kannst du den Sitz über die vorhandenen Hebel einstellen');
  session.say('Bei der elektronischen Lenkradverstellung, kannst du mit dem mittleren Hebel, Einstellungen vornehmen');
  session.say('Bei der mechanischen Lenkradeinstellung, befindet sich unter dem Lenkrad, in der nähe deiner Kniee ein Hebel über den sich das Lenkrad einstellen lässt');
  session.say('Die Verstellung der Außenspiegel befindet sich auf der Armlehne in der Türtafel oben');
  session.say('Das Warndreieck befindet sich im Kofferraum unter dem Laderaumboden');
  session.say('Zum Lösen des Warndreiecks musst du die Laschen der Aufnahme nach hinten drücken');
  session.endDialog();

}).triggerAction({
  matches: '/Mercedes/Introduction'
});

bot.dialog('/Smart/Introduction',(session) => {
  session.say('Wenn du den Hebel unter deinem Sitz anhebst kannst du den Sitz vor oder zurückschieben');
  session.say('Die Sitzhöhe kann mit dem Hebel unten links verstellt werden');
  session.say('Mit dem Handrad kann dann die Sitzlehne eingestellt werden');
  session.say('Mit dem Hebel unter dem Lenkrad kann man das Lenkrad einstellen');
  session.say('Mit den Knöpfen, vorne in der Fahrertür lassen sich die Außenspiegel einstellen');
  session.say('Das Warndreieck ist mit einem Klettverschluss hinter der Lehne am Fahrersitz befestigt');
  session.endDialog();

}).triggerAction({
  matches: '/Smart/Introduction'
});

bot.dialog('/Smart/manual', //basicQnAMakerDialog);
    [
        function (session) {
            var qnaKnowledgebaseId = process.env.QnAKnowledgebaseId2;
            var qnaAuthKey = process.env.QnAAuthKey2 || process.env.QnASubscriptionKey2;
            var endpointHostName = process.env.QnAEndpointHostName2;

            // QnA Subscription Key and KnowledgeBase Id null verification
            if ((qnaAuthKey == null || qnaAuthKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
                session.send('Please set QnAKnowledgebaseId, QnAAuthKey and QnAEndpointHostName (if applicable) in App Settings. Learn how to get them at https://aka.ms/qnaabssetup.');
            else {
                if (endpointHostName == null || endpointHostName == '')
                    // Replace with Preview QnAMakerDialog service
                    session.replaceDialog('basicQnAMakerPreviewDialog');
                else
                    // Replace with GA QnAMakerDialog service
                    session.replaceDialog('basicQnAMakerDialog');
            }
        }
]);

bot.dialog('/Mercedes/manual', //basicQnAMakerDialog);
    [
        function (session) {
            var qnaKnowledgebaseId = process.env.QnAKnowledgebaseId;
            var qnaAuthKey = process.env.QnAAuthKey || process.env.QnASubscriptionKey;
            var endpointHostName = process.env.QnAEndpointHostName;

            // QnA Subscription Key and KnowledgeBase Id null verification
            if ((qnaAuthKey == null || qnaAuthKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
                session.send('Please set QnAKnowledgebaseId, QnAAuthKey and QnAEndpointHostName (if applicable) in App Settings. Learn how to get them at https://aka.ms/qnaabssetup.');
            else {
                if (endpointHostName == null || endpointHostName == '')
                    // Replace with Preview QnAMakerDialog service
                    session.replaceDialog('secondQnAMakerPreviewDialog');
                else
                    // Replace with GA QnAMakerDialog service
                    session.replaceDialog('secondQnAMakerDialog');
            }
        }
]);
