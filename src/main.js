const app = Vue.createApp({
    created() { },
    data() {
        return {
            sth: '',
            optionDogUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*',
            optionCatUrl: 'https://letstalkscience.ca/sites/default/files/2020-03/calico-cat.jpg',
        };
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        init() {
        },
    }
});
app.mount('#app');