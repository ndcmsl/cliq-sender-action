import { getInput, setOutput, setFailed } from '@actions/core';
import axios from 'axios';
const { exec } = require("child_process");

try {

    const webhook: string = getInput('webhook');
    const token: string = getInput('token');
    const senderName: string = getInput('sender-name');
    const senderImage: string = getInput('sender-image');
    const title: string = getInput('title');
    const tag: string = getInput('tag');
    const environment: string = getInput('environment');
    const rollback: string = getInput('rollback');
    const version: string = getInput('version');
    const ref: string = getInput('ref');

    if (tag == 'true') {

        exec("git tag --format='%(refname:strip=2)' --sort=creatordate | grep -i '^[1-9]' | tail -n 1", (error, stdout, stderr) => {

            stdout = stdout.replace('\n', '');
            let urlTemplate: string = `Cambios release [${stdout}](https://github.com/ndcmsl/${title}/releases/tag/${stdout})`;
            let cliqMessage = {
                text: urlTemplate || '',
                bot: {
                    name: senderName || '',
                    image: senderImage || ''
                },
                card: {
                    title: title || '',
                }
            };
            sendMessage(cliqMessage);

        });

    } else {

        const emojis: any = {
            prod: "🚀",
            integration: "🛠"
        }

        if (ref == 'main') {

            let text: string = `Deployed ${version} in ${environment} ${emojis[environment] || ''}`;
            if (rollback == 'true')
                text = `Rollback ${version} in ${environment} ${emojis[environment] || ''}`;

            let cliqMessage = {
                text: text || '',
                bot: {
                    name: senderName || '',
                    image: senderImage || ''
                },
                card: {
                    title: title || '',
                }
            };
            sendMessage(cliqMessage);

        } else {

            let text: string = `Deployed ref ${ref} in ${environment} ${emojis[environment] || ''}`;

            let cliqMessage = {
                text: text || '',
                bot: {
                    name: senderName || '',
                    image: senderImage || ''
                },
                card: {
                    title: title || '',
                }
            };
            sendMessage(cliqMessage);

        }

    }

    function sendMessage(message: any) {

        axios.post(webhook, message, {
            params: {
                zapikey: token,
            },
        });
        setOutput('message-json', JSON.stringify(message));

    }


} catch (error) {
    setFailed(error.message);
}
