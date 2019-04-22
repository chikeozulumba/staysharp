<template>
	<section id="intro">
		<div v-show="isModal" id="myModal" class="modal-c">
			<!-- Modal content -->
			<div class="modal-content">
				<span style="text-align: right;" @click="isModal = false" class="close">&times;</span>
				<br>
				<h5
					style="text-align: center; margin: 1rem auto; font-family: Circular-Bold; text-transform: uppercase;"
				>PRIZES TO BE WON</h5>
				<span
					style="text-align: center; margin: 0.4rem auto; font-family: Circular-Bold; border-bottom: 1px solid darkgrey"
				>Recharge Cards (100, 200, 500, 1000)</span>
				<span
					style="text-align: center; margin: 0.4rem auto; font-family: Circular-Bold; border-bottom: 1px solid darkgrey"
				>N5,000 Shopping Voucher (Jumia & Konga ).</span>
				<span
					style="text-align: center; margin: 0.4rem auto; font-family: Circular-Bold; border-bottom: 1px solid darkgrey"
				>Cinema Tickets</span>
				<span
					style="text-align: center; margin: 1rem auto; font-family: Circular-Bold; color: red; font-size: 0.8rem"
				>*** Only highest records between 12:00 to 5:00 pm from Friday to Sunday will be rewarded. ***</span>
			</div>
		</div>
		<div id="indexView">
			<img id="caption" :src="caption" alt>
			<img id="leaf-rt" :src="leafRt" alt>
			<img id="leaf-lb" :src="leafLb" alt>
		</div>
		<div id="getStarted">
			<h2 style="color:white">
				<a href="#!" @click.prevent="isModal = true">Click for prizes to be won.</a>
			</h2>
			<button @click="startGame">Start Game</button>
			<a
				:disabled="ifConnect"
				@click="showAuthNoty"
				target="_blank"
				style="margin: 2rem auto; font-size: 2rem; font-family: Circular-Book; color: whitesmoke; text-decoration: underline"
				href
			>{{ facebookText }}</a>
		</div>
	</section>
</template>

<script>
	import Event from "../utils/Event";
	import axios from "axios";
	import Pusher from "pusher-js";

	const uuidv4 = require("uuid/v4");
	export default {
		data() {
			return {
				caption: `https://stay-sharp.herokuapp.com/images/caption.png`,
				leafRt: `https://stay-sharp.herokuapp.com/images/leaf-rt@2x.png`,
				leafLb: `https://stay-sharp.herokuapp.com/images/leaf-rt@2x.png`,
				facebook: `https://stay-sharp.herokuapp.com/auth/facebook`,
				facebookText: "Login with Facebook",
				ifConnect: false,
				isModal: false
			};
		},
		created() {},
		methods: {
			subscribe() {},
			showAuthNoty(evt) {
				evt.preventDefault();
				const token = uuidv4();
				this.facebookText = "Connecting to Facebook";
				this.ifConnect = true;
				Event.$emit("token", token);
				window.open(
					`https://stay-sharp.herokuapp.com/auth/facebook/${token}`,
					"_blank"
				);
				// Pusher.logToConsole = true;
				var pusher = new Pusher("199c383bb3b1fedac642", {
					cluster: "eu",
					forceTLS: true
				});
				pusher.subscribe("auth");
				pusher.bind(token, data => {
					localStorage.setItem("sI7m2xsXhH-z-u", JSON.stringify(data));
					localStorage.setItem("TsI7m2xsXhH-z", data.currenttime);
					localStorage.setItem("sI7m2xsXhH-z", data.finished);
					return Event.$emit("onRegistered");
				});
			},
			async startGame(evt) {
				evt.preventDefault();
				let user = localStorage.getItem("sI7m2xsXhH-z-u");
				if (user) {
					user = JSON.parse(user);
					const { data } = await axios.get(
						`${this.$url}users/check/${user.name}`
					);
					localStorage.setItem("sI7m2xsXhH-z-u", JSON.stringify(data.user));
					return Event.$emit("onRegistered");
				} else return Event.$emit("register");
			}
		}
	};
</script>

<style scoped>
	h2 > a {
		font-size: 1.5rem;
		color: white;
		text-decoration: underline;
		margin: 1rem 0;
	}
	#getStarted {
		text-align: center;
	}
	#getStarted button {
		padding: 0.5rem 1.5rem;
		width: 90%;
		background: #0a1307;
		color: white;
		border: 10px solid #262121;
		font-size: 2rem;
		font-family: "Circular-Bold";
		border-radius: 100px;
		cursor: pointer;
		-webkit-box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
		-moz-box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
		box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
	}
	#getStarted button:hover {
		box-shadow: -1px 0px 15px 16px rgba(22, 64, 28, 0.33);
		transform: translateY(-15px);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.6s;
	}
	#indexView {
		margin: 150px auto 50px;
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
	}

	#leaf-lb {
		bottom: -10%;
		left: -10%;
		transform: rotateZ(10deg);
		height: 40%;
	}

	/* The Modal (background) */
	.modal-c {
		position: fixed; /* Stay in place */
		z-index: 1; /* Sit on top */
		padding-top: 100px; /* Location of the box */
		left: 0;
		top: 0;
		width: 100%; /* Full width */
		height: 100%; /* Full height */
		overflow: auto; /* Enable scroll if needed */
		background-color: rgb(0, 0, 0); /* Fallback color */
		background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
		animation: animation 0.6s linear;
	}

	@keyframes animation {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0.5;
		}

		100% {
			opacity: 1;
		}
	}

	/* Modal Content */
	.modal-content {
		background-color: #fefefe;
		margin: auto;
		padding: 20px;
		border: 1px solid #888;
		width: 60%;
	}

	/* The Close Button */
	.close {
		color: #aaaaaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
	}

	.close:hover,
	.close:focus {
		color: #000;
		text-decoration: none;
		cursor: pointer;
	}

	@media screen and (max-width: 600px) {
		.modal-content {
			width: 75%;
		}
	}

	@media screen and (max-width: 400px) {
		.modal-content {
			width: 90%;
		}
	}

	@media screen and (min-width: 800px) {
		.modal-content {
			width: 40%;
		}
	}
</style>
