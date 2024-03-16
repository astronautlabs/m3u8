import { expect } from "chai";
import { describe, it } from "@jest/globals";
import { Parser } from "./parser";
import { ENCODING, EXAMPLE_1, METADATA, NEWLINES } from "./fixtures";
import { Track } from "./track";

describe('Parser', () => {
    describe('parse()', () => {
        it('parses a straightforward example', () => {
            let playlist = Parser.parse(EXAMPLE_1);

            expect(playlist.format).to.equal('M3U');
            expect(playlist.tracks.length).to.equal(2);
            expect(playlist.tracks[0].url).to.equal('C:\\Documents and Settings\\I\\My Music\\Sample.mp3');
            expect(playlist.tracks[0].duration).to.equal(123);
            expect(playlist.tracks[0].title).to.equal('Sample artist - Sample title');

            expect(playlist.tracks[1].url).to.equal('C:\\Documents and Settings\\I\\My Music\\Greatest Hits\\Example.ogg');
            expect(playlist.tracks[1].duration).to.equal(321);
            expect(playlist.tracks[1].title).to.equal('Example Artist - Example title');
        });
        it('parses a metadata-rich example', () => {
            let playlist = Parser.parse(METADATA);

            expect(playlist.format).to.equal('M3U');
            expect(playlist.title).to.equal('PlaylistTitle');
            expect(playlist.tracks.length).to.equal(3);

            function assertEmptyTrack(track: Track) {
                expect(track.duration).not.to.exist;
                expect(track.title).not.to.exist
                expect(track.album).not.to.exist
                expect(track.artist).not.to.exist
                expect(track.comments).to.be.empty;
                expect(track.fileSize).not.to.exist;
                expect(track.genre).not.to.exist;
                expect(track.group).not.to.exist;
                expect(track.image).not.to.exist;
                expect(track.metadata).to.eql({});
                expect(track.title).not.to.exist;
            }

            expect(playlist.tracks[0].url).to.equal('NoMetadata.mp3');
            assertEmptyTrack(playlist.tracks[0]);
            expect(playlist.tracks[2].url).to.equal('NoMetadata.mp3');
            assertEmptyTrack(playlist.tracks[2]);

            expect(playlist.tracks[1].url).to.equal('Metadata.mp3');
            
            let track = playlist.tracks[1];
            expect(track.duration).to.equal(321);
            expect(track.title).to.equal('Title')
            expect(track.album).to.equal('TheAlbum');
            expect(track.artist).to.equal('TheArtist')
            expect(track.comments).to.eql([
                { text: 'EXTINF:321 foo="bar" bar="baz" baz="123",Title' },
                { text: 'EXTGRP:TheGroup' },
                { text: 'EXTALB:TheAlbum' },
                { text: 'EXTART:TheArtist' },
                { text: 'EXTGENRE:Jazz' },
                { text: 'EXTBYT:999' },
                { text: 'EXTIMG:Image.jpg' }
            ]);
            expect(track.fileSize).to.equal(999);
            expect(track.genre).to.equal('Jazz');
            expect(track.group).to.equal('TheGroup');
            expect(track.image).to.equal('Image.jpg');
            expect(track.metadata).to.eql({ foo: 'bar', bar: 'baz', baz: '123' });
            expect(track.title).to.equal('Title');
        });
        it('is lenient with newline formats', () => {
            let playlist = Parser.parse(NEWLINES);

            expect(playlist.tracks.length).to.equal(3);
            expect(playlist.tracks[0].url).to.equal('Item1');
            expect(playlist.tracks[1].url).to.equal('Item2');
            expect(playlist.tracks[2].url).to.equal('Item3');
        });
        it('reports encoding, but ignores it', () => {
            let playlist = Parser.parse(ENCODING);

            expect(playlist.encoding).to.equal('SomethingElse');
            expect(playlist.comments).to.eql([
                { text: 'EXTENC:SomethingElse' }
            ]);
        });
    });
    describe('parseMetadata()', () => {
        it('parses a straightforward example', () => {
            let result = Parser.parseMetadata('tvg-id="Be1.be" tvg-name="Be1 Alt" group-title="News" parent-code="1234" audio-track="nl",Be1 Name');
            expect(result['tvg-id']).to.equal('Be1.be');
            expect(result['tvg-name']).to.equal('Be1 Alt');
            expect(result['group-title']).to.equal('News');
            expect(result['parent-code']).to.equal('1234');
            expect(result['audio-track']).to.equal('nl');
            expect(result['$title']).to.equal('Be1 Name');
        });
        it('parses a strange example', () => {
            let result = Parser.parseMetadata('"thing a"="thing b" alt-"a b c"=abc noquotes=fine standalonetag,thetitle');
            expect(result['thing a']).to.equal('thing b');
            expect(result['alt-a b c']).to.equal('abc');
            expect(result['noquotes']).to.equal('fine');
            expect(result['standalonetag']).to.equal('');
            expect(result['$title']).to.equal('thetitle');
        });
        it('is lenient about spaces', () => {
            let result = Parser.parseMetadata('a=1  b=2   c=3    d=4,thetitle');
            expect(result['a']).to.equal('1');
            expect(result['b']).to.equal('2');
            expect(result['c']).to.equal('3');
            expect(result['d']).to.equal('4');
            expect(result['$title']).to.equal('thetitle');
        });
        it('supports single quotes', () => {
            let result = Parser.parseMetadata(`a='thing 1'  'b thing'=2   'c=3'='p=o',thetitle`);
            expect(result['a']).to.equal('thing 1');
            expect(result['b thing']).to.equal('2');
            expect(result['c=3']).to.equal('p=o');
            expect(result['$title']).to.equal('thetitle');
        });
    });
})