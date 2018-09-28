/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

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
  knowledgeBaseId: process.env.QnAKnowledgebaseId,
  authKey: process.env.QnAAuthKey || process.env.QnASubscriptionKey
});

var basicQnAMakerPreviewDialog = new builder_cognitiveservices.QnAMakerDialog({
  recognizers: [previewRecognizer],
  defaultMessage: 'No match! Try changing the query terms!',
  qnaThreshold: 0.3
}
  );

bot.dialog('basicQnAMakerPreviewDialog', basicQnAMakerPreviewDialog);

// Recognizer and and Dialog for GA QnAMaker service
var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
  knowledgeBaseId: process.env.QnAKnowledgebaseId,
  authKey: process.env.QnAAuthKey || process.env.QnASubscriptionKey, // Backward compatibility with QnAMaker (Preview)
  endpointHostName: process.env.QnAEndpointHostName
});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
  recognizers: [recognizer],
  defaultMessage: 'No match! Try changing the query terms!',
  qnaThreshold: 0.3
}
  );

bot.dialog('basicQnAMakerDialog', basicQnAMakerDialog);

bot.dialog('/', [
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
        session.replaceDialog('basicQnAMakerPreviewDialog');
      else
        // Replace with GA QnAMakerDialog service
        session.replaceDialog('basicQnAMakerDialog');
    }
  }
]);
    
// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
bot.dialog('request',(session) => {
  session.send('Dies ist dein Request Indent');
  session.endDialog();
}).triggerAction({
  matches: 'request'
});

bot.dialog('Greeting',(session) => {
  var msg = new builder.Message(session)
    .addAttachment({
    contentType: "application/vnd.microsoft.card.adaptive",
    content: {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "message": "Hallo " + session.message.name + ", in welchem Auto sitzt du heute?",
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
                  "style": "default"
                }
              ]
            },
          ]
        }
      ]
    }
    
    // Middleware for handling adaptive card submits
  function adaptiveCardSubmitMiddleware() {
    return {
        botbuilder: (session, next) => {

            console.log(session.message);
            
            // I want them to be able to do this, for now ask they press the button
            if(session.message && session.message.text == 'submit'){
                session.send("Please use the submit button above");
                return;
            }

            if (session.message && session.message.value) {

                var defaultErrorMessage = 'Please provide all required fields';
                switch (session.message.value.type) {
                    case 'createISTicket':
                        // Search, validate parameters
                        if (jiraUtils.validateISTicket(session.message.value)) {
                            // proceed to booking ticket
                            jiraUtils.createISTicket(session);
                            session.replaceDialog('/mainDialogue');   
                        } else {
                            session.send(defaultErrorMessage);
                        }
                        break;
                    case 'cancelTicket':
                        session.send("OK, we won't create a ticket");
                        session.replaceDialog('/mainDialogue');
                        break;
                    case 'attachFiles':
                        session.beginDialog('/attachFiles', session);
                        break;
                    default:
                        // A form data was received, invalid or incomplete since the previous validation did not pass
                        session.send(defaultErrorMessage);
                        return;
                }
            } else {
                next();
            }
        }
    };
}
  });
  session.send(msg);

  session.endDialog();
}).triggerAction({
  matches: 'Greeting'
});