<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span
        >&copy; {{ new Date().getFullYear() }} -
        <strong
          ><a
            target="_blank"
            href="https://github.com/SvenC56"
            class="white--text"
            >SvenC56</a
          ></strong
        ></span
      >
      <v-btn
        class="ml-2"
        icon
        small
        target="_blank"
        href="https://github.com/SvenC56/teamspeak-channelcreator"
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'TeamSpeak Channelcreator',
    }
  },
}
</script>
