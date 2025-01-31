const simpleGit = require('simple-git');
const git = simpleGit();
const { execSync } = require('child_process');

addCommand({ pattern: "^update$", access: "sudo", desc: "_Update the bot._" }, async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;

    if (msg.key.fromMe) {
        await sock.sendMessage(groupId, { text: `🔄 Updating...`, edit: msg.key });
    } else {
        var publicMessage = await sock.sendMessage(groupId, { text: `🔄 Updating...` }, { quoted: rawMessage.messages[0] });
    }

    const branch = 'main';
    await git.fetch();
    var commits = await git.log([branch + '..origin/' + branch]);
    
    if (commits.total === 0) {
        if (msg.key.fromMe) {
            await sock.sendMessage(groupId, { text: `🔄 No updates available.`, edit: msg.key });
        } else {
            await sock.sendMessage(groupId, { text: `🔄 No updates available.`, edit: publicMessage.key });
        }
        return;
    }

    

    await git.stash();
    try {
        await git.pull();
        if (msg.key.fromMe) {
            await sock.sendMessage(groupId, { text: `✅ Update successful.`, edit: msg.key });
        } else {
            await sock.sendMessage(groupId, { text: `✅ Update successful.`, edit: publicMessage.key });
        }
    } catch (err) {
        if (msg.key.fromMe) {
            await sock.sendMessage(groupId, { text: `❌ Update failed.`, edit: msg.key });
        } else {
            await sock.sendMessage(groupId, { text: `❌ Update failed.`, edit: publicMessage.key });
        }
    }
    await git.stash(['pop']);
    try {
        execSync('nvm use --lts && npm install', { stdio: 'inherit' });
    } catch (error) {
        console.error('Failed to update dependencies:', error);
    }
    process.exit(0);
});