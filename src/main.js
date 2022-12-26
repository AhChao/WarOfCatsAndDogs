import translation from '../src/translation.js'
const app = Vue.createApp({
    created() { },
    data() {
        return {
            battleType: '',//init='',cat/dog after chosen
            optionDogUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*',
            optionCatUrl: 'https://letstalkscience.ca/sites/default/files/2020-03/calico-cat.jpg',
            wikiLink: 'https://en.wikipedia.org/wiki/', //append name to search page,
            playerCount: 2,
            questionCount: 10,
            questionImg: '',
            options: ['0', '1', '2', '3'],
            optionCount: 4,
            answer: 0,
            breedOptions: [],
            dogBreedTranslation: [],
            displayNameInZH: true,
            displayNameInEN: true,
            answerFilling: [],
            scoreRecording: [],
            playerColor: ['#CCC', '#BBB'],
            playerIcon: [],
            phase: 'selectBattleType',//selectBattleType, selectSetup, battle
        };
    },
    mounted() {
        this.init();
        this.dogBreedTranslation = translation.dogBreedTranslation;
    },
    computed: {
    },
    methods: {
        init() {
            //this.chooseBattleType('dog');
            this.phase = "selectBattleType";
            this.answerFilling = [];
            this.scoreRecording = [];
            for (let i = 0; i < this.playerCount; i++) {
                this.answerFilling.push('-');
                this.scoreRecording.push(0);
                this.playerIcon.push(this.getRandom(16));
            }
        },
        chooseBattleType(type) {
            this.battleType = type;
            this.phase = "selectSetup";
        },
        updateSetup() {
            this.answerFilling = [];
            this.scoreRecording = [];
            for (let i = 0; i < this.playerCount; i++) {
                this.answerFilling.push('-');
                this.scoreRecording.push(0);
                this.playerIcon.push(this.getRandom(16));
            }
            this.phase = "battle";
            this.updateBreed();
            this.newQuestion();
        },
        getGoogleTranslateElementInit() {
            new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        },
        submitAnswer(optionIndex, playerIndex) {
            console.log(this.answerFilling, playerIndex, this.answerFilling[playerIndex - 1]);
            if (this.answerFilling[playerIndex - 1] != '-') return;//already select answer 
            this.answerFilling[playerIndex - 1] = optionIndex;
            console.log(this.answerFilling.filter(x => x != '-').length);
            if (this.answerFilling.filter(x => x != '-').length != this.playerCount) {
                return
            }
            this.roundSettlement();

        },
        roundSettlement() {
            for (let i = 0; i < this.playerCount; i++) {
                if (this.answerFilling[i] == this.answer) this.scoreRecording[i]++;
            }
            let answerEN = "Answer is " + this.capitalizeFirstLetter(this.breedOptions[this.options[this.answer]]) + "!";
            let answerZH = "答案是 " + this.dogBreedTranslation[this.breedOptions[this.options[this.answer]]] + "!";
            this.showMessageWithToast(this.displayNameInZH ? answerZH : answerEN);
            setTimeout(() => this.newQuestion(), 3000);
        },
        updateBreed() {
            if (this.battleType == 'dog') {
                let callingResult = this.callApiWithGet('https://dog.ceo/api/breeds/list/all');
                this.breedOptions = Object.keys(callingResult.message);
            }
        },
        newQuestion() {
            this.answerFilling.fill('-');
            let totalBreedCount = this.breedOptions.length;
            this.options = this.getNonDuplicatedRandom(this.optionCount, totalBreedCount);
            this.answer = this.getRandom(this.optionCount);
            console.log(this.options, this.answer, this.options[this.answer]);
            this.questionImg = this.getImageByBreed(this.options[this.answer]);

        },
        getImageByBreed(breedIndex) {
            if (this.battleType == 'dog') {
                return this.callApiWithGet('https://dog.ceo/api/breed/' + this.breedOptions[breedIndex] + '/images/random/1').message;
            }
        },
        callApiWithGet(apiUrl) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", apiUrl, false); // false for synchronous request
            xmlHttp.send(null);
            return JSON.parse(xmlHttp.responseText);
        },
        getNonDuplicatedRandom(count, max) {
            let result = new Set();
            while (result.size < count) {
                result.add(this.getRandom(max));
            }
            return Array.from(result);
        },
        getRandom(max) {//0-max-1
            return Math.floor(Math.random() * max);
        },
        capitalizeFirstLetter(string) {
            if (string == null) return "";
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        showMessageWithToast(msg) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            document.getElementById("snackbar").innerText = msg;
        },
    }
});
app.mount('#app');
app.component('translation', translation);