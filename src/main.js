const app = Vue.createApp({
    created() { },
    data() {
        return {
            battleType: 'dog',//init='',cat/dog after chosen
            optionDogUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*',
            optionCatUrl: 'https://letstalkscience.ca/sites/default/files/2020-03/calico-cat.jpg',
            dogApi: 'https://dog.ceo/dog-api/', //https://dog.ceo/api/breed/{breed}/images,
            playerCount: 2,
            options: ['dog', 'dog1', 'dog2', 'dog3'],
        };
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        init() {
        },
        chooseBattleType(type) {
            this.battleType = type;
        },
        getGoogleTranslateElementInit() {
            new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        },
        submitAnswer(optionIndex, playerIndex) {
            console.log(optionIndex, playerIndex);

        }
    }
});
app.mount('#app');