"use strict";

const group_token = 'a7acb2c3d44ad4102eeb7800f01212d2363b52f96c7f8c37c798205f1d43dcac1e9d446a6a5d59358a032';

const vk = require("VK-Promise")(group_token);

const message = 'Hello from Node.js!';

const interval = 600000;

const now = new Date().getTime();

const isLater = date => date * 1000 < now - interval;

vk.messages.getDialogs({
		unread : 1
	})
	.then(res => {
		console.log(JSON.stringify(res));
		const users = res.items
			.filter(item => isLater(item.message.date))
			.map(item => item.message.user_id)
			.reduce(
				(previousValue, currentValue, index) => {
					let r;
					if(index % 100 === 0) {
						r = [...previousValue, [currentValue]];
					}
					else {
						previousValue[previousValue.length - 1] = [...previousValue[previousValue.length - 1], currentValue]
						r = previousValue;
					}
					return r;
				},
			[])
			.map(item => item.join(','));

		let i = 0;

		if(!users.length) return;

		setTimeout(function sendMessage() {
			if(i < users.length) {
				vk.messages.send({
						user_ids : users[i],
						message : 'Hello from Node.js!'
					})
					.then(console.log)
					.catch(console.error);
				i++;
				sendMessage();
			}
		}, 2000)
	})
	.catch(console.error);