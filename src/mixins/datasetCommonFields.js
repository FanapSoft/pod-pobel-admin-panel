export default {
    data() {
        return {
            answerPacks: null,
            dataTypesList: [
                {
                    title: 'File',
                    code: 1
                },
                {
                    title: 'Text',
                    code: 2
                },
                {
                    title: 'File & Text',
                    code: 3
                }
            ],
            labelingStatusItems: [
                {
                    value: 1,
                    text: this.$t('DATASET.LABELING_ALLOWED')
                },
                {
                    value: 2,
                    text: this.$t('DATASET.NO_ITEMS')
                },
                {
                    value: 3,
                    text: this.$t('DATASET.ITEMS_COMPLETED')
                },
                {
                    value: 4,
                    text: this.$t('DATASET.LABELING_PAUSED')
                },
                {
                    value: 4,
                    text: this.$t('DATASET.LABELING_ENDED')
                }
            ],
        }
    },
    methods: {
        async getAnswerPacks() {
            try{
                let packs = await this.$http.get('/api/AnswerPacks/GetAll')
                if(packs.status < 400) {
                    this.answerPacks = packs.data.items;
                }
            } catch (errors) {
                console.log(errors)
            }
        }
    }
}
