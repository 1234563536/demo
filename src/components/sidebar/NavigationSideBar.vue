<script setup>
import { ref } from 'vue';
import NavigationItem from './NavigationItem.vue';
</script>

<template>
    <div class="nav-side-bar">
        <div class="nav-sid-bar-tool"></div>
        <nav>
            <NavigationItem :link="'/reservation'">
                <template #icon></template>
                订票系统
            </NavigationItem>
            <NavigationItem :link="'/trip-scheduling'">
                <template #icon></template>
                出行调度系统
            </NavigationItem>
            <NavigationItem :link="'/security'">
                <template #icon></template>
                安全风险系统
            </NavigationItem>
            <NavigationItem :link="'/emergency'">
                <template #icon></template>
                应急系统
            </NavigationItem>
            <NavigationItem :link="'/navigation'">
                <template #icon></template>
                指示导航系统
            </NavigationItem>
            <NavigationItem :link="'/logistics'">
                <template #icon></template>
                物流系统
            </NavigationItem>
        </nav>
    </div>
</template>

<style scoped>
.nav-side-bar {
    border: 1px solid black
}
</style>