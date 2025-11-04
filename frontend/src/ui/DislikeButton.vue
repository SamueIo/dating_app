<template>
  <!-- From Uiverse.io by waleedlh10 --> 
  <div class="con-dislike">
    <input class="dislike" type="checkbox" title="dislike">
    <div class="checkmark">
      <svg xmlns="http://www.w3.org/2000/svg" class="outline" viewBox="0 0 24 24">
        <path d="M12 2L2 12l10 10 10-10L12 2zm0 18L4 12l8-8 8 8-8 8z"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" class="filled" viewBox="0 0 24 24">
        <path d="M12 2L2 12l10 10 10-10L12 2zm0 18L4 12l8-8 8 8-8 8z"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" class="celebrate">
        <polygon class="poly" points="10,10 20,20"></polygon>
        <polygon class="poly" points="10,50 20,50"></polygon>
        <polygon class="poly" points="20,80 30,70"></polygon>
        <polygon class="poly" points="90,10 80,20"></polygon>
        <polygon class="poly" points="90,50 80,50"></polygon>
        <polygon class="poly" points="80,80 70,70"></polygon>
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* From Uiverse.io by waleedlh10 */ 
.con-dislike {
  --red: rgb(255, 50, 50);
  position: relative;
  width: 50px;
  height: 50px;
}

.con-dislike .dislike {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 20;
  cursor: pointer;
}

.con-dislike .checkmark {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.con-dislike .outline,
.con-dislike .filled {
  fill: var(--red);
  position: absolute;
}

.con-dislike .filled {
  animation: kfr-filled 0.5s;
  display: none;
}

.con-dislike .celebrate {
  position: absolute;
  animation: kfr-celebrate 0.5s;
  animation-fill-mode: forwards;
  display: none;
}

.con-dislike .poly {
  stroke: var(--red);
  fill: var(--red);
}

.con-dislike .dislike:checked ~ .checkmark .filled {
  display: block
}

.con-dislike .dislike:checked ~ .checkmark .celebrate {
  display: block
}

@keyframes kfr-filled {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes kfr-celebrate {
  0% {
    transform: scale(0);
  }

  50% {
    opacity: 0.8;
  }

  100% {
    transform: scale(1.2);
    opacity: 0;
    display: none;
  }
}
</style>
