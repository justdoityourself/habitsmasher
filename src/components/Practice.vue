<template>
  <div class=gvt @click='finished' style='--gr:1fr;--gc:64px 1fr 64px;' v-bind:style="{ background: current.color }">
    <div class=gvt style='--gr:64px 1fr 64px;--gc:1fr;'>
      <div>
        <v-icon size=48 @click.stop=on_back>cancel</v-icon>
      </div>
      <div></div>
      <div style='font-weight:bold;font-size:24px;'>{{total_percent}}%</div>
    </div>
    <div class=gvt style='--gr:auto 18px 1fr auto;--gc:1fr;'>
        <div style='font-weight:bold;font-size:24px;'>{{current.description}}</div>
        <div style='font-weight:bold;font-size:18px;'>{{msg}}</div>
        <div style='font-size:32px;font-weight:bold;'>
          <span style='font-weight:bold;font-size:14px;'>{{current_percent}}%</span> {{current.name}} <span style='font-weight:bold;font-size:14px;'>{{remaining}}</span>
        </div>
        <div style='font-weight:bold;font-size:24px;'>{{timer}}</div>
    </div>

    <div class=gvt style='--gr:64px 1fr 64px;--gc:1fr;'>
      <div>
        <v-icon size=48 v-if=speak @click.stop='speak=!speak;'>volume_off</v-icon>
        <v-icon size=48 v-else @click.stop='speak=!speak;'>volume_up</v-icon>
      </div>
      <div></div>
      <div>
        <v-icon size=48 v-if=buzz @click.stop='buzz=!buzz;'>mdi-vibrate-off</v-icon>
        <v-icon size=48 v-else @click.stop='buzz=!buzz;'>mdi-vibrate</v-icon>
      </div>
    </div>
  </div>
</template>

<script>

  import * as tts from '../js/tts.js'
  import * as vcmd from '../js/voice_command.js'
  import * as mcmd from '../js/motion_command.js'

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
      },
      total_percent()
      {
        return Math.floor((this.success+1) / this.attempts * 100);
      },
      current_percent()
      {
        if(!(this.current.name in this.detailed))
          return "100";
        let c = this.detailed[this.current.name];

        return Math.floor((c.success) / c.attempts * 100);
      }
    },

    data: () => ({
      time:0,
      prev:-1,
      remaining_time:0,
      interval:null,
      attempts:0,
      success:0,
      detailed:{},
      msg:"",
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
            return 900;
        }
      },
      voice_command(cmd,level)
      {
        if(level);

        switch(cmd)
        {
          case "done":
          case "got it":
          case "finished":
          case "complete":
            this.msg = cmd;
            this.finished();
            break;
          default:
            this.msg = "? " + cmd + " ?";
            break;
        }

        setTimeout(()=>this.msg="",2000);
      },
      motion_command()
      {
        console.log("here");
        this.finished();
      },
      next()
      {
          this.attempts++;

          if(this.current.name)
          {
            if(!(this.current.name in this.detailed))
              this.detailed[this.current.name] = {attempts:0,success:0};

            this.detailed[this.current.name].attempts ++;
          }

          this.remaining_time = this.rules.duration;

          let idx = this.prev;
          while(idx == this.prev)
            idx = Math.floor(Math.random()*this.selected.length);

          this.prev = idx;

          this.current = this.selected[idx];

          if(this.rules.read_name && this.speak)
            tts.SpeakText(this.current.name);
          if(this.rules.read_description && this.speak)
            tts.SpeakText(this.current.description);
          
          if(this.rules.buzz && this.buzz)
          {
            let v = [this.decode_buzzer(this.current.buzz1),200,this.decode_buzzer(this.current.buzz2),200,this.decode_buzzer(this.current.buzz3)];
            window.navigator.vibrate(v);
          }
      },
      finished()
      {
        this.success++;

        if(this.current.name)
        {
          if(!(this.current.name in this.detailed))
            this.detailed[this.current.name] = {attempts:0,success:0};

          this.detailed[this.current.name].success ++;
        }

        this.next();
      },
      event_callback()
      {
        if(!this.remaining_time)
          this.next();
        else
          this.remaining_time--;

        this.time++;
      },
    },

    beforeDestroy()
    {
      if(this.rules.motion_command) mcmd.stop_motion_polling();
      if(this.rules.voice_command) vcmd.cancel_listen();
      clearInterval(this.interval);
    },

    mounted()
    {
      this.event_callback();
      this.interval = setInterval(this.event_callback,1000);

      if(this.rules.motion_command) mcmd.start_motion_polling(this.motion_command);
      if(this.rules.voice_command) vcmd.listen_for(["done","got it","finished","complete"],this.voice_command);
    }
  }

</script>


