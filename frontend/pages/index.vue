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
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Assignment name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-checkbox
                          v-model="editedItem.shield"
                          label="Protected Usergroup?"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <span>Discourse Group</span>
                        <v-select
                          v-model.number="editedItem.dcid"
                          :items="discourseGroups"
                          item-text="name"
                          item-value="id"
                          single-line
                          class="mt-0 pt-0"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <span>TeamSpeak Servergroup</span>
                        <v-select
                          v-model.number="editedItem.tsid"
                          type="number"
                          :items="teamspeakGroupsFixed"
                          item-text="name"
                          item-value="sgid"
                          single-line
                          class="mt-0 pt-0"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
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
export default {
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Protected', value: 'shield', sortable: false },
        { text: 'Discourse ID', value: 'dcid', sortable: false },
        { text: 'TeamSpeak ID', value: 'tsid', sortable: false },
        { text: 'Created At', value: 'createdAt', sortable: false },
        { text: 'Updated At', value: 'updatedAt', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        shield: false,
        dcid: 0,
        tsid: 0,
      },
      defaultItem: {
        name: '',
        shield: false,
        dcid: 0,
        tsid: 0,
      },
      discourseGroups: [],
      teamspeakGroups: [],
      teamspeakGroupsFixed: [],
      assignments: [],
      loading: true,
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
    teamspeakGroups: {
      handler(val) {
        this.teamspeakGroupsFixed = val.map((sg) => ({
          ...sg,
          sgid: parseInt(sg.sgid, 10),
        }))
      },
      deep: true,
    },
  },

  async mounted() {
    await this.getData()
  },

  methods: {
    async getData() {
      this.loading = true
      await Promise.all([
        this.getTeamSpeakGroups(),
        this.getDiscourseGroups(),
        this.getAssignments(),
      ])
      this.loading = false
    },

    async getTeamSpeakGroups() {
      this.teamspeakGroups = await this.$axios.$get('teamspeak/servergrouplist')
    },

    async getDiscourseGroups() {
      this.discourseGroups = await this.$axios.$get('discourse/groups')
    },

    async getAssignments() {
      this.assignments = await this.$axios.$get('assignment')
    },

    getRelativeTimestamp(timestamp) {
      return timestamp !== null
        ? this.$moment(timestamp).startOf('minute').fromNow()
        : ''
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
          await this.$axios.delete(`/api/assignment/${id}`)
        } catch (e) {
          this.error = e.response
          return
        }
        this.assignments.splice(index, 1)
      }
    },

    close() {
      this.dialog = false
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
          const response = await this.$axios.patch(
            `/api/assignment/${id}`,
            this.editedItem
          )
          Object.assign(this.assignments[this.editedIndex], response.data)
        } catch (e) {
          this.error = e.response
          return
        }
      } else {
        // Create new item
        try {
          const response = await this.$axios.post(
            '/api/assignment',
            this.editedItem
          )
          this.assignments.push(response.data)
        } catch (e) {
          this.error = e.response
          return
        }
      }
      this.close()
    },
  },
}
</script>
