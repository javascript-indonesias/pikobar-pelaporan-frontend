<template>
  <v-container>
    <div
      v-if="!isAddAPD"
    >
      <center>
        <v-img
          src="../../../static/apd.svg"
          :aspect-ratio="1"
          max-width="250px"
          max-height="250px"
        />
      </center>
      <v-col md="6" offset-md="3">
        <center><v-label>{{ $t('label.add_logistics_label') }}</v-label></center>
      </v-col>
      <center>
        <v-btn
          color="#2E7D32"
          outlined
          @click="onClick"
        >
          {{ $t('label.add') }}
        </v-btn>
      </center>
      <v-col cols="12" sm="12" md="4" offset-md="4">
        <v-alert
          v-if="showAlert"
          type="error"
        >
          {{ $t('label.alert_logistic_needs') }}
        </v-alert>
      </v-col>
    </div>
    <ValidationObserver ref="observer">
      <v-form
        v-if="isAddAPD"
        ref="form"
        lazy-validation
      >
        <v-row
          v-for="(data, index) in logisticNeeds"
          :key="data.id"
        >
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <center><v-label class="title"><b>{{ index + 1 }}</b></v-label></center>
            <center><v-icon class="padding-10-third-step" color="red" size="25" @click="deleteData(index)">mdi-delete</v-icon></center>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="2"
          >
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <v-label class="title"><b>{{ $t('label.apd_name_spec') }}</b></v-label>
              <v-autocomplete
                v-model="data.apd"
                :placeholder="$t('label.choose_apd')"
                :items="listAPD"
                item-text="name"
                item-value="id"
                :error-messages="errors"
                outlined
                solo-inverted
                @change="setUnit(data)"
              />
            </ValidationProvider>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="2"
          >
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <v-label class="title"><b>{{ $t('label.brand') }}</b></v-label>
              <v-text-field
                v-model="data.brand"
                :placeholder="$t('label.input_brand')"
                :error-messages="errors"
                outlined
                solo-inverted
              />
            </ValidationProvider>
          </v-col>
          <v-col
            cols="4"
            sm="4"
            md="1"
          >
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|notMinus"
            >
              <v-label class="title"><b>{{ $t('label.total') }}</b></v-label>
              <v-text-field
                v-model="data.total"
                outlined
                solo-inverted
                type="number"
                :error-messages="errors"
                @change="setTotalAPD"
              />
            </ValidationProvider>
          </v-col>
          <v-col
            cols="8"
            sm="8"
            md="2"
          >
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <v-label class="title"><b>{{ $t('label.unit') }}</b></v-label>
              <v-select
                v-model="data.unitId"
                :items="data.unitList"
                outlined
                solo-inverted
                :error-messages="errors"
                item-value="unit_id"
                item-text="unit"
                @change="setUnitName(data)"
              />
            </ValidationProvider>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="2"
          >
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <v-label class="title"><b>{{ $t('label.purpose') }}</b></v-label>
              <v-text-field
                v-model="data.purpose"
                :placeholder="$t('label.input_purpose')"
                outlined
                solo-inverted
                :error-messages="errors"
              />
            </ValidationProvider>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="2"
          >
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <v-label class="title"><b>{{ $t('label.urgency_level') }}</b></v-label>
              <v-select
                v-model="data.urgency"
                :items="urgency"
                :placeholder="$t('label.input_urgency_level')"
                outlined
                solo-inverted
                :error-messages="errors"
              />
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="3" offset-md="1">
            <v-label>{{ $t('label.logistic_total') }} {{ totalLogistic }}</v-label>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="2" offset-md="1">
            <center>
              <v-btn
                color="#2E7D32"
                outlined
                @click="addLogistic"
              >{{ $t('label.add_more') }}</v-btn>
            </center>
          </v-col>
          <v-col cols="12" sm="12" md="3" offset-md="1">
            <v-alert
              v-if="showAlert"
              type="error"
            >
              {{ $t('label.alert_logistic_needs') }}
            </v-alert>
          </v-col>
        </v-row>
      </v-form>
      <v-container fluid>
        <div>
          <v-col cols="12" sm="3" md="3" class="float-right-fourth-step">
            <v-btn
              block
              class="btn-margin-positive"
              color="primary"
              @click="onNext"
            >{{ $t('label.next') }}</v-btn>
          </v-col>
          <v-col cols="12" sm="3" md="3" class="float-right-fourth-step">
            <v-btn
              block
              class="btn-margin-positive"
              outlined
              text
              @click="onPrev"
            >{{ $t('label.back') }}</v-btn>
          </v-col>
        </div>
      </v-container>
    </ValidationObserver>
  </v-container>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import EventBus from '@/utils/eventBus'
import { mapGetters } from 'vuex'

export default {
  name: 'KebutuhanLogistik',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    logisticNeeds: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      step: 3,
      isAddAPD: false,
      urgency: ['Rendah', 'Menengah', 'Tinggi'],
      totalLogistic: 0,
      idAPD: 0,
      idAlkes: 0,
      isValid: false,
      showAlert: false,
      listQueryAPD: {
        limit: 10,
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters('logistic', [
      'listAPD',
      'listApdUnit'
    ])
  },
  async created() {
    await this.getListAPD()
  },
  methods: {
    onClick() {
      this.isAddAPD = true
    },
    addLogistic() {
      this.isValid = true
      this.showAlert = false
      this.idAPD = this.idAPD + 1
      this.logisticNeeds.push({
        id: this.idAPD,
        apd: '',
        apdName: '',
        brand: '',
        total: 0,
        unitId: '',
        unitName: '',
        purpose: '',
        urgency: ''
      })
    },
    setTotalAPD() {
      this.totalLogistic = 0
      this.logisticNeeds.forEach(element => {
        this.totalLogistic = this.totalLogistic + parseInt(element.total)
      })
    },
    async setUnit(value) {
      value.unitId = ''
      value.unitName = ''
      value.unitList = await this.$store.dispatch('logistic/getListApdUnit', value.apd)
      this.listAPD.forEach(element => {
        if (element.id === value.apd) {
          value.apdName = element.name
          return
        }
      })
    },
    setUnitName(value) {
      value.unitList.forEach(element => {
        if (value.unitId === element.unit_id) {
          value.unitName = element.unit
          return
        }
      })
    },
    deleteData(index) {
      this.logisticNeeds.splice(index, 1)
      this.setTotalAPD()
      if (this.logisticNeeds.length === 0) {
        this.isValid = false
      }
    },
    async getListAPD() {
      await this.$store.dispatch('logistic/getListAPD', this.listQueryAPD)
      this.listAPD.forEach(element => {
        element.value = {
          id: element.id,
          name: element.name
        }
      })
    },
    async onNext() {
      const valid = await this.$refs.observer.validate()
      if (this.logisticNeeds.length > 0) {
        this.isValid = true
      }
      if (!valid) {
        return
      } else if (!this.isValid) {
        this.showAlert = true
        return
      }
      EventBus.$emit('nextStep', this.step)
    },
    onPrev() {
      this.isAddAPD = false
      EventBus.$emit('prevStep', this.step)
    }
  }
}
</script>
<style>
.padding-10-third-step {
  padding: 10px;
}
</style>
