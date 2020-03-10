<!-- Copyright (C) 2020 D8DATAWORKS - All Rights Reserved -->

<template>
  <div class=gvt>
    <div class=gvt style='max-width:800px;--gr:100px auto 100px;'>
      <div class=gvt style='--gr:1fr; --gc:64px 1fr; border-bottom: 1px solid green; margin-bottom:2px;'>
        <v-icon color=green size=48 style='cursor:pointer;' @click=new_strat>add</v-icon>
        <div class=gvt style='--gr:1fr;--gc:1fr auto 64px;'>
          <div></div>
          <v-autocomplete return-object spellcheck="false" style='direction: rtl;margin-top:16px;font-weight:bold;width:156px;' v-model="character" item-text='name' :items="characters" color="white" hide-no-data hide-selected placeholder="Character" >
            <template v-slot:item="data">
              <v-list-item-avatar>
                <img v-if="data.item.icon" :src="data.item.icon">
                <v-icon v-else size=40>mdi-account-question</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.name"></v-list-item-title>
                <v-list-item-subtitle v-html="data.item.description"></v-list-item-subtitle>
              </v-list-item-content>
            </template>

            
          </v-autocomplete>
          <v-icon v-if='character.name=="Random"' size=48>mdi-account-question</v-icon>
          <v-img v-else :src="character.icon" contain height="48" />
        </div>
      </div>

      <div class=gvt style='position:relative;'>
        <div style='position:absolute; width:100%; height:calc(100% - 16px); margin:8px 0px; overflow-y:auto;'>
          <v-data-table mobile-breakpoint=0 :hide-default-footer="true" :search="character.name" :custom-filter="filter" :single-expand="true" show-expand style='width:100%; height:100%' :headers="headers" v-model="selected" :items="strats" :items-per-page="10" class="elevation-1" show-select item-key=name>
            
            <template v-slot:item.action="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)" > mdi-pencil </v-icon>
              <v-icon small @click="deleteItem(item)" > mdi-delete </v-icon>
            </template>

            <template v-slot:expanded-item="{ item, headers }">
              <td :colspan="headers.length">
                <div class=gvt style='--gr:1fr;--gc:1fr 18px 18px;'>
                  <div style='justify-self:left;'>{{item.description}}</div>
                  <v-icon small class="mr-2" @click="editItem(item)" > mdi-pencil </v-icon>
                  <v-icon small @click="deleteItem(item)" > mdi-delete </v-icon>
                </div>
              </td>
            </template>

            <template v-slot:item.character="{ item }">
              <div class=gvt style='--gr:1fr;--gc:36px auto 1fr;'>
                <v-icon v-if="item.character=='Random'" @click="editItem(item)" size=28>mdi-account-question</v-icon> 
                <v-img @click="editItem(item)" v-else :src="get_icon(item.character)" style='cursor:pointer;' contain width="28" height="28"></v-img>
                {{ item.character }}
              </div>
            </template>

            <template v-slot:item.description="{ item }">
              <div style='max-width:144px;text-overflow: ellipsis;white-space: nowrap;overflow:hidden;'>{{item.description}}</div>
            </template>

            <template v-slot:item.buzz="{ item }">
              <div style='font-weight:bold;'>{{item.buzz1[0] + item.buzz2[0] + item.buzz3[0]}}</div>
            </template>

            <template v-slot:item.color="{ item }">
              <div style='cursor:pointer;height:18px;width:18px;' v-bind:style="{ background: item.color }" @click="editItem(item)"></div>
            </template>

          </v-data-table>
        </div>
      </div>

      <div class=gvt style='font-weight:bold;--gr:1fr; --gc:64px 1fr 64px; border-top: 1px solid green; margin-top:2px;'>
        <v-icon size=38 style='cursor:pointer;' @click='settings_dialog=true'>settings</v-icon>
        <div v-if="selected.length">{{selected.length}} Strategies</div>
        <div v-else>Select Strategies to Continue</div>
        <v-icon v-if="selected.length" color=green size=48 style='cursor:pointer;' @click='on_play(selected,rules)'>play_arrow</v-icon>
        <v-icon v-else color=gray size=48>play_arrow</v-icon>
      </div>
    </div>

    <v-dialog v-model="edit_dialog" max-width="350px">
      <v-card>
        <v-list-item v-if='this.editedIndex === -1'>
          <v-list-item-avatar> <v-icon size=48 color=green>add</v-icon></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">New Strategy</v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-avatar><v-icon size=36>edit</v-icon></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">Edit Strategy</v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>
          <div class=gvt style='--gr:64px 64px 1fr auto;--gc:1fr;'>
            <div class=gvt style='--gr:1fr;--gc:1fr 1fr;--gg:16px;'>
              <v-text-field v-model="editedItem.name" label="Name" style='width:100%;'></v-text-field>
              <v-autocomplete spellcheck="false" style='font-weight:bold;width:100%;' v-model="editedItem.character" item-text='name' :items="characters" color="white" hide-no-data hide-selected placeholder="Character" >
                <template v-slot:item="data">
                  <v-list-item-avatar>
                    <img v-if="data.item.icon" :src="data.item.icon">
                    <v-icon v-else size=40>mdi-account-question</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.name"></v-list-item-title>
                    <v-list-item-subtitle v-html="data.item.description"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </div>
            <v-text-field v-model="editedItem.description" style='width:100%;' label="Description"></v-text-field>
            <div style='width:100%;'>
              <h3>Buzz Pattern:</h3>
              <div class=gvt style='margin-left:12px;--gr:1fr; --gc:1fr 1fr 1fr;--gg:16px;width:calc(100% - 12px);'>
                <v-autocomplete style='font-weight:bold;width:100%;' v-model="editedItem.buzz1" :items="buzz_list" color="white" hide-no-data hide-selected ></v-autocomplete>
                <v-autocomplete style='font-weight:bold;width:100%;' v-model="editedItem.buzz2" :items="buzz_list" color="white" hide-no-data hide-selected ></v-autocomplete>
                <v-autocomplete style='font-weight:bold;width:100%;' v-model="editedItem.buzz3" :items="buzz_list" color="white" hide-no-data hide-selected ></v-autocomplete>
              </div>
            </div>
            <div style='width:100%;'>
              <h3>Color:</h3>
              <v-color-picker v-model='editedItem.color' style='width:100%;' class="ma-2" hide-inputs hide-canvas></v-color-picker>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="settings_dialog" max-width="350px">
      <v-card>
        <v-list-item>
          <v-list-item-avatar> 
            <v-icon size=38>settings</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">Settings</v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>
          <div class=gvt style='--gr:auto auto auto auto;--gc:1fr;justify-items:left;'>
            <v-switch v-model="rules.read_description" class="mx-2" label="Read Description"></v-switch>
            <v-switch v-model="rules.read_name" class="mx-2" label="Read Name"></v-switch>
            <v-switch v-model="rules.voice_command" class="mx-2" label="Voice Commands"></v-switch>
            <v-switch v-model="rules.motion_command" class="mx-2" label="Motion Commands"></v-switch>
            <v-switch v-model="rules.buzz" class="mx-2" label="Buzz"></v-switch>
            <v-text-field style='position:relative;left:8px;' v-model="rules.duration" type="number" label="Task Duration ( Seconds )" prepend-icon="timelapse">
              <template v-slot:append>
              </template>
            </v-text-field>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="settings_dialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

  import * as store from '../js/store.js'

  export default 
  {
    name: 'Configure',

    props:
    {
        on_play: { type:Function }
    },

    methods:
    {
      new_strat()
      {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedItem.character= this.character.name;
        this.edit_dialog = true;
      },

      editItem (item) 
      {
        this.editedIndex = this.strats.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.edit_dialog = true;
      },

      deleteItem (item) 
      {
        const index = this.strats.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.strats.splice(index, 1)
      },

      close () 
      {
        this.edit_dialog = false
        setTimeout(() => 
        {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () 
      {
        if (this.editedIndex > -1)
          Object.assign(this.strats[this.editedIndex], this.editedItem)
        else
          this.strats.push(this.editedItem)

        store.common.set("strats",this.strats);
      
        this.close()
      },

      filter (value, search, item) 
      {
        return (search=="Random") ? true : item.character == search;
      },

      get_icon(character)
      {
        if(this.icon_lookup)
          return this.icon_lookup[character];

        this.icon_lookup = {};

        for(let i = 0; i < this.characters.length; i++)
          this.icon_lookup[this.characters[i].name] = this.characters[i].icon;

        return this.icon_lookup[character];
      }
    },

    mounted()
    {
      store.common.get("strats").then(r=>
      {
        if(!r.length)
        {
          this.strats = this.default_strats;
          store.common.set("strats",this.strats);
        }
        else
          this.strats=r;
      });
    },

    data: () => ({
      /*TODO Metrics*/
      /*TODO PWA*/
      rules:
      {
        duration:15,
        read_description:false,
        voice_command:true,
        read_name:true,
        motion_command:false,
        buzz:true,
      },
      settings_dialog:false,
      editedIndex: -1,
      editedItem: {
        name: '',
        description:'',
        character:'',
        color:'#FF0000',
        buzz1:"tick",
        buzz2:"tick",
        buzz3:"tick"
      },
      defaultItem: {
        name: 'name',
        description:'description',
        character:'Random',
        color:'#FF0000',
        buzz1:"tick",
        buzz2:"tick",
        buzz3:"tick"
      },
      buzz_list:
      [
        "tick",
        "short",
        "medium",
        "long"
      ],
      edit_dialog:false,
      icon_lookup:null,
      characters:[
        {
          name:"Random",
          icon:""
        },
        {
          name:"Banjo",
          icon:"https://www.ssbwiki.com/images/6/60/Banjo%26KazooieHeadSSBU.png"
        },
        {
          name:"Bayonetta",
          icon:"https://www.ssbwiki.com/images/6/6c/BayonettaHeadSSBU.png"
        },
        {
          name:"Bowser",
          icon:"https://www.ssbwiki.com/images/b/b5/BowserHeadSSBU.png"
        },
        {
          name:"Byleth",
          icon:"https://www.ssbwiki.com/images/a/a2/BylethHeadSSBU.png"
        },
        {
          name:"Captain Falcon",
          icon:"https://www.ssbwiki.com/images/3/35/CaptainFalconHeadSSBU.png"
        },
        {
          name:"Chrom",
          icon:"https://www.ssbwiki.com/images/2/25/ChromHeadSSBU.png"
        },
        {
          name:"Cloud",
          icon:"https://www.ssbwiki.com/images/3/3b/CloudHeadSSBU.png"
        },
        {
          name:"Corrin",
          icon:"https://www.ssbwiki.com/images/c/cf/CorrinHeadSSBU.png"
        },
        {
          name:"Daisy",
          icon:"https://www.ssbwiki.com/images/9/96/DaisyHeadSSBU.png"
        },
        {
          name:"Dark Pit",
          icon:"https://www.ssbwiki.com/images/e/ed/DarkPitHeadSSBU.png"
        },
        {
          name:"Dark Samus",
          icon:"https://www.ssbwiki.com/images/9/96/DarkSamusHeadSSBU.png"
        },
        {
          name:"Diddy Kong",
          icon:"https://www.ssbwiki.com/images/3/36/DiddyKongHeadSSBU.png"
        },
        {
          name:"Donkey Kong",
          icon:"https://www.ssbwiki.com/images/b/ba/DonkeyKongHeadSSBU.png"
        },
        {
          name:"Dr Mario",
          icon:"https://www.ssbwiki.com/images/7/78/DrMarioHeadSSBU.png"
        },
        {
          name:"Dunk Hunt",
          icon:"https://www.ssbwiki.com/images/a/a1/DuckHuntHeadSSBU.png"
        },
        {
          name:"Falco",
          icon:"https://www.ssbwiki.com/images/2/2f/FalcoHeadSSBU.png"
        },
        {
          name:"Fox",
          icon:"https://www.ssbwiki.com/images/0/04/FoxHeadSSBU.png"
        },
        {
          name:"Ganondorf",
          icon:"https://www.ssbwiki.com/images/7/78/GanondorfHeadSSBU.png"
        },
        {
          name:"Greninja",
          icon:"https://www.ssbwiki.com/images/6/65/GreninjaHeadSSBU.png"
        },
        {
          name:"Hero",
          icon:"https://www.ssbwiki.com/images/3/3d/HeroHeadSSBU.png"
        },
        {
          name:"Ice Climbers",
          icon:"https://www.ssbwiki.com/images/8/8b/IceClimbersHeadSSBU.png"
        },
        {
          name:"Ike",
          icon:"https://www.ssbwiki.com/images/b/b2/IkeHeadSSBU.png"
        },
        {
          name:"Incineroar",
          icon:"https://www.ssbwiki.com/images/5/50/IncineroarHeadSSBU.png"
        },
        {
          name:"Inkling",
          icon:"https://www.ssbwiki.com/images/f/f1/InklingHeadSSBU.png"
        },
        {
          name:"Isabelle",
          icon:"https://www.ssbwiki.com/images/2/2f/IsabelleHeadSSBU.png"
        },
        {
          name:"Jigglypuff",
          icon:"https://www.ssbwiki.com/images/9/95/JigglypuffHeadSSBU.png"
        },
        {
          name:"Joker",
          icon:"https://www.ssbwiki.com/images/2/25/JokerHeadSSBU.png"
        },
        {
          name:"Ken",
          icon:"https://www.ssbwiki.com/images/7/72/KenHeadSSBU.png"
        },
        {
          name:"King Dedede",
          icon:"https://www.ssbwiki.com/images/b/bb/KingDededeHeadSSBU.png"
        },
        {
          name:"King K Rool",
          icon:"https://www.ssbwiki.com/images/d/de/KingKRoolHeadSSBU.png"
        },
        {
          name:"Kirby",
          icon:"https://www.ssbwiki.com/images/9/91/KirbyHeadSSBU.png"
        },
        {
          name:"Link",
          icon:"https://www.ssbwiki.com/images/a/aa/LinkHeadSSBU.png"
        },
        {
          name:"Little Mac",
          icon:"https://www.ssbwiki.com/images/1/10/LittleMacHeadSSBU.png"
        },
        {
          name:"Lucario",
          icon:"https://www.ssbwiki.com/images/c/cd/LucarioHeadSSBU.png"
        },
        {
          name:"Lucas",
          icon:"https://www.ssbwiki.com/images/f/ff/LucasHeadSSBU.png"
        },
        {
          name:"Lucina",
          icon:"https://www.ssbwiki.com/images/0/04/LucinaHeadSSBU.png"
        },
        {
          name:"Luigi",
          icon:"https://www.ssbwiki.com/images/c/c6/LuigiHeadSSBU.png"
        },
        {
          name:"Mario",
          icon:"https://www.ssbwiki.com/images/0/0d/MarioHeadSSBU.png"
        },
        {
          name:"Marth",
          icon:"https://www.ssbwiki.com/images/b/bd/MarthHeadSSBU.png"
        },
        {
          name:"Mega Man",
          icon:"https://www.ssbwiki.com/images/5/55/MegaManHeadSSBU.png"
        },
        {
          name:"Meta Knight",
          icon:"https://www.ssbwiki.com/images/d/de/MetaKnightHeadSSBU.png"
        },
        {
          name:"Mewtwo",
          icon:"https://www.ssbwiki.com/images/9/96/MewtwoHeadSSBU.png"
        },
        {
          name:"Mii Brawler",
          icon:"https://www.ssbwiki.com/images/d/d8/MiiBrawlerHeadSSBU.png"
        },
        {
          name:"Mii Fighter",
          icon:"https://www.ssbwiki.com/images/thumb/c/cf/MiiFighterHeadSSBUWebsite.png/120px-MiiFighterHeadSSBUWebsite.png"
        },
        {
          name:"Mii Gunner",
          icon:"https://www.ssbwiki.com/images/3/3d/MiiGunnerHeadSSBU.png"
        },
        {
          name:"Mii Swordfighter",
          icon:"https://www.ssbwiki.com/images/e/ef/MiiSwordfighterHeadSSBU.png"
        },
        {
          name:"Mr Game & Watch",
          icon:"https://www.ssbwiki.com/images/6/6b/MrGame%26WatchHeadSSBU.png"
        },
        {
          name:"Ness",
          icon:"https://www.ssbwiki.com/images/0/0f/NessHeadSSBU.png"
        },
        {
          name:"Olimar",
          icon:"https://www.ssbwiki.com/images/9/91/OlimarHeadSSBU.png"
        },
        {
          name:"Pacman",
          icon:"https://www.ssbwiki.com/images/4/45/Pac-ManHeadSSBU.png"
        },
        {
          name:"Palutena",
          icon:"https://www.ssbwiki.com/images/a/a9/PalutenaHeadSSBU.png"
        },
        {
          name:"Peach",
          icon:"https://www.ssbwiki.com/images/d/d2/PeachHeadSSBU.png"
        },
        {
          name:"Pichu",
          icon:"https://www.ssbwiki.com/images/d/d6/PichuHeadSSBU.png"
        },
        {
          name:"Pikachu",
          icon:"https://www.ssbwiki.com/images/f/fa/PikachuHeadSSBU.png"
        },
        {
          name:"Piranha Plant",
          icon:"https://www.ssbwiki.com/images/3/38/PiranhaPlantHeadSSBU.png"
        },
        {
          name:"Pit",
          icon:"https://www.ssbwiki.com/images/a/aa/PitHeadSSBU.png"
        },
        {
          name:"Pokemon Trainer",
          icon:"https://www.ssbwiki.com/images/0/09/Pok%C3%A9monTrainerHeadSSBU.png"
        },
        {
          name:"Richter",
          icon:"https://www.ssbwiki.com/images/0/07/RichterHeadSSBU.png"
        },
        {
          name:"Ridley",
          icon:"https://www.ssbwiki.com/images/5/5b/RidleyHeadSSBU.png"
        },
        {
          name:"Rob",
          icon:"https://www.ssbwiki.com/images/b/b3/ROBHeadSSBU.png"
        },
        {
          name:"Robin",
          icon:"https://www.ssbwiki.com/images/2/25/RobinHeadSSBU.png"
        },
        {
          name:"Rosalina",
          icon:"https://www.ssbwiki.com/images/e/e8/RosalinaHeadSSBU.png"
        },
        {
          name:"Roy",
          icon:"https://www.ssbwiki.com/images/e/ed/RoyHeadSSBU.png"
        },
        {
          name:"Ryu",
          icon:"https://www.ssbwiki.com/images/f/fb/RyuHeadSSBU.png"
        },
        {
          name:"Samus",
          icon:"https://www.ssbwiki.com/images/7/7f/SamusHeadSSBU.png"
        },
        {
          name:"Sheik",
          icon:"https://www.ssbwiki.com/images/3/37/SheikHeadSSBU.png"
        },
        {
          name:"Shulk",
          icon:"https://www.ssbwiki.com/images/c/c1/ShulkHeadSSBU.png"
        },
        {
          name:"Simon",
          icon:"https://www.ssbwiki.com/images/d/df/SimonHeadSSBU.png"
        },
        {
          name:"Snake",
          icon:"https://www.ssbwiki.com/images/9/9a/SnakeHeadSSBU.png"
        },
        {
          name:"Sonic",
          icon:"https://www.ssbwiki.com/images/7/76/SonicHeadSSBU.png"
        },
        {
          name:"Terry",
          icon:"https://www.ssbwiki.com/images/f/f9/TerryHeadSSBU.png"
        },
        {
          name:"Toon Link",
          icon:"https://www.ssbwiki.com/images/e/e6/ToonLinkHeadSSBU.png"
        },
        {
          name:"Villager",
          icon:"https://www.ssbwiki.com/images/b/b9/VillagerHeadSSBU.png"
        },
        {
          name:"Wario",
          icon:"https://www.ssbwiki.com/images/0/05/WarioHeadSSBU.png"
        },
        {
          name:"WiiFit Trainer",
          icon:"https://www.ssbwiki.com/images/8/87/WiiFitTrainerHeadSSBU.png"
        },
        {
          name:"Wolf",
          icon:"https://www.ssbwiki.com/images/e/e8/WolfHeadSSBU.png"
        },
        {
          name:"Yoshi",
          icon:"https://www.ssbwiki.com/images/0/03/YoshiHeadSSBU.png"
        },
        {
          name:"Young Link",
          icon:"https://www.ssbwiki.com/images/c/cd/YoungLinkHeadSSBU.png"
        },
        {
          name:"Zelda",
          icon:"https://www.ssbwiki.com/images/c/c1/ZeldaHeadSSBU.png"
        },
        {
          name:"Zero Suit Samus",
          icon:"https://www.ssbwiki.com/images/7/71/ZeroSuitSamusHeadSSBU.png"
        },
      ],
      character:{
          name:"Random",
          icon:""
        },
      selected:[],
      headers: (window.matchMedia("(max-width: 800px)").matches)
      ? [
          {
            text: 'Character',
            align: 'start',
            sortable: false,
            value: 'character',
          },
          { text: 'Name', value: 'name' },
          { text: 'Details', value: 'data-table-expand' },
      ] : [
          {
            text: 'Character',
            align: 'start',
            sortable: false,
            value: 'character',
          },
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Color', value: 'color' },
          { text: 'Buzz', value: 'buzz' },
          //{ text: 'Actions', value: 'action', sortable: false },
          { text: 'Details', value: 'data-table-expand' },
      ],
      strats:[],
      default_strats:[
        {
          character:"Random",
          name:"Tomahawk",
          description:"Empty hop grab",
          color:'#B3C100',
          buzz1:"tick",
          buzz2:"short",
          buzz3:"medium",
        },
        {
          character:"Random",
          name:"Read",
          description:"Predict and counter",
          color:'#1C4E80',
          buzz1:"tick",
          buzz2:"short",
          buzz3:"tick",
        },
        {
          character:"Random",
          name:"Evade",
          description:"Camp and run away",
          color:'#A5D8DD',
          buzz1:"tick",
          buzz2:"tick",
          buzz3:"long",
        },
        {
          character:"Random",
          name:"Bait",
          description:"Fake attack and counter",
          color:'#EA6A47',
          buzz1:"short",
          buzz2:"tick",
          buzz3:"short",
        },
        {
          character:"Random",
          name:"Defensive Pressure",
          description:"Close distance without attacking",
          color:'#0091D5',
          buzz1:"tick",
          buzz2:"tick",
          buzz3:"tick",
        },
        {
          character:"Random",
          name:"Offensive Pressure",
          description:"Close distance with safe attacks",
          color:'#23282D',
          buzz1:"tick",
          buzz2:"medium",
          buzz3:"tick",
        },
      ] //'#4CB5F5', '#1F3F49', '#D32D41', '#6AB187'
    }),
  }

</script>

<style scoped>
</style>
