<template>
  <v-app>
    <v-app-bar v-if="stage!=3" app color="primary" dark height=28>
      
      <h3 style='cursor:pointer;' @click='stage=1'>d8dataworks</h3>

      <v-spacer></v-spacer>

      <v-icon style='cursor:pointer;margin-right:8px;'>mdi-github-circle</v-icon>
      <v-icon size=22 style='cursor:pointer;margin-top:2px;margin-right:8px;'>mdi-discord</v-icon>
      <v-icon size=28 style='cursor:pointer;margin-right:8px;'>mdi-youtube</v-icon>

    </v-app-bar>

    <v-content>
      <div v-if="stage==1" class=gvt @click='stage++' style='background:white;'>
        <Hello/>
      </div>
      <div v-if="stage==2" class=gvt style='background:white;'>
        <Configure :on_play=on_play />
      </div>
      <div v-if="stage==3" class=gvt style='background:white;'>
        <Practice :rules=rules :selected=selected :on_back=on_back />
      </div>
    </v-content>
  </v-app>
</template>

<script>

import Hello from './components/Hello';
import Configure from './components/Configure';
import Practice from './components/Practice';

export default 
{
  name: 'App',

  components: {
    Hello,
    Configure,
    Practice
  },

  methods:
  {
    on_play(selected,rules)
    {
      this.selected = selected;
      this.rules = rules;
      this.stage++;
    },
    on_back()
    {
      this.stage--;
    }
  },

  data: () => ({
    rules:{},
    selected:[],
    stage:1
  }),
};

</script>

<style>
    @import './css/vgrid.css';

/* width */
    ::-webkit-scrollbar {
        width: 2px;
        height:10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: var(--scroll-track, #f1f1f1);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: var(--scroll-thumb, #888);
    }

/* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: var(--scroll-thumb-hover, #555);
    }

    body
    {
        overflow:hidden;
    }

    html 
    {
        overflow: hidden !important;
        overflow-y: hidden;
    }
</style>