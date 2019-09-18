<template>
    <section class="page">
        <slot></slot>
    </section>
</template>

<style lang="scss">

.page {
	// border:10px solid #ff0066;
	flex:1;
	overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    overscroll-behavior-x: none !important;
    overscroll-behavior-y: none !important;
    overscroll-behavior: none !important;

    &[flex] {
    display:flex;
}

&[center] {
    display:flex;
    justify-content:center;
    align-items: center;
}
}

</style>