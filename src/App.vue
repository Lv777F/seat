<script setup lang="ts">
import { genData, splitData } from '@/util';
import { computed, ref } from 'vue';
import Actions from './components/Actions.vue';
import Seats from './components/Seats.vue';
import { GROUP_RANGE, GROUP_SIZE } from './config';

const seats = ref(genData(...GROUP_RANGE));

const splitSeats = computed(() => splitData(seats.value, GROUP_SIZE));

const preIndexes = ref([]);

const selectedIndexes = ref<number[][]>([]);

const pre = computed(() => preIndexes.value.map((i) => seats.value[i]));
const selected = computed(() =>
	selectedIndexes.value.map((groups) => groups.map((i) => seats.value[i]))
);
</script>

<template>
	<section class="w-screen h-screen flex flex-col gap-4">
		<header>
			<img class="h-36 w-full" />
		</header>
		<main class="flex-1 px-10 gap-20 grid grid-cols-2">
			<Seats :split-seats="splitSeats" :selected="selected" :pre="pre" />
			<Actions
				v-model:selected-indexes="selectedIndexes"
				v-model:pre-indexes="preIndexes"
				:pre="pre"
				:split-seats="splitSeats"
			/>
		</main>
	</section>
</template>
