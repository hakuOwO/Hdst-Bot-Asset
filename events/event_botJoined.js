module.exports.config = {
	name: 'setup',
	eventType: ['log:subscribe'],
	version: '1.0.3',
	credits: 'Hadestia',
	description: 'Set up bot when connected to the group.',
	envConfig: {
		allowBannedThread: false
	}
};

module.exports.run = async function({ api, event, Utils }) {
	
	const { threadID } = event;
	
	// If joined user was this bot
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == Utils.BOT_ID)) {
		
		api.changeNickname(Utils.textFormat('system', 'botNicknameSetup', global.HADESTIA_BOT_CONFIG.PREFIX, (!global.HADESTIA_BOT_CONFIG.BOTNAME) ? ' ' : global.HADESTIA_BOT_CONFIG.BOTNAME), threadID, Utils.BOT_ID);
		
		const messageBody = `${Utils.textFormat('events', 'eventBotJoinedConnected', global.HADESTIA_BOT_CONFIG.BOTNAME, global.HADESTIA_BOT_CONFIG.PREFIX)}\n\n${Utils.textFormat('cmd', 'cmdHelpUsageSyntax', global.HADESTIA_BOT_CONFIG.PREFIX, Utils.BOT_FULLNAME)}`;
		// send a startup mesaage
		return api.sendMessage(
			messageBody,
			threadID,
			Utils.autoUnsend
		);
	}
}