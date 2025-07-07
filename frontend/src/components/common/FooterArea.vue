<template>
  <footer class="footer container-fluid border-top py-3 mt-4">
    <div class="row align-items-center">
      <!-- 左側版權資訊 -->
      <div class="col-md-10 col-12 text-md-start text-center mb-2 mb-md-0">
        <strong class="author">GhostKeys 鬼鍵識</strong> &copy; {{ currentYear }}，由
        <span class="author-name">{{ author }}</span> 製作
      </div>

      <!-- 右側連結 -->
      <div class="col-md-2 col-12 text-md-end text-center">
        <div class="link-row">
          <!-- GitHub -->
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 008 11c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.6-.7 2-1.3a1.4 1.4 0 0 1 1.4-1.3c.9 0 1.5 1.1 1.5 1.1 1.1 1.8 2.9 1.3 3.6 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-6a4.7 4.7 0 0 1 1.2-3.3 4.4 4.4 0 0 1 .1-3.3s1-.3 3.3 1.3a11.3 11.3 0 0 1 6 0c2.3-1.6 3.3-1.3 3.3-1.3a4.4 4.4 0 0 1 .1 3.3 4.7 4.7 0 0 1 1.2 3.3c0 4.7-2.7 5.7-5.3 6 .4.3.7 1 .7 2v3c0 .3.2.7.8.6a11.5 11.5 0 0 0 8-11c0-6.3-5.2-11.5-11.5-11.5z" />
          </svg>
          <a :href="githubProfile" target="_blank" rel="noopener noreferrer" class="link-text">KANG-XUAN</a>
        </div>
        <div class="link-row">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 008 11c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.6-.7 2-1.3a1.4 1.4 0 0 1 1.4-1.3c.9 0 1.5 1.1 1.5 1.1 1.1 1.8 2.9 1.3 3.6 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-6a4.7 4.7 0 0 1 1.2-3.3 4.4 4.4 0 0 1 .1-3.3s1-.3 3.3 1.3a11.3 11.3 0 0 1 6 0c2.3-1.6 3.3-1.3 3.3-1.3a4.4 4.4 0 0 1 .1 3.3 4.7 4.7 0 0 1 1.2 3.3c0 4.7-2.7 5.7-5.3 6 .4.3.7 1 .7 2v3c0 .3.2.7.8.6a11.5 11.5 0 0 0 8-11c0-6.3-5.2-11.5-11.5-11.5z" />
          </svg>
          <a :href="githubRepo" target="_blank" rel="noopener noreferrer" class="link-text">GhostKeys</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const author = 'KANG-XUAN'
const githubProfile = 'https://github.com/KANG-XUAN'
const githubRepo = 'https://github.com/KANG-XUAN/GhostKeys'
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  font-size: 0.9rem;
  color: #495057;
  background-color: #f0f2f5;
  box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem 1.5rem;
}

.author {
  font-weight: 600;
  font-size: 1.1rem;
  color: #212529;
}

.author-name {
  color: #0d6efd;
  font-weight: 600;
  cursor: default;
}

.link-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 0.3rem;
}



.link-row:last-child {
  margin-bottom: 0;
}

.icon {
  width: 18px;
  height: 18px;
  fill: #0d6efd;
  flex-shrink: 0;
  transition: fill 0.3s;
}

.link-text {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  text-align: left;
  /* 加上左對齊 */
}

.link-text:hover {
  text-decoration: underline;
  color: #084298;
}

/* 響應式調整 */
@media (max-width: 767px) {
  .footer {
    font-size: 0.85rem;
    padding: 0.8rem 1rem;
  }

  .link-row {
    justify-content: center;
  }

  .link-row .icon {
    margin-right: 4px;
  }

  .col-md-8,
  .col-md-4 {
    text-align: center !important;
  }
}
</style>
