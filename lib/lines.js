module.exports = async () => {
    const axios = require('axios');

    const team = process.env.TEAM;
    const webhook = process.env.WEBHOOK_URL;

    const shouldBroadcast = (content) => {
        let cleanDescription = content.description.replace(/\(#\d+\)/, '').trim();
        return content.group == 'Game Lines' && content.market == 'Point Spread' && cleanDescription == team;
    }

    const onOutcomeCreated = async (content) => {
        if (shouldBroadcast(content)) {
            await axios.post(webhook, {
                content: `LINE OPEN | ${content.event} | ${content.description} ${content.price.handicap}`
            });
        }
    }

    const onHandicapChanged = async (content) => {
        if (shouldBroadcast(content)){
            await axios.post(webhook, {
                content: `LINE CHANGED | ${content.event} | ${content.description} ${content.price.handicap}`
            });
        }
    }

    return {
        onOutcomeCreated,
        onHandicapChanged
    }
}