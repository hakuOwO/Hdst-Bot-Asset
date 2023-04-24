module.exports.config = {
	name: 'afk',
	version: '1.0 0',
	hasPermssion: 0,
	cooldowns: 60,
	usages: '<message>',
	description: 'Set an AFK message will be displayed when someone mentioned you. AFK will automatically remove once you send any message.',
	commandCategory: 'administration',
	credits: 'Hadestia',
	envConfig: {
		requiredArgument: 2,
		needGroupData: true,
		groupCommandOnly: true
	}
}

module.exports.run = async function ({ api, args, event, body, Utils, Threads }) {
	
	const { senderID, threadID, messageID } = event;
	const { afk } = await Threads.getData(threadID);
	
	afk[senderID] = {
		message: body,
		timestamp: Date.now()
	}
	
	api.sendMessage(
		`I set your AFK: ${body}.`,
		threadID,
		messageID
	)
	
	await Threads.setData(threadID, { afk });
}

module.exports.handleEvent = async function ({ api, event, Utils, Threads }) {
	
	const { senderID, threadID, messageID } = event;
	const { afk } = await Threads.getData(threadID);
	
	if (afk[senderID]) {
		const name = await Users.getNameUser(senderID);
		await delete afk[senderID];
		api.sendMessage(
			{
				body: `Welcome back ${name}, I removed your AFK.`,
				mentions: [ { tag: String(name), id: String(senderID) } ]
			},
			threadID,
			Utils.autoUnsend
		);
		await Threads.setData(threadID, { afk });
	} else {
		if (Object.keys(event.mentions).length > 0 && senderID !== Utils.BOT_ID) {
			for (const userID in event.mentions) {
				if (afk[userID]) {
					
					const data = afk[userID];
					const name = (event.mentions[userID]).replace('@', '');
					const when = await Utils.getRemainingTime(Math.abs(data.timestamp - Date.now())/1000);
					const ago_text = await Utils.fancyFont.get(`${when} ago`, 6);
					
					api.sendMessage(
						`${await Utils.fancyFont.get(name, 1)} is AFK: ${data.message} - ${ago_text}.`,
						threadID,
						Utils.autoUnsend,
						messageID
					);
					
				}
			}
		}
	}
}