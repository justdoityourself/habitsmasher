<template>
  <div class=gvt style='--gr:1fr;--gc:64px 1fr 64px;' v-bind:style="{ background: current.color }">
    <div class=gvt style='--gr:64px 1fr 64px;--gc:1fr;'>
      <div>
        <v-icon size=48 @click=on_back>cancel</v-icon>
      </div>
      <div></div>
      <div></div>
    </div>
    <div class=gvt style='--gr:auto 1fr auto;--gc:1fr;'>
        <div style='font-weight:bold;font-size:24px;'>{{current.description}}</div>
        <h1 class="display-2 font-weight-bold mb-3">
          {{current.name}} <span style='font-weight:bold;font-size:18px;'>{{remaining}}</span>
        </h1>
        <div style='font-weight:bold;font-size:24px;'>{{timer}}</div>
    </div>

    <div class=gvt style='--gr:64px 1fr 64px;--gc:1fr;'>
      <div>
        <v-icon size=48 v-if=speak @click='speak=!speak;'>volume_off</v-icon>
        <v-icon size=48 v-else @click='speak=!speak;'>volume_up</v-icon>
      </div>
      <div></div>
      <div>
        <v-icon size=48 v-if=buzz @click='buzz=!buzz;'>mdi-vibrate-off</v-icon>
        <v-icon size=48 v-else @click='buzz=!buzz;'>mdi-vibrate</v-icon>
      </div>
    </div>
  </div>
</template>

<script>

  import * as tts from '../js/tts.js'

  export default {
    name: 'Practice',

    props:
    {
      on_back: { type:Function },
      selected: {
        type: Array,
        required: true
      },
      rules: 
      {
        type: Object,
        required: true
      },
    },

    computed:
    {
      timer()
      {
        return this.format_timer(this.time);
      },
      remaining()
      {
        return this.format_timer(this.remaining_time);
      }
    },

    data: () => ({
      time:0,
      prev:-1,
      remaining_time:0,
      interval:null,
      speak:true,
      buzz:true,
      current:
      {
        description:'',
        name:'',
        color:"#FFFFFF"
      }
    }),

    methods:
    {
      format_timer(sec) 
      {
        let m = Math.floor(sec / 60);
        let s = ''+ sec%60;
        if(s.length == 1)
          s = '0' + s;

        return `${m}:${s}`;
      },
      decode_buzzer(name)
      {
        switch(name)
        {
          case 'tick':
            return 100;
          case 'short':
            return 300;
          case 'medium':
            return 600;
          case 'long':
            return 1100;
        }
      },
      event_callback()
      {
        if(this.time%this.rules.duration == 0)
        {
          this.remaining_time = this.rules.duration;

          let idx = this.prev;
          while(idx == this.prev)
            idx = Math.floor(Math.random()*this.selected.length);

          this.prev = idx;

          this.current = this.selected[idx];

          if(this.speak)
          {
            tts.SpeakText(this.current.name);
            if(this.rules.read_description)
              tts.SpeakText(this.current.description);
          }
          
          if(this.buzz)
          {
            let v = [this.decode_buzzer(this.current.buzz1),200,this.decode_buzzer(this.current.buzz2),200,this.decode_buzzer(this.current.buzz3)];
            window.navigator.vibrate(v);
          }
        }
        else
          this.remaining_time--;

        this.time++;
      },
    },

    beforeDestroy()
    {
      clearInterval(this.interval);
    },

    mounted()
    {
      this.event_callback();
      this.interval = setInterval(this.event_callback,1000);
    }
  }

</script>


