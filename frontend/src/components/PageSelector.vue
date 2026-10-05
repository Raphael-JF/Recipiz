<template>
  <div class="page-selector">
    <button
      @click="prevPage"
      :disabled="currentPage <= 1"
      aria-label="Previous page"
    >
      &lt;
    </button>
    
    <span>Page {{ currentPage }} / {{ totalPages }}</span>
    
    <button
      @click="nextPage"
      :disabled="!hasNextPage"
      aria-label="Next page"
    >
      &gt;
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    hasNextPage: { type: Boolean, required: true }
  },
  data() {
    return {
      pageInput: this.currentPage
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.pageInput = this.currentPage - 1;
        this.$emit('page-change', this.pageInput);
      }
    },
    nextPage() {
      if (this.hasNextPage) {
        this.pageInput = this.currentPage + 1;
        this.$emit('page-change', this.pageInput);
      }
    },
    goToPage() {
      const pageNum = parseInt(this.pageInput, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && (this.hasNextPage || pageNum <= this.totalPages)) {
        this.$emit('page-change', pageNum);
      } else {
        this.pageInput = this.currentPage;
      }
    }
  }
};
</script>

<style scoped>
.page-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-selector button{
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
}

.page-selector button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
