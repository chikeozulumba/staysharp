<template>
	<section id="register">
		<img id="leaf-rt" src="https://stay-sharp.herokuapp.com/images/leaf-rt@2x.png" alt>
		<img id="leaf-lb" src="https://stay-sharp.herokuapp.com/images/leaf-lb.png" alt>
			<div id="wrapper">
				<img id="caption" :src="caption" alt>
			</div>
		<div class="container-c mt-30">
			<div class="card-cus grid-cus">
				<section>Instructions</section>
				<form class="grid" @submit.prevent="doSubmit">
					<p style="font-family: Circular-Light; font-size: 0.9rem;">
						1) Drag each letter to form the correct words.
						<br>
						2) You have a maximum of <strong>2:00 minutes</strong> to complete this challenge
						<br>
						3) Share your score on social media
						<br>
						4) Ensure you have minimum stable internet connection.
					</p>
					<br>
					<br>
					<a style="text-decoration: underline; color: green; font-family: Circular-Bold" href="!#" @click.prevent="proceed">PLAY NOW</a>

					<span>If you encounter any errors while playing, kindly clear cache or see article. <br><a target="_blank" href="https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DDesktop&hl=en">Clear cache and cookies</a></span>
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
				disabled: false,
				caption: `https://stay-sharp.herokuapp.com/images/caption.png`,
			};
		},
		mounted() {
				
		},
		methods: {
			proceed () {
				Event.$emit('proceed');
			}
		}
	};
</script>

<style scoped>
span, span > a{
	font-family: Circular-light;
    line-height: 1;
    font-size: 0.9rem;
    text-align: center;
    margin: 10px;
}
#wrapper {
	position: fixed;
    width: 100%;
    top: 0;
    text-align: center;
}

#caption {
	height: 150px;
	margin-top: 20px;
}
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
		font-family: "BubbleGum", "Circular-Bold";
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
