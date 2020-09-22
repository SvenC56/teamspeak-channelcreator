<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-data-table
        :headers="headers"
        :items="assignments"
        :loading="loading"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Assignments</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >New Item</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <span>TeamSpeak Parent Channel</span>
                        <v-select
                          v-model.number="editedItem.parent"
                          :items="teamspeakChannelsFixed"
                          item-text="channelName"
                          item-value="cid"
                          single-line
                          hint="Required"
                          :persistent-hint="true"
                          class="mt-0 pt-0"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.trim="editedItem.prefix"
                          label="Channel Prefix"
                          hint='e.g. "Channel"'
                          :persistent-hint="true"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.trim="editedItem.topic"
                          label="Channel Topic"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea
                          v-model.trim="editedItem.description"
                          label="The channel's description"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model.number="editedItem.min"
                          type="number"
                          label="Minimum channels to create"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model.number="editedItem.max"
                          type="number"
                          label="Maximum channels to create"
                          hint="0 = unlimited"
                          :persistent-hint="true"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-select
                          v-model="editedItem.codec"
                          :items="codec"
                          item-text="key"
                          item-value="value"
                          label="Audio codec"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model.number="editedItem.joinPower"
                          type="number"
                          label="Required join power"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-subheader>Voice Quality</v-subheader>
                        <v-slider
                          v-model.number="editedItem.quality"
                          step="1"
                          ticks="always"
                          max="10"
                          thumb-label
                          tick-size="4"
                        ></v-slider>
                      </v-col>
                    </v-row>
                  </v-container>
                  <template v-if="error">
                    <v-alert
                      v-for="(item, index) of error"
                      :key="index"
                      type="error"
                      v-text="item"
                    >
                    </v-alert>
                  </template>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.shield`]="{ item }">
          <v-icon v-if="item.shield" small>mdi-check-circle-outline</v-icon>
          <v-icon v-else small> mdi-checkbox-blank-circle-outline </v-icon>
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          <span v-text="getRelativeTimestamp(item.createdAt)"></span>
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">
          <span v-text="getRelativeTimestamp(item.updatedAt)"> </span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import relativeTime from 'dayjs/plugin/relativeTime'

export default {
  data() {
    return {
      dialog: false,
      error: null,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Parent Channel', value: 'parent', sortable: true },
        { text: 'Topic', value: 'topic', sortable: false },
        { text: 'Min Channels', value: 'min', sortable: false },
        { text: 'Max Channels', value: 'max', sortable: false },
        { text: 'Created At', value: 'createdAt', sortable: false },
        { text: 'Updated At', value: 'updatedAt', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        topic: '',
        description: '',
        codec: '4',
        min: 1,
        max: 0,
        joinPower: 0,
        parent: 0,
        prefix: '',
        quality: 5,
      },
      defaultItem: {
        topic: '',
        description: '',
        codec: '4',
        min: 1,
        max: 0,
        joinPower: 0,
        parent: 0,
        prefix: '',
        quality: 5,
      },
      teamspeakChannels: [],
      teamspeakChannelsFixed: [],
      assignments: [],
      loading: true,
      codec: [
        { key: 'SPEEX_NARROWBAND', value: '0' },
        { key: 'SPEEX_WIDEBAND', value: '1' },
        { key: 'SPEEX_ULTRAWIDEBAND', value: '2' },
        { key: 'CELT_MONO', value: '3' },
        { key: 'OPUS_VOICE', value: '4' },
        { key: 'OPUS_MUSIC', value: '5' },
      ],
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    teamspeakChannels: {
      handler(val) {
        this.teamspeakChannelsFixed = val.map((channel) => ({
          ...channel,
          pid: parseInt(channel.pid, 10),
          cid: parseInt(channel.cid, 10),
        }))
      },
      deep: true,
    },
  },

  async mounted() {
    this.$dayjs.extend(relativeTime)
    await this.getData()
  },

  methods: {
    async getData() {
      this.loading = true
      await Promise.all([this.getTeamSpeakChannels(), this.getAssignments()])
      this.loading = false
    },

    async getTeamSpeakChannels() {
      this.teamspeakChannels = await this.$axios.$get('teamspeak/channel')
    },

    async getAssignments() {
      this.assignments = await this.$axios.$get('assignment')
    },

    getRelativeTimestamp(timestamp) {
      return timestamp !== null ? this.$dayjs(timestamp).fromNow() : ''
    },

    editItem(item) {
      this.error = null
      this.editedIndex = this.assignments.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      const index = this.assignments.indexOf(item)
      const id = this.assignments[index].id
      const isConfirmed = confirm('Are you sure you want to delete this item?')
      if (isConfirmed) {
        try {
          await this.$axios.delete(`assignment/${id}`)
        } catch (e) {
          this.error = e.response
          return
        }
        this.assignments.splice(index, 1)
      }
    },

    close() {
      this.dialog = false
      this.error = null
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      const id = this.editedItem.id
      delete this.editedItem.id
      if (this.editedIndex > -1) {
        // Update item
        try {
          const payload = {
            ...this.editedItem,
            codec: parseInt(this.editedItem.codec, 10),
          }
          const response = await this.$axios.patch(`assignment/${id}`, payload)
          response.data.codec = '' + response.data.codec
          Object.assign(this.assignments[this.editedIndex], response.data)
        } catch (e) {
          this.error = e.response.data.message
          return
        }
      } else {
        // Create new item
        try {
          const payload = {
            ...this.editedItem,
            codec: parseInt(this.editedItem.codec, 10),
          }
          const response = await this.$axios.post('assignment', payload)
          response.data.codec = '' + response.data.codec
          this.assignments.push(response.data)
        } catch (e) {
          this.error = e.response.data.message
          return
        }
      }
      this.close()
    },
  },
}
</script>
