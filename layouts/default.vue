<template>
  <div class="w-screen flex flex-col bg-white-normal relative mx-0 h-full">
    <main
        id="default_main"
        class="slot-container  rounded-tr-xl flex-grow-1 transition overflow-auto font-sans p-5"
    >
      <slot />
    </main>
  </div>

</template>