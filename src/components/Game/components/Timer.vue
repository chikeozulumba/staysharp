<template>
	<div style="z-index: 999999999999999999;" class="container-cust">
		<div id="timer-inline">
			<span id="minutes" :class="[totalTime <= 3600 && totalTime < 4800 ? 'blink-yellow' : '', totalTime <= 1200 ? 'blink-red' : '']">{{ minutes }}</span>
			<span v-if="totalTime >= 3600" id="middle" :class="[totalTime <= 3600 && totalTime < 4800 ? 'blink-yellow' : '', totalTime <= 1200 ? 'blink-red' : '']">:</span>
			<span
				v-if="totalTime >= 3600"
				id="seconds"
				:class="[totalTime <= 3600 && totalTime < 4800 ? 'blink-yellow' : '', totalTime <= 1200 ? 'blink-red' : '']"
			>{{ seconds }}</span>
			<span style="font-size: 2rem !important" v-else :class="[totalTime <= 3600 && totalTime < 4800 ? 'blink-yellow' : '', totalTime <= 1200 ? 'blink-red' : '']">s</span>
		</div>
	</div>
</template>

<script>
	import Event from "../../../utils/Event";
	import axios from "axios";

	export default {
		data: () => {
			return {
				timer: null,
				totalTime: localStorage.getItem("TsI7m2xsXhH-z") || 7200,
				user: JSON.parse(localStorage.getItem("sI7m2xsXhH-z-u")),
				// totalTime: localStorage.getItem("TsI7m2xsXhH-z") || 1800 * 6,
				resetButton: false,
				title: "Let the countdown begin!!"
			};
		},
		methods: {
			startTimer: function() {
				this.timer = setInterval(() => this.countdown(), 10);
				this.resetButton = true;
			},
			storeTimer: function() {
				this.timer = setInterval(() => this.storetime(), 10000);
				this.resetButton = true;
			},
			stopTimer: function() {
				clearInterval(this.timer);
				this.timer = null;
				this.resetButton = true;
			},
			resetTimer: function() {
				this.totalTime = 2 * 60;
				clearInterval(this.timer);
				this.timer = null;
				this.resetButton = false;
			},
			padTime: function(time) {
				return (time < 10 ? "0" : "") + time;
			},
			countdown: function() {
				if (this.totalTime >= 1) {
					this.totalTime--;
					localStorage.setItem("TsI7m2xsXhH-z", this.totalTime);
				} else {
					localStorage.setItem("sI7m2xsXhH-z", 1);
					Event.$emit("timer-finished");
					setTimeout(() => {
						this.totalTime = 0;
						this.resetTimer();
					}, 1000);
					window.location.href = "";
				}
			},
			storetime: async function() {
				const user = JSON.parse(localStorage.getItem("sI7m2xsXhH-z-u"));
				// const { data } = await axios.post(
				// 	`${this.$url}store-timer/${user.name}`,
				// 	{
				// 		currenttime: parseInt(localStorage.getItem("sI7m2xsXhH-z"), 10)
				// 	}
				// );
			}
		},
		computed: {
			minutes: function() {
				const minutes = Math.floor(this.totalTime / 60);
				return this.padTime(minutes);
			},
			seconds: function() {
				const seconds = this.totalTime - this.minutes * 60;
				return this.padTime(seconds);
			}
		},
		mounted() {
			Event.$on("start-timer", () => {
				this.startTimer();
				return this.storeTimer();
			});
		}
	};
</script>

<style scoped>
	.title {
		border-bottom: 1px solid white;
		font-family: "Circular-Bold";
	}

	#timer {
		background: white;
		border-radius: 10px;
    margin: 1rem;
		padding: 0.5rem;
		box-shadow: -1px 0px 8px 5px rgba(10, 10, 10, 0.34);
	}
	
	#timer-inline {
		color: darkslategrey;
	}
	#minutes,
	#seconds {
		font-size: 2rem;
		font-family: "Circular-Bold";
		letter-spacing: 1px;
	}

	@media screen and (max-width: 650px) {
		#minutes,
		#seconds {
			font-size: 2rem;
		}
	}

	@media screen and (max-width: 400px) {
		#minutes,
		#seconds {
			font-size: 2rem;
		}
	}

	h2,
	h3 {
		text-align: start;
	}

	/* Blink effects */
	.blink-red {
		animation: blinker 0.6s linear infinite;
		color: #ff0000 !important;
	}
	.blink-yellow {
		animation: blinker 0.6s linear infinite;
		color: rgba(230,126,34 ,1);
	}
	@keyframes blinker {
		50% {
			opacity: 0;
		}
	}
</style>
