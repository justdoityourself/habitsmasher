<!-- Copyright (C) 2020 D8DATAWORKS - All Rights Reserved -->

<template>
  <div class=gvt>
    <div class=gvt style='cursor:pointer;max-width:800px;--gr:200px 100px 50px 50px 100px; height:500px;'>
        <v-img src="https://www.ssbwiki.com/images/2/2b/LinkHeadSSBUWebsite.png" class="my-3" contain height="200" />

        <div class="rel_text_title" style='font-weight:bold;'>
          Welcome to HabitSmasher
        </div>

        <p class="rel_text_p subheading font-weight-regular">
          Build a <span style='font-weight:bold;'>practice profile</span> with all your best moves, combos and mixups.
        </p>

        <p class="rel_text_p subheading font-weight-regular">
          Get <span style='font-weight:bold;'>prompts and reminders</span> you while you practice.
        </p>

        <v-icon size=64 color=green>trending_flat</v-icon>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Hello',

    data: () => ({
    }),
  }

</script>

<style scoped>

  @media (max-width: 800px) 
  { 
    .rel_text_title
    {
      font-size:24px;
    }

    .rel_text_p
    {
      text-align:center;
      margin:16px;
      font-size:12px;
    }
  }
  @media (min-width: 801px) 
  { 
    .rel_text_title
    {
      font-size:36px;
    }

    .rel_text_p
    {
      font-size:16px;
    }
  }

</style>
