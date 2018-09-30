const myObj = [
    "Welches Musikinstrument spielt Woody Allen hervorragend?",
    "Was für ein Tier ist der Gänsesäger?",
    "Wo starb Che Guevara?",
    "Wer besiegelte die deusch-französische Freundschaft durch einen Vertrag?",
    "Wo leben die Wallonen?",
    "Wann wurde die Kapellbrücke in Luzern gebaut?",
    "Wie hiess der erste Mensch im All?",
    "Wann gab es zum ersten mal seit 1928 keine Coca-Cola-Werbung an den Olympischen Spielen?",
    "Wer sandte 1983 während des Bürgerkrieges Truppen in den Tschad?",
    "Wer schrieb unter dem Pseudonym Peter Panther?",
    "Wer war 1981 Weltmeister im Eishockey?",
    "Wie war der Mädchenenname von Schillers  Frau?",
    "Welche US-Athletin nannte man die Gazelle?",
    "Wie heisst die Stadt am Bosparus heute?",
    "Was heisst „theater“ ursprünglich?",
    "In welchem Land herrschte Idi Amin?",
    "Wie viele Flügel hat eine Biene?",
    "Wie heisst der griechische Gott des Schlafes?",
    "Wie nennt man eine Reitsport-Mannschaft?",
    "Wer hat „vom Winde verweht“ geschrieben?",
    "Wie heisst der Genfer Flughafen?",
    "Wo wurde die erste Schweizer Radiostation eingerichtet?",
    "Wen besiegte die Schweizer bei Morgarten?",
    "In welcher Sportart brauchte maqn einen Caddie?",
    "Wann wurde der Gotthardtunnel eingeweiht?",
    "Welcher Vogel kann 50km/h laufen?",
    "Zu welcher Sportart gehört der Begriff Damengambil?",
    "Wer trat im Dezember 1984 aus der Unesco aus?",
    "Wer spielte die Hauptrolle in  der Fernsehserie über Richard Wagner?"

]

exports.randomJokeQuestion = () => {
    const randomNumber = Math.floor(Math.random() * Math.floor(44));
    return myObj.QuestionAnswer[randomNumber];
};