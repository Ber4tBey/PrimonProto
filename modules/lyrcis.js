const Genius = require("genius-lyrics");
const Client = new Genius.Client("HOAnWV-f4dqf2id6JLyZsjHvcEofEYRZePkc3GLiFePZDecBgsvkJvN2YcfVWBjI"); // Demo Key

addCommand( {pattern: "^lyrics ?(.*)", access: "all", desc: "_Get lyrics of a song._", usage: global.handlers[0] + "lyrics <query>" }, async (msg, match, sock) => {
    if (!match[1]) return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Please provide a song to search for._", edit: msg.key });

    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, { text: "_⏳ Lyrics Downloading.._", edit: msg.key });
    }
    else {
        await sock.sendMessage(msg.key.remoteJid, { text: "_⏳ Lyrics Downloading.._"});
    }

    try {
        const searches = await Client.songs.search(match[1]);

        const firstSong = searches[0];
        const imageUrl = firstSong._raw.header_image_url
        const title = firstSong._raw.primary_artist_names + " - " + firstSong._raw.title
        
        const lyrics = await firstSong.lyrics();
    
        if (msg.key.fromMe) {
            await sock.sendMessage(msg.key.remoteJid, { delete: msg.key });
            await sock.sendMessage(msg.key.remoteJid, { image: { url: imageUrl }, caption: title + "\n\n" + lyrics });
        }
        else {
            await sock.sendMessage(msg.key.remoteJid, { image: { url: imageUrl }, caption: title + "\n\n" + lyrics });
        }
    
        return;
    } catch {
       if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No lyrics found for this song._", edit: msg.key });
       }
       else {
        return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No lyrics found for this song._"});
       }

    }
})