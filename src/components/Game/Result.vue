<template>
	<div>
		<!-- The Modal -->
		<div v-show="isModal" id="myModal" class="modal-c">
			<!-- Modal content -->
			<div class="modal-content">
				<span style="text-align: right;" @click="isModal = false" class="close">&times;</span><br>
				<span style="text-align: center; margin: 1rem auto; font-family: Circular-Bold;">TOP 20 SHARP LEADERS</span>
				<p>
					<table class="table table-striped">
						<thead class="thead-dark">
							<tr>
								<th scope="col">#</th>
								<th scope="col">Username</th>
								<th scope="col">Score</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(leader, index) in leaders" :key="index">
								<th style="font-size: 0.9rem" scope="row">{{ index += 1 }}</th>
								<td style="font-size: 0.9rem">@{{ leader.name }}</td>
								<td style="font-size: 0.9rem">{{ leader.total }}</td>
							</tr>
						</tbody>
					</table>
				</p>
			</div>
		</div>
		<section id="result">
			<div id="caption">
				<img :src="captionUrl" alt>
			</div>
			<div id="text">
				<h3 id="result-text">CONGRATS!</h3>
				<h5 id="small-text">{{ statusText }}</h5>
				<h1 id="main-result-text">{{ score }}</h1>
			</div>
			<h5 id="small-text">Tell Your Friends</h5>
			<div id="info">
				<a target="_blank" :href="twitterShare">
					<img :src="twitter" alt>
				</a>
				<a target="_blank" :href="facebookShare">
					<img :src="facebook" alt>
				</a>
				<a style="border-radius: 17px;" :href="whatsAppShare">
					<img :src="whatsapp" alt>
				</a>
			</div>
		</section>
		<div style="margin: 2rem 0;text-align: center;">
			<button @click="restartGame">Try Again</button>
			<br>
			<br>
			<a style="color:white; text-decoration: underline;" href @click.prevent="leader">View Leaderboard</a>
		</div>
	</div>
</template>

<script>
	import Event from "../../utils/Event";
	import axios from "axios";
	import notify from "../../utils/Toast";

	export default {
		data() {
			return {
				facebook: `${this.$url}images/social/facebook_new.svg`,
				twitter: `${this.$url}images/social/twitter_new.svg`,
				whatsapp: `${this.$url}images/social/whatsapp_new.svg`,
				score: null,
				captionUrl: `${this.$url}images/caption.png`,
				twitterShare: "",
				whatsAppShare: "",
				facebookShare: "",
				statusText: "",
				isModal: false,
				leaders: []
			};
		},
		methods: {
			async leader(evt) {
				const { data } = await axios.get(`${this.$url}users/leaders`);
				this.leaders = data.rows;
				this.isModal = true;
			},
			restartGame() {
				let user = localStorage.getItem("sI7m2xsXhH-z-u");
				user = JSON.parse(user);
				if (this.resetGameScore(user.name)) {
					localStorage.removeItem("sI7m2xsXhH");
					localStorage.setItem("sI7m2xsXhH-z", 0);
					localStorage.setItem("TsI7m2xsXhH-z", 7200);
					localStorage.removeItem("sI7m2xsXhH-z-l");
					localStorage.removeItem("TsI7m2xsXhH");
					Event.$emit("restart");
					return (window.location.href = "");
				} else {
					return notify("", 'Network Error, please try again!', "red", "white", 1000, "topRight", () => {});
				}
			},
			async totalScore(name) {
				const addScore = await fetch(`${this.$url}users/score/${name}/final`);
				const score = await addScore.json();
				localStorage.setItem("sI7m2xsXhH", parseInt(score.total, 10));
				this.score = score.total;
				if (this.score <= 0) this.statusText = `Ooops you could do better`;
				else if (this.score > 0 && this.score <= 15)
					this.statusText = `You scored nice points, Good for you!`;
				else if (this.score > 15 && this.score <= 30)
					this.statusText = `Impressive points, Captain!`;
				else
					this.statusText = `You have one of the best game points, Keep it up!`;
				this.twitterShare = encodeURI(
					`https://twitter.com/intent/tweet?text=I just played STAY SHARP and scored ${
						this.score
					} points.\nTry and beat my score. 👉&url=https://www.staysharp.ng`
				);
				this.whatsAppShare = encodeURI(
					`whatsapp://send?text=I just played STAY SHARP and scored ${
						this.score
					} points.\nTry and beat my score 👉 https://www.staysharp.ng`
				);
				this.facebookShare = encodeURI(`https://www.facebook.com/sharer/sharer.php?u=http://www.staysharp.ng&quote=I just played STAY SHARP and scored ${this.score} points.\nTry and beat my score. https://www.staysharp.ng`);
			},
			async resetGameScore(name) {
				const { data } = await axios.get(`${this.$url}users/reset/${name}`);
				if (data.status === true) return true;
				else return false;
			}
		},
		mounted() {
			let user = localStorage.getItem("sI7m2xsXhH-z-u");
			user = JSON.parse(user);
			return this.totalScore(user.name);
		}
	};
</script>

<style scoped>
	.table .thead-dark th {
			color: #fff;
			background-color: #0e2710;
			border-color: #0e2710;
	}
	#info {
		background: white;
    border-radius: 10px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		margin: 0 auto;
		border-top: 1px solid #f7f7f7;
		border-bottom: 1px solid #f7f7f7;
		padding: 1rem 0;
	}
	#info a > img {
		height: 2rem;
	}
	#info a {
		margin: 0 1rem;
	}
	#info a:hover {
		box-shadow: 1px 1px 15px 1px darkgrey;
		border-radius: 17px;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	#main-result-text {
		margin: 1rem 0;
		font-size: 10rem;
		color: white;
		font-family: "GothamRounded-Bold";
	}
	#result {
		display: grid;
		grid-gap: 10px;
		grid-template-rows: 0.5fr 1fr;
	}

	#small-text {
		/* margin: 1rem 0; */
		font-family: "BubbleGum";
		color: white;
		font-size: 0.9rem;
	}

	#result-text {
		margin: 1rem 0 0;
		font-family: "GothamRounded-Light";
		color: white;
		font-size: 2.3rem;
		letter-spacing: 5px;
	}

	#caption {
		text-align: center;
	}

	#caption img {
		margin-top: 50px;
		height: 150px;
	}

	button {
		padding: 0.5rem 1.5rem;
		margin: 0px auto 1rem;
		background: #0a1307;
		color: white;
		border: 10px solid #262121;
		font-size: 1rem;
		font-family: "BubbleGum";
		border-radius: 100px;
		cursor: pointer;
		-webkit-box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
		-moz-box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
		box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
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
		-webkit-background-color: rgb(0, 0, 0); /* Fallback color */
		background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
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
			width: 85%;
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