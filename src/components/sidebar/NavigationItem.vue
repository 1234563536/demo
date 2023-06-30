<script setup>
import { RouterLink } from 'vue-router'
const props = defineProps(["link"])
</script>

<template>
    <div class="nav-item">
        <i>
            <slot name="icon"></slot>
        </i>
        <div class="nav-item-desc">
            <RouterLink :to="props.link">
                <slot></slot>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
.nav-item {
    border: 1px solid green;
}
</style>