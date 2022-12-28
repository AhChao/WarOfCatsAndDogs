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
            questionCount: 0,
            questionMax: 10,
            questionImg: '',
            options: ['0', '1', '2', '3'],
            optionCount: 4,
            answer: 0,
            breedOptions: [],
            dogBreedTranslation: [],
            answerFilling: [],
            scoreRecording: [],
            playerColor: ['#CCC', '#BBB'],
            playerIcon: [],
            modeTag: {
                "timeCount": "true",
                "nextByButton": "true",
                "displayNameInZH": 'true',
                "displayNameInEN": 'true',
            },//timecount / wait for next / 
            nextButtonDisplay: false,
            counterRemaining: 10,
            counterMax: 10,
            counterInstance: null,
            playerRoundTimeScore: [0, 0],
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
                this.playerRoundTimeScore.push('-');
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
                this.playerRoundTimeScore.push('-');
                this.answerFilling.push('-');
                this.scoreRecording.push(0);
                this.playerIcon.push(this.getRandom(16));
            }
            this.phase = "battle";
            this.updateBreed();
            if (this.modeTag.nextByButton && this.questionCount < this.questionMax) {
                this.nextButtonDisplay = true;
            } else {
                this.newQuestion();
            }
        },
        getGoogleTranslateElementInit() {
            new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        },
        submitAnswer(optionIndex, playerIndex) {
            if (this.answerFilling[playerIndex - 1] != '-') return;//already select answer 
            this.answerFilling[playerIndex - 1] = optionIndex;
            if (this.modeTag.timeCount) this.playerRoundTimeScore[playerIndex - 1] = this.counterRemaining;
            if (this.answerFilling.filter(x => x != '-').length != this.playerCount) {
                return
            }
            this.roundSettlement();

        },
        roundSettlement() {
            if (this.modeTag.timeCount) {
                clearInterval(this.counterInstance);
            }
            for (let i = 0; i < this.playerCount; i++) {
                if (this.answerFilling[i] == this.answer) {
                    if (this.modeTag.timeCount) {
                        this.scoreRecording[i] += this.playerRoundTimeScore[i];
                    }
                    else {
                        this.scoreRecording[i]++;
                    }
                }
            }
            let answerEN = "Answer is " + this.capitalizeFirstLetter(this.breedOptions[this.options[this.answer]]) + "!";
            let answerZH = "答案是 " + this.dogBreedTranslation[this.breedOptions[this.options[this.answer]]] + "!";
            this.showMessageWithToast(this.modeTag.displayNameInZH ? answerZH : answerEN);
            setTimeout(() => {
                if (this.modeTag.nextByButton && this.questionCount < this.questionMax) {
                    this.nextButtonDisplay = true;
                } else {
                    this.newQuestion();
                }
            }, 3000);
        },
        updateBreed() {
            if (this.battleType == 'dog') {
                let callingResult = this.callApiWithGet('https://dog.ceo/api/breeds/list/all');
                this.breedOptions = Object.keys(callingResult.message);
            }
        },
        newQuestion() {
            this.questionCount++;
            if (this.questionCount > this.questionMax) {
                let highestScore = -1;
                let highestIndex = -1;
                for (let i = 0; i < this.scoreRecording.length; i++) {
                    if (this.scoreRecording[i] > highestScore) {
                        highestScore = this.scoreRecording[i];
                        highestIndex = i;
                    }
                }
                let winnerMessage = this.modeTag.displayNameInZH ?
                    ("玩家 " + (highestIndex * 1 + 1) + " 以 " + highestScore + " 分獲得勝利！") :
                    ("Player " + (highestIndex * 1 + 1) + " won the battle with " + highestScore + " points!");
                alert(winnerMessage);
                return;
            }
            if (this.modeTag.nextByButton) {
                this.nextButtonDisplay = false;
            }
            this.answerFilling.fill('-');
            let totalBreedCount = this.breedOptions.length;
            this.options.fill('-');
            let tempOption = this.getNonDuplicatedRandom(this.optionCount, totalBreedCount);
            console.log(tempOption);
            this.answer = this.getRandom(this.optionCount);
            this.questionImg = this.getImageByBreed(tempOption[this.answer]);
            console.log(this.questionImg);
            let questionImgEle = document.getElementById("questionImg");
            while (!questionImgEle.complete) {
                //just wait till the image loaded 
            }
            this.options = tempOption;
            if (this.modeTag.timeCount) {
                this.counterRemaining = this.counterMax;
                this.counterInstance = setInterval(() => {
                    this.counterRemaining--;
                    if (this.counterRemaining <= 0) {
                        clearInterval(this.counterInstance);
                    }
                }, 1000);
            }
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
        capitalizeFirstLetter(str) {
            if (str == null) return "";
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        insertBeforeCapital(str) {
            return str.replace(/([A-Z])/g, ' $1').trim();
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