const Obj = {
    janeinfrage: [
    "Stimmt es, dass du gerne lachst?",
    "Stimmt es, dass du gerne Fußball spielst?",
    "Stimmt es dass deine Eltern dich liebhaben?",
    "Stimmt es dass du gerne singst?",
    "Stimmt es dass du viele Freunde hast?",
    "Stimmt es dass du gerne in den Arm genommen wirst?",
    "Stimmt es dass du viele Witze machst?",
    "Stimmt es,  dass du ordentlich bist?",
    "Stimmt es, dass du gerne Süßes isst?",
    "Stimmt es, dass du gerne malst?",
    "Stimmt es, dass du viel draußen spielst?",
    "Stimmt es,  dass du gerne schwimmst?",
    "Stimmt es, dass deine Lieblingsfarbe rot ist?",
    "Stimmt es, dass du gerne in die Schule gehst?",
    "Stimmt es, dass du gerne Hausaufgaben machst?",
    "Stimmt es, dass du gerne Musik hörst?",
    "Stimmt es, dass  es dir wichtig ist, in jeder Lage gut gestylt zu sein?",
    "Stimmt es, dass du schreist und Sachen wirfst, wenn du wütend bist?",
    "Stimmt es, dass du nicht mehr sprichst und weggehst, wenn du wütend bist?",
    "Stimmt es, dass es dir unangenehm ist, wenn man dich lobt?",
    "Stimmt es, dass Komplimente dir peinlich sind?",
    "Stimmt es, dass du dich freust, wenn jemand dich lobt?",
    "Stimmt es, dass du dich freust, wenn jemand dich lobt?",
    "Stimmt es, dass du schon einmal richtig Angst hattest?",
    "Stimmt es, dass du es nicht magst, wenn andere sagen, dass du etwas falsch gemacht hast?",
    "Stimmt es, dass du es ganz schrecklich findest, wenn du etwas nicht kannst?",
    "Stimmt es, dass du manchmal betest?",
    "Stimmt es, dass du nie in der Bibel liest?",
    "Stimmt es, dass du an Gott glaubst?",
    "Stimmt es, dass du gerne in eine Kirche gehst?",
    "Stimmt es, dass immer wieder sonntags in die Kirche gehst?",
    "Stimmt es, dass du an ein Leben nach dem Tod glaubst?",
    "Stimmt es, dass du in deinem Leben Gott um Hilfe bittest?",
    "Stimmt es, dass du einen Pfarrer kennst?",
    "Hast du heute schon geduscht?",
    "Bist du Verheiratet?",
    "Hast du Kinder?",
    "Gehst du gene in den Wald?",
    "Hast du schonmal etwas geklaut?",
    "Die Sonne geht im Süden auf.",
    "Athen ist die Hauptstadt von Griechenland.",
    "Die Vereinsfarben des FC Barcelona sind Blau-Rot.",
    "Sind Sie nicht auch der Meinung, dass wir das wir schon viel zu lange Auto fahren?",
    "Sind wir bald da?",
    "Ist das Wetter bei dir auch schön?"
]

},


exports.randomQuestion = () => {
    const randomQuestion = Math.floor(Math.random() * Math.floor(44));
    return Obj.janeinfrage[randomQuestion];
};