"use strict";

const group_token = 'a7acb2c3d44ad4102eeb7800f01212d2363b52f96c7f8c37c798205f1d43dcac1e9d446a6a5d59358a032';

const vk = require("VK-Promise")(group_token);

const message = 'Вам людям, лишь-бы только гадости разные говорить, толи дело мы, роботы - базарим только по факту!';

const interval = 6;

const now = new Date().getTime();

const isLater = date => date * 1000 < now - interval;

const sendMessage = (user_ids) => new Promise((resolve, reject) =>
	setTimeout(() => 
		vk.messages.send({
			user_ids : user_ids,
			message : message
		})
		.then(resolve)
		.catch(reject),
		//vk.messages.send((err, res) => err ? reject(err) : resolve(res)),
 	2000)
)

vk.messages.getDialogs({
		unread : 1
	})
	.then(res => {
		console.log(JSON.stringify(res));
		//return 
		res.items
			.filter(item => isLater(item.message.date))
			.map(item => item.message.user_id)
			.reduce(
				(previousValue, currentValue, index) => {
					let r;
					if(index && index % 100 === 0) {
						r = [...previousValue, [currentValue]];
					}
					else {
						previousValue[previousValue.length - 1] = [...previousValue[previousValue.length - 1], currentValue]
						r = previousValue;
					}
					return r;
				},
			[[]])
			.forEach(item => sendMessage(item.join(',')))
		//:
		//new Error('нет не отвеченный сообщений')
			//.map(item => item.join(','));

		//console.log(r);
		//return r;
	})
	//.then(Promise.all)
	.catch(console.error);