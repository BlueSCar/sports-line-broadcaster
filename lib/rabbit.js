module.exports = async (lines) => {
    const amqp = require('amqplib');

    const url = process.env.RABBIT_URL;
    const virtualHost = process.env.VIRTUAL_HOST;
    const user = process.env.RABBIT_USER;
    const password = process.env.RABBIT_PASSWORD;

    const connection = await amqp.connect(`amqp://${user}:${password}@${url}/${virtualHost}`);
    const channel = await connection.createChannel();

    const createQueue = async (exchangeName, action) => {
        channel.assertExchange(exchangeName, 'fanout');

        let q = await channel.assertQueue('', {
            exclusive: true
        });

        channel.bindQueue(q.queue, exchangeName, '');

        channel.consume(q.queue, (message) => {
            if (message.content) {
                action(JSON.parse(message.content.toString()));
            }
        }, {
            noAck: true
        });
    }

    await createQueue('outcome_created', lines.onOutcomeCreated)
    await createQueue('outcome_handicap_changed', lines.onHandicapChanged);
}