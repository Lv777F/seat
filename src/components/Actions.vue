<script setup lang="ts">
import { GROUP_SIZE } from '@/config';
import { computed, nextTick } from 'vue';
const emit = defineEmits(['update:preIndexes', 'update:selectedIndexes']);
const props = defineProps<{
	preIndexes: number[];
	selectedIndexes: number[][];
	pre: number[];
	splitSeats: number[][];
}>();
const buttons = [
	{
		size: 1,
		label: '单座位抽取',
	},
	{
		size: 2,
		label: '两连号座位',
	},
	{
		size: 3,
		label: '三连号座位',
	},
	{
		size: 4,
		label: '四连号座位',
	},
];

const flatSelectedIndexes = computed(() => props.selectedIndexes.flat());

function select(size: number, from?: number) {
	if (props.preIndexes.length && from === undefined) {
		emit('update:selectedIndexes', [
			...props.selectedIndexes,
			props.preIndexes,
		]);
	}
	nextTick(() => {
		let value: number[] = [];
		for (
			let groupIndex = Math.floor((from ?? 0) / GROUP_SIZE);
			groupIndex < props.splitSeats.length;
			groupIndex++
		) {
			const group = props.splitSeats[groupIndex];
			const unSelectedItemIndexes = group
				.map((_, i) => i + groupIndex * GROUP_SIZE)
				.filter(
					(index) =>
						!flatSelectedIndexes.value.includes(index) &&
						// 🤔 有点怪
						(from === undefined || index > (from ?? 0))
				);
			if (unSelectedItemIndexes.length < size) continue;
			const match = unSelectedItemIndexes.reduce<number[]>((acc, cur) => {
				if (acc.length >= size) return acc;
				if (!acc.length) return [cur];
				if (acc[acc.length - 1] + 1 !== cur) return [cur];
				return acc.concat([cur]);
			}, []);
			if (match.length >= size) {
				value = match;
				break;
			}
		}
		if (value.length) {
			emit('update:preIndexes', value);
		}
	});
}
function reSelect() {
	const currentSize = props.preIndexes.length;
	if (!currentSize) return;
	select(currentSize, props.preIndexes[0]);
}
function reset() {
	emit('update:preIndexes', []);
	emit('update:selectedIndexes', []);
}
</script>
<template>
	<div class="flex flex-col items-center gap-4">
		<h2 class="text-3xl">座位抽取</h2>
		<h3 class="text-2xl">当前抽取</h3>
		<ul class="flex items-center gap-4 justify-center min-h-20">
			<li
				v-for="preItem in pre"
				:key="preItem"
				class="rounded-full bg-purple-500 w-20 h-20 grid place-content-center text-white"
			>
				{{ preItem }}
			</li>
		</ul>
		<div class="grid grid-cols-2 gap-6 mt-6">
			<button
				v-for="{ label, size } in buttons"
				:key="size"
				@click="
					() => {
						select(size);
					}
				"
				class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				{{ label }}
			</button>
		</div>
		<div class="flex flex-col items-center gap-6 mt-6">
			<button
				class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
				@click="reSelect"
			>
				重抽
			</button>
			<button
				class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
				@click="reset"
			>
				重置
			</button>
		</div>
	</div>
</template>
