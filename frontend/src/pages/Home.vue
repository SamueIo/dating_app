<template>
        <GuestLayout>
               <router-link :to="{ name: 'Login' }">Click for login</router-link>

        </GuestLayout>
</template>

<script setup>
import GuestLayout from '../components/layouts/GuestLayout.vue';


</script>

<style lang="scss" scoped>

</style>