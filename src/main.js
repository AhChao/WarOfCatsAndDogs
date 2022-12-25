const app = Vue.createApp({
    created() { },
    data() {
        return {
            battleType: '',//init='',cat/dog after chosen
            optionDogUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*',
            optionCatUrl: 'https://letstalkscience.ca/sites/default/files/2020-03/calico-cat.jpg',
            dogApi: 'https://dog.ceo/dog-api/', //https://dog.ceo/api/breed/{breed}/images,
            playerCount: 2,
            questionImg: '',
            options: ['0', '1', '2', '3'],
            optionCount: 4,
            answer: 0,
            breedOptions: [],
        };
    },
    mounted() {
        this.init();
    },
    computed: {
    },
    methods: {
        init() {
            this.chooseBattleType('dog');
        },
        chooseBattleType(type) {
            this.battleType = type;
            this.updateBreed();
            this.newQuestion();
        },
        getGoogleTranslateElementInit() {
            new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        },
        submitAnswer(optionIndex, playerIndex) {
            console.log(optionIndex, playerIndex);
            alert("Answer is " + this.breedOptions[this.options[this.answer]] + "!");
            this.newQuestion();
        },
        getDogQuestion() {

        },
        updateBreed() {
            if (this.battleType == 'dog') {
                let callingResult = this.callApiWithGet('https://dog.ceo/api/breeds/list/all');
                this.breedOptions = Object.keys(callingResult.message);
            }
        },
        newQuestion() {
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
        }

    }
});
app.mount('#app');