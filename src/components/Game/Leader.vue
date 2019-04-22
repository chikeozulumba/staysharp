<template>
	<section id="register">
		<img id="leaf-rt" src="https://stay-sharp.herokuapp.com/images/leaf-rt@2x.png" alt>
		<img id="leaf-lb" src="https://stay-sharp.herokuapp.com/images/leaf-lb.png" alt>
		<div class="container-c mt-30">
			<div class="card-cus grid-cus">
				<section>Sharp Gang</section>
				
			</div>
		</div>
	</section>
</template>

<style scoped>
	.container-c {
		width: 60%;
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
