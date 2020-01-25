<template>
  <v-container>
    <h1 class="display-1 mb-5">TeamSpeak Channel Creator</h1>
    <v-data-table
      :headers="headers"
      :items="channelSync"
      sort-by="parent"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
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
                      <v-select
                        v-model="editedItem.parent"
                        :items="channels"
                        item-text="channel_name"
                        item-value="cid"
                        :rules="[rules.required]"
                        label="Parent Channel"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.prefix"
                        :rules="[rules.required, rules.prefixCounter]"
                        label="Prefix for channel"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.minChannel"
                        type="number"
                        :rules="[rules.minNumber]"
                        label="Min. number of channels"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.maxUsers"
                        type="number"
                        label="Max. number of users in the channel"
                        hint="0 = unlimited"
                        persistent-hint
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="editedItem.joinPower"
                        :rules="[rules.joinPower]"
                        type="number"
                        label="Required join power"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="editedItem.codec"
                        :items="codecs"
                        item-text="key"
                        item-value="value"
                        label="Audio codec"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-subheader>Voice Quality</v-subheader>
                      <v-slider
                        v-model="editedItem.quality"
                        step="1"
                        ticks="always"
                        max="10"
                        thumb-label
                        tick-size="4"
                      ></v-slider>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.topic"
                        :rules="[rules.topicCounter]"
                        label="The channel's topic"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.description"
                        :rules="[rules.descriptionCounter]"
                        label="The channel's description"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        No Data
      </template>
      <template v-slot:item.parent="{ item }">
        {{ getChannelById(item.parent).channel_name }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios'
const dev = process.env.NODE_ENV !== 'production'
let baseURL = null
if (dev) {
  baseURL = 'http://localhost:3000'
} else {
  baseURL = process.env.BASE_URL
}
const instance = axios.create({
  baseURL
})

export default {
  name: 'MainPage',

  async asyncData({ params }) {
    let channelSync = null
    let channels = null
    try {
      channelSync = await instance.get('/api/channelsync')
      channels = await instance.get('/api/teamspeak/channels')
    } catch (error) {
      throw new Error(error)
    }
    channelSync = channelSync.data
    channels = channels.data
    return { channelSync, channels }
  },

  data: () => ({
    dialog: false,
    channels: [],
    channelSync: [],
    headers: [
      { text: 'Parent Channel', value: 'parent' },
      { text: 'Prefix', value: 'prefix' },
      { text: 'Min. Channels', value: 'minChannel' },
      { text: 'Max. Users', value: 'maxUsers' },
      { text: 'Codec', value: 'codec' },
      { text: 'Codec Quality', value: 'quality' },
      { text: 'Join Power', value: 'joinPower' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: '',
      parent: '',
      prefix: '',
      minChannel: 1,
      maxUsers: 0,
      codec: 4,
      quality: 5,
      joinPower: 0,
      topic: '',
      description: ''
    },
    defaultItem: {
      parent: '',
      prefix: '',
      minChannel: 1,
      maxUsers: 0,
      codec: 4,
      quality: 5,
      joinPower: 0,
      topic: '',
      description: ''
    },
    codecs: [
      { key: 'Speex Schmalband', value: 0 },
      { key: 'Speex Breitband', value: 1 },
      { key: 'Speex Ultra-Breitband', value: 2 },
      { key: 'CELT Mono', value: 3 },
      { key: 'Opus Voice', value: 4 },
      { key: 'Opus Music', value: 5 }
    ],
    rules: {
      required: (value) => !!value || 'Required',
      prefixCounter: (value) => value.length <= 37 || 'Max 37 characters',
      minNumber: (value) => (value >= 0 && value <= 50) || 'Max 50 channels',
      joinPower: (value) =>
        (value >= 0 && value <= 100) || 'Max 100 join power',
      topicCounter: (value) => value.length <= 255 || 'Max 255 characters',
      descriptionCounter: (value) =>
        value.length <= 8192 || 'Max 8192 characters'
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  methods: {
    getChannelById(cid) {
      const channel = this.channels.find((x) => x.cid === cid)
      if (channel && channel.cid) {
        return channel
      }
      return cid
    },
    editItem(item) {
      this.editedIndex = this.channelSync.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      const index = this.channelSync.indexOf(item)
      const isConfirmed = confirm('Are you sure you want to delete this item?')
      if (isConfirmed) {
        try {
          await instance.delete('/api/channelsync', {
            data: { id: this.channelSync[index].id }
          })
        } catch (error) {
          throw new Error(error)
        }
        this.channelSync.splice(index, 1)
      }
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async save() {
      let response = null
      if (this.editedIndex > -1) {
        try {
          response = await instance.patch('/api/channelsync', {
            data: this.editedItem
          })
        } catch (error) {
          throw new Error(error)
        }
        Object.assign(this.channelSync[this.editedIndex], response.data)
      } else {
        try {
          response = await instance.post('/api/channelsync', {
            data: this.editedItem
          })
        } catch (error) {
          throw new Error(error)
        }
        this.channelSync.push(response.data[response.length - 1])
      }
      this.close()
    }
  }
}
</script>
