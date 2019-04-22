<template>
	<section id="register">
		<img id="leaf-rt" src="https://stay-sharp.herokuapp.com/images/leaf-rt@2x.png" alt>
		<img id="leaf-lb" src="https://stay-sharp.herokuapp.com/images/leaf-lb.png" alt>
		<div class="container-c mt-30">
			<div class="card-cus grid-cus">
				<section>Get Started</section>
				<form class="grid" @submit.prevent="doSubmit">
					<input type="text" v-model="user.name" placeholder="Enter your nickname">
					<input type="email" v-model="user.email" placeholder="Enter Email Address">
					<input type="phone" v-model="user.phone" placeholder="Enter Phone Number">
					<button :disabled="disabled" type="submit">Continue</button>
					<a href="!#" @click.prevent="goBack">Go Back</a>
				</form>
			</div>
		</div>
	</section>
</template>

<script>
	import Event from "../utils/Event";
	import notify from "../utils/Toast";
	import axios from "axios";

	export default {
		data() {
			return {
				user: {},
				disabled: false
			};
		},
		methods: {
			async doSubmit(evt) {
				const form = new FormData();
				Object.entries(this.user).forEach(([key, value]) => {
					if (value === "") {
						return notify(
							"",
							`${key.toUpperCase()} cannot be empty!`,
							"red",
							"white",
							4000,
							() => {}
						);
					}
				});
				this.disabled = true;
				const config = {
					headers: { "Content-Type": "application/json" }
				};
				const { city, country_name, ip } = await this.getIpAddress();
				this.user.country = country_name;
				this.user.ipaddress = ip;
				this.user.city = city;
				try {
					const { request, data, error, status } = await axios.post(
						`${this.$url}users/register`,
						this.user,
						config
					);
					if (data.status)
						return notify(
							"",
							data.msg,
							"green",
							"white",
							3000,
							"topRight",
							() => {
								localStorage.setItem("sI7m2xsXhH-z-u", JSON.stringify(data.user));
								localStorage.setItem("TsI7m2xsXhH-z", JSON.stringify(data.user.currenttime));
								this.disabled = false;
								Event.$emit("onRegistered");
								window.location.href = "";
							}
						);
				} catch (error) {
					const errorMsg = error.response.data.msg;
					this.disabled = false;
					if (error.response.status === 400) {
						return Object.entries(errorMsg).forEach(([key, value]) => {
							return notify(
								"",
								`${key.toUpperCase()} cannot be empty!`,
								"red",
								"white",
								3000,
								"topRight",
								() => {}
							);
						});
					} else
						return notify(
							"",
							errorMsg,
							"red",
							"white",
							4000,
							"bottomRight",
							() => {}
						);
				}
			},
			getIpAddress: async () => {
				const ip = await fetch("https://ipapi.co/json/");
				return await ip.json();
			},
			goBack: evt => Event.$emit("goBack")
		}
	};
</script>

<style scoped>
	form > a {
		text-align: center;
		font-weight: 100;
		font-family: Circular-Book;
		margin: 2px 0;
		font-size: 0.9rem;
		color: #262121;
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
		margin: auto auto 50px;
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
</style>
