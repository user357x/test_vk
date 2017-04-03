"use strict";

const group_token = 'a7acb2c3d44ad4102eeb7800f01212d2363b52f96c7f8c37c798205f1d43dcac1e9d446a6a5d59358a032';

const vk = require("VK-Promise")(group_token);

const message = 'Hello from Node.js!';

const interval = 600000;

const now = new Date().getTime();

const isLater = date => date * 1000 < now - interval;

vk.getAll("messages.getDialogs", {
	unread : 1,
	count : 200
})
.then(res => {
	
	console.log(JSON.stringify(res));

	if(!res.length) return;

	let i;

	const users = res.reduce(
		(previousValue, item, index) => {
			if(!isLater(item.message.date)) return;

			if(index % 100 === 0) {
				i = index === 0 ? 0 : i + 1;
				previousValue[i] = `${item.message.user_id}`;
			}
			else {
				previousValue[i] = `${previousValue[i]},${item.message.user_id}`;
			}

			return previousValue;
		},
	[]);

	if(!users || !users.length) return;

	i = 0;
	const pause = 2000;

	setTimeout(function sendMessage() {
		if(i < users.length) {
			vk.messages.send({
				user_ids : users[i],
				message : 'Hello from Node.js!'
			})
			.then(console.log)
			.catch(console.error);
			i++;
			setTimeout(sendMessage, pause);
		}
	}, pause)

}).catch(console.error);