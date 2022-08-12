import { getInput, setOutput, setFailed } from '@actions/core';
import axios from 'axios';

const webhook: string = getInput('webhook');
const token: string = getInput('token');
const senderName: string = getInput('sender-name');
const senderImage: string = getInput('sender-image');
const title: string = getInput('title');
const mode: string = getInput('mode');
const infrastructure: string = getInput('infrastructure');
const version: string = getInput('version');
const ref: string = getInput('ref');
const emojis: any = {
    PKT: "🚀",
    AWS: "🚀",
    INT: "🛠"
}

function createMessage(text: string, senderName: string, senderImage: string, title: string) {
    return {
        text: text || '',
        bot: {
            name: senderName || '',
            image: senderImage || ''
        },
        card: {
            title: title || '',
        }
    };
}

function createText(mode: string) {

    const text: any = {
        release: `Cambios release [${version}](https://github.com/ndcmsl/${title}/releases/tag/${version})`,
        deploy: `Deployed ${ref == 'main' ? version : ref} in ${infrastructure} ${emojis[infrastructure] || ''}`,
        rollback: `Rollback ${version} in ${infrastructure} ${emojis[infrastructure] || ''}`
    }

    return text[mode];
}

function sendMessage(message: any) {

    axios.post(webhook, message, {
        params: {
            zapikey: token,
        },
    });
    setOutput('message-json', JSON.stringify(message));
}

try {

    let text = createText(mode);
    let cliqMessage = createMessage(text, senderName, senderImage, title);
    sendMessage(cliqMessage);

} catch (error) {
    setFailed(error.message);
}
