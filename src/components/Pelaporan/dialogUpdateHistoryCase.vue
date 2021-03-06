<template>
  <v-dialog v-model="show" max-width="70%">
    <v-card>
      <v-card-title class="title">
        {{ $t('label.update_case_history') }}
        <v-spacer />
        <v-icon @click="show = false">mdi-close</v-icon>
      </v-card-title>
      <v-divider />
      <v-container>
        <ValidationObserver ref="observer">
          <v-form
            ref="form"
            lazy-validation
          >
            <v-row>
              <v-col auto>
                <v-expansion-panels
                  v-model="panelRiwayat"
                  multiple
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-lg">
                      {{ $t('label.form_case_history_title') }}
                    </v-expansion-panel-header>
                    <v-divider />
                    <v-expansion-panel-content>
                      <form-case-history :form-pasien.sync="formRiwayatPasien" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-btn
                    :loading="loading"
                    bottom
                    block
                    @click="handleCancel"
                  >
                    {{ $t('label.cancel') }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    :loading="loading"
                    class="ml-2"
                    color="success"
                    bottom
                    block
                    @click="handleSaveHistory"
                  >
                    {{ $t('label.update_history') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ValidationObserver>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import { ResponseRequest, symptomOptions, additionalConditionOptions, answerList, yesOrNoAnswer } from '@/utils/constantVariable'
import { mapGetters } from 'vuex'
import EventBus from '@/utils/eventBus'

export default {
  name: 'DialogUpdateHistoryCase',
  components: {
    ValidationObserver
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    formRiwayatPasien: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      show: this.showDialog,
      hospitalWestJavaList: [],
      hospitalNonWestJavaList: [],
      formatDate: 'YYYY/MM/DD',
      panelRiwayat: [0],
      panelListRiwayat: [0],
      disabledReportResource: false,
      arrayRegion: null,
      symptomOptions,
      additionalConditionOptions,
      answerList,
      yesOrNoAnswer
    }
  },
  computed: {
    ...mapGetters('region', [
      'hospitalList'
    ]),
    ...mapGetters('user', [
      'roles',
      'fullName'
    ])
  },
  watch: {
    showDialog(value) {
      this.show = value
    },
    show(value) {
      this.$emit('update:show', value)
    }
  },
  async mounted() {
    const paramHospitalWestJava = { 'rs_jabar': true }
    const paramHospitalNonWestJava = { 'rs_jabar': false }
    const responseWestJava = await this.$store.dispatch('region/getListHospital', paramHospitalWestJava)
    this.hospitalWestJavaList = responseWestJava.data
    const responseNonWestJava = await this.$store.dispatch('region/getListHospital', paramHospitalNonWestJava)
    this.hospitalNonWestJavaList = responseNonWestJava.data
    if (this.roles[0] === 'faskes') {
      this.formRiwayatPasien.report_source = this.fullName
      this.disabledReportResource = true
    }
  },
  methods: {
    async handleSaveHistory() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        return
      }
      this.loading = true
      const response = await this.$store.dispatch('reports/createHistoryCase', this.formRiwayatPasien)
      if (response.status !== ResponseRequest.UNPROCESSABLE) {
        await this.$store.dispatch('toast/successToast', this.$t('success.case_history_data_successfully_updated'))
        await this.$store.dispatch('reports/resetFormPasien')
        await this.$store.dispatch('reports/resetRiwayatFormPasien')
        this.loading = false
        delete this.formRiwayatPasien['address_district_code']
        delete this.formRiwayatPasien['address_subdistrict_code']
        delete this.formRiwayatPasien['address_village_code']
        delete this.formRiwayatPasien['address_village_name']
        delete this.formRiwayatPasien['address_street']
        this.$emit('update:show', false)
        EventBus.$emit('refreshPageListReport', true)
      } else {
        this.loading = false
        await this.$store.dispatch('toast/errorToast', this.$t('errors.data_failed_to_save'))
      }
    },
    async handleCancel() {
      await this.$store.dispatch('reports/resetFormPasien')
      await this.$store.dispatch('reports/resetRiwayatFormPasien')
      this.$emit('update:show', false)
    }
  }
}
</script>
