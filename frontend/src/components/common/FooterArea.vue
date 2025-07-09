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
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z" />
          </svg>
          <a :href="githubProfile" target="_blank" rel="noopener noreferrer" class="link-text">KANG-XUAN</a>
        </div>
        <div class="link-row">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z" />
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
