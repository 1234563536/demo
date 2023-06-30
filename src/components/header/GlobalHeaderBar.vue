<script setup>
import SearchBar from './SearchBar.vue';


</script>

<template>
    <header class="global-header-bar">
        <i>
            <img src="../../assets/images/cn_logo.png">
            丰都县交通管理局
        </i>
        <h1>交通便民服务平台</h1>
        <SearchBar/>
        <span class="role-tag"></span>
    </header>
</template>

<style scoped>
.global-header-bar {
    border: 1px solid gray;
}

h1 {
    display: inline-block;
}

.role-tag {
    border-radius: 8px;
    background-color: #282828;
}

</style>