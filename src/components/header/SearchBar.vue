<script setup>
import { ref } from 'vue';

const input_text = ref("");

</script>

<template>
    <div class="global-search-bar">
        <input v-model="input_text" placeholder="请输入搜索关键词">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" style="color: #777777;" />
    </div>
</template>

<style scoped>
.global-search-bar {
    display: inline-block;
    border: #777777 solid 1px;
    border-radius: 20px;
}

.global-search-bar input {
    border: none;
    margin-left: 10px;
}

</style>