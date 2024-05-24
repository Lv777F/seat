<script setup lang="ts">
import { GROUP_SIZE } from '@/config';
import { computed } from 'vue';

const props = defineProps<{
	splitSeats: number[][];
	pre: number[];
	selected: number[][];
}>();
const flatSelected = computed(() => props.selected.flat());
</script>
<template>
	<div class="flex flex-col items-center gap-4">
		<h2 class="text-3xl">座位预览</h2>
		<ul
			class="grid grid-cols-3 gap-4 [&>*]:text-center [&>*]:px-2 text-white [&>*]:rounded"
		>
			<li class="bg-gray-500">空座位</li>
			<li class="bg-purple-500">选中座位</li>
			<li class="bg-green-500">已抽取座位</li>
		</ul>
		<ul class="grid grid-cols-2 gap-x-8 gap-y-4">
			<li v-for="(seatGroup, i) in splitSeats" :key="i">
				<div class="bg-gray-300 h-8 mb-1" />
				<ul
					class="grid gap-2 text-white px-1"
					:style="{
						'grid-template-columns': `repeat(${GROUP_SIZE}, minmax(0, 1fr))`,
					}"
				>
					<li
						v-for="seat in seatGroup"
						:key="seat"
						class="text-center bg-gray-500 px-2 rounded"
						:class="{
							'bg-green-500': flatSelected.includes(seat),
							'bg-purple-500': pre.includes(seat),
						}"
					>
						{{ seat }}
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>
