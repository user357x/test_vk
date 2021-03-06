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
	
	if(!res.length) return;

	const users = [];
	
	let j;

	for(let i = 0; i < res.length; i++) {
		if(!isLater(res[i].message.date)) continue;

		if(i % 100 === 0) {
			j = i === 0 ? 0 : j + 1;
			users[j] = `${res[i].message.user_id}`;
		}
		else {
			users[j] = `${users[j]},${res[i].message.user_id}`;
		}
	}

	if(!users.length) return;

	j = 0;
	const pause = 2000;

	setTimeout(function sendMessage() {
		if(j < users.length) {
			vk.messages.send({
				user_ids : users[j],
				message : 'Hello from Node.js!'
			})
			.then(console.log)
			.catch(console.error);
			j++;
			setTimeout(sendMessage, pause);
		}
	}, pause)

}).catch(console.error);