<template>
	<div>
		<button @click.prevent="unveil" id="unveil">Unveil Stay Sharp</button>
		<img id="leaf-rt" src="https://stay-sharp.herokuapp.com/images/leaf-rt@2x.png" alt>
		<img id="leaf-lb" src="https://stay-sharp.herokuapp.com/images/leaf-lb.png" alt>
		<component :is="current"></component>
	</div>
</template>

<script>
	import Intro from "./components/Intro.vue";
	import Register from "./components/Register.vue";
	import Instructions from "./components/Instructions.vue";
	import Console from "./components/Game/Console.vue";
	import Result from "./components/Game/Result.vue";
	import Leader from "./components/Game/Leader.vue";
	import Event from "./utils/Event";
	import axios from "axios";

	export default {
		data: () => {
			return {
				current: Intro,
				token: null
			};
		},
		created() {
			this.subscribe();
		},
		methods: {
			unveil() {
				return window.open("/unveil", "_blank");
			},
			async getUser(user) {
				const { data } = await axios.get(
					`https://stay-sharp.herokuapp.com/users/check/${user.name}`
				);

				if (data.user) {
					localStorage.setItem("sI7m2xsXhH-z-u", JSON.stringify(data.user));
					localStorage.setItem("sI7m2xsXhH-z", data.user.finished);
					return this.$store.commit("saveScore", data.user.score);
				}
			}
		},
		mounted() {
			localStorage.setItem("TsI7m2xsXhH-z", 7200);
			const time = parseInt(localStorage.getItem("sI7m2xsXhH-z"), 10) || 0;
			if (time === 1 && this.current !== Leader) return (this.current = Result);
			const level =
				localStorage.getItem("sI7m2xsXhH-z-l") !== null
					? localStorage.getItem("sI7m2xsXhH-z-l")
					: 1;
			this.$store.commit("saveLevel", level);
			let user = localStorage.getItem("sI7m2xsXhH-z-u");
			if (user) {
				user = JSON.parse(user);
				this.getUser(user);
				this.current = Instructions;
			}
			Event.$on("timer-finished", () => (this.current = Result));
			Event.$on("register", () => (this.current = Register));
			Event.$on("goBack", () => (this.current = Intro));
			Event.$on("onRegistered", () => (this.current = Instructions));
			Event.$on("leader", () => (this.current = Leader));
			Event.$on("restart", () => {
				this.current = Console;
			});
			Event.$on("proceed", () => {
				this.current = Console;
			});
		},
		components: {
			Intro,
			Register,
			Console,
			Result,
			Instructions,
			Leader
		}
	};
</script>

<style>
	@import "./App.scss";
	#unveil {
		position: absolute;
		bottom: 0;
		font-family: "Circular-Bold";
		color: whitesmoke;
		margin: 1rem;
		background: rgba(230, 126, 34, 1);
		padding: 0.5rem 1rem;
		border-radius: 5px;
		box-shadow: -1px 0px 8px 5px rgba(10, 10, 10, 0.34);
		cursor: pointer;
	}
	.full-width {
		width: 100%;
	}
	.center-content {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#leaf-rt,
	#leaf-lb {
		position: fixed;
	}
	#leaf-rt {
		top: -10%;
		right: -10%;
		transform: rotateZ(10deg);
		height: 40%;
		z-index: -99999999;
	}

	#leaf-lb {
		bottom: -10%;
		left: -10%;
		transform: rotateZ(10deg);
		height: 40%;
		z-index: -99999999;
	}

	@media screen and (max-width: 600px) {
		#leaf-rt,
		#leaf-lb {
			height: 25%;
			z-index: -9999;
		}
	}

	@media screen and (max-width: 400px) {
		#leaf-rt,
		#leaf-lb {
			height: 20%;
		}
	}
</style>