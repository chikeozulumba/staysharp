<template>
	<div class>
		<div id="score-inline">
			<h2 class="title is-6 points">Points</h2>
			<h3 class="is-6" style="margin-left: 15px;">{{ score }}</h3>
		</div>
	</div>
</template>

<script>
	import Event from "../../../utils/Event";
	export default {
		data: () => {
			return {
				score: parseInt(localStorage.getItem("sI7m2xsXhH"), 10) || 0
			};
		},
		methods: {
			async addScore(email) {
				const addScore = await fetch(`${this.$url}users/score/${email}`);
				const score = await addScore.json();
				localStorage.setItem("sI7m2xsXhH", parseInt(score.score, 10));
			}
		},
		watch: {
			// whenever question changes, this function will run
			// score: function(value) {
			// 	if (value >= 39) {
			// 		Event.$emit("timer-finished");
			// 		localStorage.setItem("sI7m2xsXhH-z", 1);
			// 	}
			// }
		},
		async mounted() {
			if (this.score >= 39) {
				localStorage.setItem("sI7m2xsXhH-z", 1);
				return Event.$emit("timer-finished");
			}
			let user = localStorage.getItem("sI7m2xsXhH-z-u");
			user = JSON.parse(user);
			if (user) {
				this.$store.commit("saveScore", user.score);
				Event.$on("set-score", score => {
					score = parseInt(localStorage.getItem("sI7m2xsXhH"), 10) || 0;
					localStorage.setItem("sI7m2xsXhH", score + 1);
					this.score = localStorage.getItem("sI7m2xsXhH") || 0;
					return this.addScore(user.email);
				});
			}
		}
	};
</script>

<style scoped>
	#score-inline {
		color: white;
	}
	.title {
		font-size: 2rem;
	}

	.title {
		border-bottom: 1px solid white;
		font-family: "BubbleGum";
	}

	#score-inline h3 {
		font-family: "Circular-Book";
		text-align: right;
		font-size: 3rem;
	}

	#score-inline {
		color: white;
		margin-right: 50px;
	}

	h2,
	h3 {
		text-align: start;
	}
</style>
