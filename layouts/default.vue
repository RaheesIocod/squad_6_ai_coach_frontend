<template>
  <div class="w-screen flex flex-col bg-white-normal relative mx-0 h-full">
    <main
        id="default_main"
        class="slot-container flex-grow-1 transition overflow-auto font-sans"
    >
      <slot />
    </main>
  </div>

</template>