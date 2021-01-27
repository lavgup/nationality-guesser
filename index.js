const { Plugin } = require('powercord/entities');
const { get } = require('powercord/http');

class NationalityGuesser extends Plugin {
    startPlugin() {
        this.registerCommand();
    }

    registerCommand() {
        powercord.api.commands.registerCommand({
            command: 'nationality',
            aliases: ['nat', 'ng'],
            usage: "{c} <name>",
            executor: (args) => this.getNationality(args)
        });
    }

    async getNationality(args) {
        if (!args.length)
            return {
                send: false,
                result: 'What name should I guess the nationality of?'
            };

        const { body } = await get(`https://api.nationalize.io?name=${args[0]}`);
        if (!body?.country?.length)
            return {
                send: false,
                result: "Couldn't find a nationality for that name!"
            };

        const capitalize = (text) => text[0].toUpperCase() + text.slice(1);

        return {
            send: false,
            result: {
                type: "rich",
                title: capitalize(args[0]),
                fields: body.country.map((country) => ({
                    name: country.country_id,
                    value: `Probability: ${((country.probability / 1) * 100).toFixed(2)}%`
                }))
            }
        };
    }
}

module.exports = NationalityGuesser;