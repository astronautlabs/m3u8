export const EXAMPLE_1 = `#EXTM3U
 
#EXTINF:123, Sample artist - Sample title
C:\\Documents and Settings\\I\\My Music\\Sample.mp3
 
#EXTINF:321,Example Artist - Example title
C:\\Documents and Settings\\I\\My Music\\Greatest Hits\\Example.ogg`;

export const NEWLINES = `#EXTM3U\n\r\nItem1\nItem2\r\n\r\n\nItem3`;
export const ENCODING = `#EXTM3U\r\n#EXTENC:SomethingElse\r\nItem1\r\nItem2\r\nItem3`;
export const METADATA = `#EXTM3U

#PLAYLIST:PlaylistTitle

NoMetadata.mp3

#EXTINF:321 foo="bar" bar="baz" baz="123",Title
#EXTGRP:TheGroup
#EXTALB:TheAlbum
#EXTART:TheArtist
#EXTGENRE:Jazz
#EXTBYT:999
#EXTIMG:Image.jpg
Metadata.mp3

NoMetadata.mp3
`;