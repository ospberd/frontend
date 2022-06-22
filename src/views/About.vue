<template>
  <div class="about">
    <v-row align="center" justify="center">
      <v-card elevation="6" max-width="800px">
        <v-card-title>
            {{$t("message")}}
        </v-card-title>
        <v-card-text>
          <h3> <span v-html='$t("myprog")'></span> </h3>
        </v-card-text> 
      </v-card>
    </v-row>  
  </div>
</template>

<script>

export default {
  name: 'About',
      data: () => ({ })
      }

</script>