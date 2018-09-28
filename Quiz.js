const quizfragen = [
    "Wie heisst der Götterberg der Griechen?",
    "Nenne ein anderes Wort für Kältesteppen",
    "Wie heisst das bekanteste Wahrzeichen von Paris?",
    "Wann wurde die Berliner Mauer niedergerissen?",
    "Was ist die Muttersprache von Albert Einstein?",
    "In welchem Land liegt Vancouver?",
    "Wie heisst die Griechische Göttermutter?",
    "Wie heisst die chem. Formel für Salzsäure?",
    "Auf welcher Insel-Gruppe liegt Pearl Harbor?",
    "Wo fand die Olympiade im Jahr 2000 statt?",
    "Vor welchem Tieren fürchtete sich Napoleon?",
    "Wie nannte man Louis den vierzehnten?",
    "Wer nahm Australien für die englische Krone in Besitz?",
    "Welche Hochkultur lebte in den Anden?",
    "Wann fanden die ersten Olympischen Spiele der Moderne statt?",
    "Wie hiess der erste amerikanische Präsident?",
    "Wer erfand die  erste wirklich brauchbare Dampfmaschine?",
    "Wie heisst die Hauptstadt von Pakistan?",
    "Welcher Zwergstaat befindet sich zwischen Frankreich und Spanien?",
    "An welchem Fluss liegt Kalkutta?",
    "Durch welche Stadt fliesst der Tiber?",
    "Wie heisst die Landeswährung von Venezuela?",
    "Welcher Gebirgszug trennt Europa von Asien?",
    "Zu welchem Land gehört Luxor?",
    "Wo befindet sich die Blaue Moschee?",
    "Wie heisst der Lac Léman auf deutsch?",
    "Zu welcher Gattung gehört der Koalabär?",
    "Was frisst ein Mungo?",
    "Woher stammt die Siamkatze?",
    "Wie viele Zitzen hat das Euter einer Kuh?"
];

exports.randomQuizQuestion = () => {
    const quizfrage = quizfragen[Math.floor((Math.random() * 45) + 0)];
    return quizfrage.toString();
};