<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-800 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <h3 class="text-white text-lg font-bold mb-2">OpenTraum</h3>
          <p class="text-sm">공연 티켓 예매 플랫폼</p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-white font-semibold mb-3">바로가기</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/events" class="hover:text-white transition-colors">이벤트</a></li>
            <li><a href="/my-page" class="hover:text-white transition-colors">마이페이지</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-white font-semibold mb-3">고객지원</h4>
          <ul class="space-y-2 text-sm">
            <li>이메일: support@opentraum.com</li>
            <li>운영시간: 평일 09:00 - 18:00</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        <p>&copy; {{ currentYear }} OpenTraum. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
