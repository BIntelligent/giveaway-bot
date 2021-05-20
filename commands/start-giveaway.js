const ms = require('ms');

exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if (!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")) {
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
    }
    const filter = msg => msg.author.id == message.author.id;
    const options = {
        max: 1
    };
    //===============================================================================================
    // Getting Channel
    message.channel.send(":tada: Alright! Let's set up your giveaway! First, what channel do you want the giveaway in?");
    let col = await message.channel.awaitMessages(filter, options);
    if (col.first().content == 'cancel') return message.channel.send('Giveaway Cancelled.')
    let channel;
    if (col.first().mentions.channels.first()) {
        channel = col.first().mentions.channels.first()
    } else {
        if (!col.first().content) return message.channel.send("Either mention a channel or put it's Name / ID.")
        if (isNaN(col.first().content)) channel = message.guild.channels.cache.find(m => m.name.includes(col.first().content))
        else channel = message.guild.channels.cache.get(col.first().content);
    };
    if (!channel.id) return message.channel.send("Channel not found.");
    //===============================================================================================
    // Getting Duration
    message.channel.send(":tada: Sweet! The giveaway will be in <#" + channel.id + ">! Next, how long should the giveaway last?");
    let col2 = await message.channel.awaitMessages(filter, options);
    if (col2.first().content == 'cancel') return message.channel.send('Giveaway Cancelled.')
    let giveawayDuration = col2.first().content;
    // If the duration isn't valid
    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
        return message.channel.send(':x: You have to specify a valid duration!');
    }
    //===============================================================================================
    // Number of winners
    message.channel.send(":tada: Neat! This giveaway will last " + giveawayDuration + "! Now, how many winners should there be?");
    let col3 = await message.channel.awaitMessages(filter, options);
    if (col3.first().content == 'cancel') return message.channel.send('Giveaway Cancelled.')
    let giveawayNumberWinners = col3.first().content;
    // If the specified number of winners is not a number
    if (isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) {
        return message.channel.send(':x: You have to specify a valid number of winners!');
    }
    //===============================================================================================
    // Giveaway prize
    message.channel.send(":tada: Ok! " + giveawayNumberWinners + " winner it is! Finally, what do you want to give away?");
    let col4 = await message.channel.awaitMessages(filter, options);
    if (col4.first().content == 'cancel') return message.channel.send('Giveaway Cancelled.')
    let giveawayPrize = col4.first().content;
    // If no prize is specified
    if (!giveawayPrize) {
        return message.channel.send(':x: You have to specify a valid prize!');
    }
    //===============================================================================================
    // Start the giveaway
    client.giveawaysManager.start(channel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: giveawayNumberWinners,
        // Who hosts this giveaway
        hostedBy: client.config.hostedBy ? message.author : null,
        // Messages
        messages: {
            giveaway: (client.config.everyoneMention ? "@everyone\n\n" : "") + "🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: (client.config.everyoneMention ? "@everyone\n\n" : "") + "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with 🎉 to participate!",
            winMessage: "Congratulations, {winners}! You won **{prize}**!",
            embedFooter: "Giveaways",
            noWinner: "Giveaway cancelled, no valid participations.",
            hostedBy: "Hosted by: {user}",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });
    //===============================================================================================
    message.channel.send(":tada: Done! The giveaway for the `" + giveawayPrize + "` is starting in <#" + channel.id + ">!");

};