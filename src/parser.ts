import { Playlist } from "./playlist";
import { Track } from "./track";


export class Parser {
    static parseMetadata(content: string): Record<string, string> {
        let mode: 'tag' | 'value' = 'tag';
        let quote: '"' | "'" | undefined;
        let tag: string = '';
        let value: string = '';
        let buffer: string = '';
        let record: Record<string, string> = {};

        for (let i = 0, max = content.length; i < max; ++i) {
            let char = content[i];

            if (quote) {
                if (char === quote) {
                    quote = undefined;
                    continue;
                }
                buffer += char;
                continue;
            } else if (char === '"' || char === "'") {
                quote = char;
                continue;
            }

            if (mode === 'tag') {
                if (char === '=') {
                    tag = buffer;
                    buffer = '';
                    mode = 'value';
                    continue;
                } else if (char === ' ') {
                    tag = buffer;
                    buffer = '';
                    mode = 'tag';

                    if (tag !== '')
                        record[tag] = '';

                    continue;
                } else if (char === ',') {
                    tag = buffer;
                    buffer = '';
                    record[tag] = '';
                    record['$title'] = content.slice(i + 1);
                    break;
                }
            } else if (mode === 'value') {
                if (char === ' ') {
                    value = buffer;
                    record[tag] = value;
                    mode = 'tag';
                    tag = '';
                    value = '';
                    buffer = '';

                    continue;
                } else if (char === ',') {
                    value = buffer;
                    buffer = '';
                    record[tag] = value;
                    record['$title'] = content.slice(i + 1);
                    break;
                }
            }

            buffer += char;
        }

        if (record['$title'])
            record['$title'] = record['$title'].trim();

        return record;
    }

    static parse(content: string): Playlist {
        // Binary portions of M3A files are not currently supported.
        // Pull requests welcome.
        content = content.replace(/#EXTBIN:.*/, '');

        let lines = content.split(/\r?\n/);
        let playlist: Playlist = {
            format: 'M3U',
            title: undefined,
            tracks: [],
            comments: []
        };

        let track: Track = {
            url: <any>undefined,
            metadata: {},
            comments: []
        };

        for (let line of lines) {
            line = line.trim();

            if (line === '')
                continue;

            if (line.startsWith('#')) {
                let text = line.slice(1);
                if (text === 'EXTM3U')
                    continue;
                if (text === 'EXTM3A') {
                    playlist.format = 'M3A';
                    continue;
                }

                let context: 'playlist' | 'track' = 'track';

                if (text.includes(':')) {
                    let key = text.slice(0, text.indexOf(':'));
                    let value = text.slice(text.indexOf(':') + 1);

                    switch (key) {
                        case 'EXTINF':
                            let durationPart = value.match(/^[0-9]+(\.[0-9]+)?/);
                            if (durationPart) {
                                track.duration = Number(durationPart[0]);
                                value = value.slice(durationPart[0].length);
                            }

                            let metadata = this.parseMetadata(value);
                            track.title = metadata['$title'] || undefined;
                            delete metadata['$title'];
                            track.metadata = metadata;
                            break;
                        case 'PLAYLIST':
                            playlist.title = value;
                            context = 'playlist';
                            break;
                        case 'EXTALB':
                            track.album = value;
                            break;
                        case 'EXTART': 
                            track.artist = value;
                            break;
                        case 'EXTGENRE': 
                            track.genre = value;
                            break;
                        case 'EXTBYT': 
                            track.fileSize = Number(value);
                            break;
                        case 'EXTENC': 
                            context = 'playlist';
                            playlist.encoding = value;
                            break;
                        case 'EXTIMG': 
                            track.image = value;
                            break;
                        case 'EXTGRP': 
                            track.group = value;
                            break;
                    }
                }

                if (context === 'track') {
                    track.comments.push({ text });
                } else if (context === 'playlist') {
                    playlist.comments.push({ text });
                }

            } else {
                track.url = line;
                playlist.tracks.push(track);
                track = {
                    url: <any>undefined,
                    metadata: {},
                    comments: []
                };
            }
        }

        return playlist;
    }
}
