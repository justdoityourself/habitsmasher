<!-- Copyright (C) 2020 D8DATAWORKS - All Rights Reserved -->

<template>
  <v-app>
    <v-app-bar v-if="stage!=3" app color="primary" dark height=28>
      
      <h3 style='cursor:pointer;' @click='open_link("https://www.youtube.com/channel/UC4kH4isGJvL2vWhH5JOWyVw")'>d8dataworks</h3>

      <v-spacer></v-spacer>

      <v-icon style='cursor:pointer;margin-right:8px;' @click='open_link("https://github.com/justdoityourself")'>mdi-github-circle</v-icon>
      <v-icon size=22 style='cursor:pointer;margin-top:2px;margin-right:8px;' @click='open_link("https://discord.gg/YEhvW8E")'>mdi-discord</v-icon>
      <v-icon size=28 style='cursor:pointer;margin-right:8px;' @click='open_link("https://www.youtube.com/channel/UC4kH4isGJvL2vWhH5JOWyVw")'>mdi-youtube</v-icon>

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

import * as pwa from './js/pwa.js'

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
    },
    open_link(link)
    {
      window.open(link, "_blank");
    },
    update()
    {
        pwa.RequestLatestVersion(1,async (e)=>
        {
            if(e)
            {
                console.log("Failed to request version information.");
                return;
            }

            let v = await pwa.IsUpdateAvailable();

            if(!v) return;

            if(v && v[1].force)
            {
                pwa.Update();
                return;
            }

            confirm(`Update ${v[1].version} avalable. Install now?`) && pwa.Update();
        });
    },
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

    ::-webkit-scrollbar {
        width: 2px;
        height:10px;
    }

    ::-webkit-scrollbar-track {
        background: var(--scroll-track, #f1f1f1);
    }

    ::-webkit-scrollbar-thumb {
        background: var(--scroll-thumb, #888);
    }

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