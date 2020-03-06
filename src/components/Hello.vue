<template>
  <div class="hello">
    <img alt="HabitSmasher" src="https://www.ssbwiki.com/images/2/2b/LinkHeadSSBUWebsite.png">
    <h1>{{ msg }}</h1>
    <p>
      You suck at mixing up your gameplay. <span style='font-weight:bold;'>You keep getting read like a book!</span><br><br>
      HabitSmasher lets you <span style='font-weight:bold;'>build a practice profile</span> with all your best moves, combos and mixups<br><br>
      then <span style='font-weight:bold;'>prompts you while you practice</span> to try the ones you always forget.<br>
    </p>
  </div>
</template>

<script>

export default 
{
  name: 'Hello',
  props: {
    msg: String
  }
}

</script>


<style scoped>

</style>
