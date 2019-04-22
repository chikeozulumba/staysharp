import izitoast from 'izitoast';

const notify = (title, message, backgroundColor, messageColor = 'white', timeout = 3000, position = 'bottomRight', onClosing) => izitoast.show({
	title,
	message,
	messageColor,
	backgroundColor,
	onClosing,
	position,
	timeout,
});

export default notify;
