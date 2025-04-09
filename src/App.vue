<template>
    <Header />
    <main>
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