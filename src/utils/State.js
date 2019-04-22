/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		score: 0,
		level: 0,
	},
	getters: {
		score: state => state.score,
		level: state => state.level,
	},
	mutations: {
		incrementScore(state) {
			state.score += 1;
		},
		saveScore(state, score) {
			state.score = score;
		},
		saveLevel(state, level) {
			state.level = level;
		},
	},
});
