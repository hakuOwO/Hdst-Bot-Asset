module.exports.config = {
    name: 'couple-dp',
    version: '4.3.7',
    hasPermssion: 0,
    credits: 'Rest API by John A.',
    description: 'Returns a random avatar matching photos.',
    commandCategory: 'media',
    usages: '',
    aliases: [ 'cdp' ],
    cooldowns: 10,
    dependencies: {
        'axios': '',
        'fs-extra': ''
    }
}

module.exports.run = async function ({ api, event, Utils }) {
	
	const { threadID, messageID, senderID } = event;
	const axios = require('axios');
	const fs = require('fs-extra');
	
	await axios.get('https://tanjiro-api.onrender.com/cdp?&api_key=tanjiro').then(async (res) => {
		
		const attch = [];
		const { male, female } = res.data;
		const malePath = `${Utils.rootPath}/cache/req-cdp${senderID}_male.png`;
		const femalePath = `${Utils.rootPath}/cache/req-cdp${senderID}_female.png`;
		
		await Utils.downloadFile(male, malePath).then(() => {
			attch.push(fs.createReadStream(malePath);
		}).catch((err) => {
			return api.sendMessage(Utils.textFormat('error', 'errProcessUnable'), threadID, messageID);
		});
		
		await Utils.downloadFile(female, femalePath).then(() => {
			attch.push(fs.createReadStream(femalePath);
		}).catch((err) => {
			return api.sendMessage(Utils.textFormat('error', 'errProcessUnable'), threadID, messageID);
		});
		
		if (attch.length > 0) {
			return api.sendMessage(
				{
					body: 'Here\'s a perfect matching photo for you ^^',
					attachment: attch
				},
				threadID,
				() => {
					try {
						fs.unlinkSync(malePath);
						fs.unlinkSync(femalePath);
					} catch (e) {}
				},
				messageID
			);
		} else {
			return api.sendMessage(Utils.textFormat('error', 'errProcessUnable'), threadID, messageID);
		}
	}).catch((err) => {
		Utils.logModuleErrorToAdmin(err, __filename, event);
		api.sendMessage(Utils.textFormat('error', 'errProcessUnable'), threadID, messageID);
	});
}