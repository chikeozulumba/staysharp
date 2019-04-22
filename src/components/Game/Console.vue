<template>
	<section class="container-fluid" id="console">
		<h2 id="username" style="margin: 1rem; font-size: 1.5rem;" class="title is-6">{{ `${user.name}` }}</h2>
		<div id="caption">
			<img :src="captionUrl" alt>
		</div>
		<div id="content" class="row">
			<timer id="timer"></timer>
			<div id="game" class="container w-50">
				<div v-for="(image, index) in images" :key="index" class>
					<div class="card" :class="[rotate ? rotate[index + 1] : 'rotate-1']">
						<img class="card-img-top" :src="image">
					</div>
				</div>
			</div>
			<!-- <score id="score"></score> -->
		</div>
		<div class="single flex-start-content halfs stack" style="margin: 0 auto 200px;">
			<transition-group
				id="grid-answers"
				tag="div"
				name="sortableCards"
				class="grid single fourths flex-start-content disable-marker cards clickable sortable-animation"
				swappable
			>
				<div
					v-for="(answer, index) in answers"
					:key="index + 1"
					:style="{ backgroundColor: coloredCards[index] }"
					swapItem
					class="card answers"
				>
					<h3>{{ answer }}</h3>
				</div>
			</transition-group>
		</div>
		<div class="meta">
			<button v-show="doShow" @click="doSubmit" type="submit">Submit</button>
		</div>
	</section>
</template>

<script>
	import { Swappable, Sortable } from "@shopify/draggable";
	import axios from "axios";
	import shuffle from 'shuffle-array';
	import Event from "../../utils/Event";
	import notify from "../../utils/Toast";
	import { colors, questions } from "../../utils/Index";
	import Colors from "../../utils/Colors";
	import Timer from "./components/Timer.vue";
	import Score from "./components/Score.vue";

	export default {
		data() {
			return {
				captionUrl: `${this.$url}images/caption.png`,
				images: [],
				rotate: ["rotate-1", "rotate-2", "rotate-3", "rotate-4"],
				coloredCards: colors,
				answers: [],
				final: null,
				question: shuffle(questions)[0],
				user: JSON.parse(localStorage.getItem("sI7m2xsXhH-z-u")),
				doShow: true,
				onSuccess: new Audio(`${this.$url}sound/on_success.mp3`),
				onError: new Audio(`${this.$url}sound/on_error.mp3`),
				onMove: new Audio(`${this.$url}sound/on_move.mp3`)
			};
		},
		methods: {
			sortResults(collection) {
				const arr = [];
				for (let i = 0; i < collection.length; i++) {
					arr.push(collection[i].textContent.toLowerCase()); //second console output
				}
				return arr.join("");
			},
			async doSubmit(evt) {
				evt.preventDefault();
				this.doShow = false;
				const result = document.getElementsByClassName("answers");
				this.final = this.sortResults(result);
				const { data } = await axios.post(
					`${this.$url}check-answer/${this.question}/${this.user.name}`,
					{
						answer: this.final,
						currenttime: localStorage.getItem("TsI7m2xsXhH-z")
					}
				);
				if (data === "WRONG") {
					this.doShow = true;
					this.onError.play();
					return notify("", data, "red", "white", 1000, "topRight", () => {});
				}
				this.doShow = true;
				this.onSuccess.play();
				return this.loadNext();
			},
			randomize(array, integer) {
				const index = array.indexOf(integer);
				array.splice(index, 1);
				return shuffle(array)[0]
			},
			async loadNext() {
				this.question = this.randomize(questions, this.question);
				const { data } = await axios.get(
					`${this.$url}start/${this.question}/${this.user.name}`
				);
				const images = data.question.images.map(
					image => `https://res.cloudinary.com/wild-fusions/image/upload/w_300,q_10,q_auto:low,ar_4:3,c_fill,fl_lossy/c_scale,w_auto,dpr_auto/v1550071863/stay-sharp/${this.question}/${image}`
				);
				this.answers = data.question.answer;
				this.images = images;
				this.question = data.question.question;
				localStorage.setItem("sI7m2xsXhH-z-l", this.question);
				Event.$emit("set-score");
			}
		},
		mounted() {
			console.log(this.question)
			// this.question =
			// 	localStorage.getItem("sI7m2xsXhH-z-l") !== null
			// 		? localStorage.getItem("sI7m2xsXhH-z-l")
			// 		: 1;
			fetch(`${this.$url}start/${this.question}/${this.user.name}`)
				.then(res => res.json())
				.then(res => {
					this.question = res.question.question;
					this.answers = res.question.answer;
					return res.question.images.map( // Change to cloudinary
						image => `https://res.cloudinary.com/wild-fusions/image/upload/w_300,q_10,q_auto:low,ar_4:3,c_fill,fl_lossy/c_scale,w_auto,dpr_auto/v1550071863/stay-sharp/${this.question}/${image}`
					);
				})
				.then(images => (this.images = images))
				.then(res => {
					const swappable = new Sortable(
						document.querySelectorAll("[swappable]"),
						{
							draggable: "[swapItem]",
							delay: 1
						}
					);
					swappable.on("drag:stop", () => this.onMove.play());
				});
			Event.$emit("start-timer");
		},
		components: {
			Timer,
			Score
		}
	};
</script>

<style scoped>
	.card {
		text-transform: lowercase;
		color: aliceblue;
		border: 0px solid !important;
	}
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin-bottom: 0;
		margin-top: 2px;
	}
	div.meta {
		text-align: center;
	}

	#caption {
		z-index: 9999999999999;
	}

	div.meta button {
		padding: 0.5rem 1.5rem;
		background: #0a1307;
		color: white;
		border: 10px solid #262121;
		font-size: 1.5rem;
		font-family: "BubbleGum", 'Circular-Bold';
		font-weight: 600;
		border-radius: 100px;
		cursor: pointer;
		-webkit-box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
		-moz-box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
		box-shadow: -1px 0px 15px 16px rgba(0, 0, 0, 0.23);
		position: fixed;
		bottom: 20px;
		right: 20px;
	}

	div.meta button:hover {
		box-shadow: -1px 0px 15px 16px rgba(22, 64, 28, 0.33);
		transform: translateY(-15px);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.6s;
	}

	#input {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		grid-column-gap: 20px;
		margin-top: 80px;
		margin-bottom: 80px;
		margin-left: auto;
		margin-right: auto;
	}

	.border-red {
		border: 5px solid red !important;
	}

	.stack .card {
		height: 50px;
		width: 50px;
		border-radius: 5px;
		border: 1px solid white;
		font-family: "Circular-Bold";
		font-weight: 600;
		font-size: 2rem;
		text-align: center;
		padding: 5px;
		box-shadow: -1px 0px 8px 5px rgba(10, 10, 10, 0.34);
	}

	.card-img-top {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 2px;
		border-bottom-left-radius: 2px;
		height: 140px;
		/* margin-bottom: 50px; */
	}
	/* 
																																																				.card {
																																																					position: relative;
																																																			    width: 60%;
																																																				} */

	#grid-answers {
		/* display: grid;
																																																	grid-template-columns: 1fr 1fr 1fr 1fr;
																																																	grid-gap: 3px;
																																																	justify-items: center;
																																																	align-items: center; */
		margin-top: 50px;
	}

	.rotate-1 {
		transform: rotate(-13deg);
	}

	.rotate-2 {
		transform: rotate(6deg);
		transform: translateY(10px);
	}

	.rotate-3 {
		transform: rotate(-10deg);
	}

	.rotate-4 {
		transform: translateY(-20px) rotate(10deg);
	}

	.card {
		padding: 0.2rem;
	}

	#console {
		display: grid;
		grid-gap: 10px;
		grid-template-rows: 0.5fr 2fr 5fr;
		height: 100vh;
	}

	#caption {
		text-align: center;
	}

	#caption img {
		margin-top: 50px;
		height: 150px;
	}

	#game {
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	#timer {
		position: fixed;
		top: 0%;
	}
	#score {
		position: absolute;
		top: 40%;
		right: 0;
	}

	@media screen and (min-width: 1199px) {
		.w-50 {
			width: 40% !important;
		}
	}

	@media screen and (min-width: 1299px) {
		.w-50 {
			width: 30% !important;
		}
	}

	@media screen and (max-width: 676px) {
		.w-50 {
			width: 60% !important;
		}
	}

	@media screen and (max-width: 500px) {
		.w-50 {
			width: 80% !important;
		}

		#grid-answers {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		}
	}

	@media screen and (max-width: 400px) {
		.w-50 {
			width: 80% !important;
		}

		#grid-answers {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			margin-bottom: 100px;
			margin-top: 0 !important;
		}

		#caption img {
			margin-top: 100px;
			height: 100px;
		}
	}
</style>
