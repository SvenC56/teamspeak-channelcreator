<template>
  <v-app>
    <v-content>
      <main-page />
    </v-content>
  </v-app>
</template>

<script>
import MainPage from './components/MainPage'

export default {
  name: 'App',

  components: {
    MainPage,
  },

  data: () => ({
    //
  }),
}
</script>
