<template>
    <pre v-highlightjs="code"><code class="json"></code></pre>
</template>

<script>
export default {
  name: 'CodePre',
  props: {
    code: {
      type: String,
      default: ''
    },
  },
};
</script>

<style scoped>

</style>
