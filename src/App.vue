<template>
    <Header />
    <main class="px-6">
        <router-view />
    </main>
</template>

<script>
import Header from './components/Header.vue'

export default {
    name: 'App',
    components: { Header },
};
</script>