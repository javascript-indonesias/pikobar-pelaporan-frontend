
<template>
  <div>
    <v-card class="d-block pa-1 mx-auto header-survey-list">
      <v-container>
        <v-row justify="space-between">
          <v-col cols="auto">
            <v-card-text class="header-survey-text">
              <div>Total Peserta : {{ totalReport }}</div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card
      outlined
    >
      <v-row>
        <v-col>
          <v-card-text>
            <div style="font-size: 1.5rem;">
              Data RDT
            </div>
          </v-card-text>
        </v-col>
        <v-col>
          <search
            :handle-search="handleSearch"
            :list-query="listQuery"
          />
        </v-col>
      </v-row>
      <hr>
      <v-row>
        <v-col auto>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">#</th>
                  <th class="text-left">KODE RDT</th>
                  <th class="text-left">KODE CASE ODP</th>
                  <th class="text-left">NAMA</th>
                  <th class="text-left">USIA</th>
                  <th class="text-left">JENIS KELAMIN</th>
                  <th class="text-left">TANGGAL PENDAFTARAN</th>
                  <th v-if="roles[0] === 'dinkeskota'" class="text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in rdtList" :key="item.index">
                  <td>{{ getTableRowNumbering(index) }}</td>
                  <td>{{ item.code_rdt }}</td>
                  <td>{{ item.id_case ? item.id_case.toUpperCase() : '-' }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.age }}</td>
                  <td>
                    <div v-if="item.gender =='P'">
                      Perempuan
                    </div>
                    <div v-else>
                      Laki-Laki
                    </div>
                  </td>
                  <td>{{ formatDatetime(item.createdAt, 'DD MMMM YYYY') }}</td>
                  <td v-if="roles[0] === 'dinkeskota'">
                    <v-card-actions>
                      <v-menu
                        :close-on-content-click="false"
                        :nudge-width="100"
                        :nudge-left="220"
                        :nudge-top="40"
                        offset-y
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            class="ma-1"
                            color="success"
                            tile
                            outlined
                            v-on="on"
                          >
                            Pilih Aksi <v-icon style="font-size: 2rem;" right>mdi-menu-down</v-icon>
                          </v-btn>
                        </template>
                        <v-card>
                          <v-list-item @click="handleDetail(item._id)">
                            Lihat Detail
                          </v-list-item>
                          <v-list-item v-if="item.final_result && item.final_result.length > 0" @click="handleEditRDT(item._id)">
                            Update Profil Peserta
                          </v-list-item>
                          <v-list-item v-if="item.final_result && item.final_result.length > 0 " @click="handleUpdateResults(item._id)">
                            Update Hasil
                          </v-list-item>
                          <v-list-item @click="handleDeleteRDT(item._id)">
                            Hapus Peserta
                          </v-list-item>
                        </v-card>
                      </v-menu>
                    </v-card-actions>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>
    <pagination
      :total="totalList "
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :on-next="onNext"
    />
    <dialog-delete
      :dialog="dialog"
      :data-deleted="dataDelete"
      :dialog-delete.sync="dialog"
      :delete-date.sync="dataDelete"
      :store-path-delete="`rdt/deleteRDT`"
      :store-path-get-list="`rdt/getListRDT`"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDatetime } from '@/utils/parseDatetime'
export default {
  name: 'RDTList',
  data() {
    return {
      totalODP: 0,
      totalPDP: 0,
      totalPositif: 0,
      totalReport: 0,
      listQuery: {
        page: 1,
        limit: 10,
        search: ''
      },
      countingReports: null,
      dialog: false,
      dataDelete: null
    }
  },
  computed: {
    ...mapGetters('rdt', [
      'rdtList',
      'totalList'
    ]),
    ...mapGetters('user', [
      'roles'
    ])
  },
  watch: {
    'listQuery.search': {
      handler: function(value) {
        if (value.length >= 3) {
          this.listQuery.page = 1
          this.handleSearch()
        } else if (value.length === 0) {
          this.listQuery.page = 1
          this.handleSearch()
        }
      },
      immediate: true
    }
  },
  async mounted() {
    await this.$store.dispatch('rdt/getListRDT', this.listQuery)
  },
  methods: {
    formatDatetime,
    async handleDetail(id) {
      await this.$router.push(`/rdt/detail/${id}`)
    },
    async handleEditRDT(id) {
      await this.$router.push(`/rdt/update/${id}`)
    },
    async handleDeleteRDT(id) {
      this.dialog = true
      this.dataDelete = await { _id: id }
    },
    async handleUpdateResults(id) {
      await this.$router.push(`/rdt/update-result/${id}`)
    },
    async handleSearch() {
      await this.$store.dispatch('rdt/getListRDT', this.listQuery)
    },
    getTableRowNumbering(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + (index + 1)
    },
    async onNext() {
      await this.$store.dispatch('rdt/getListRDT', this.listQuery)
    }
  }
}
</script>