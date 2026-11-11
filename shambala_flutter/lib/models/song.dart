class Song {
  final String id;
  final String title;
  final String artist;
  final String album;
  final String category;
  final String duration;
  final int durationSec;
  final String coverUrl;
  final String audioUrl;
  final String lyrics;
  final String plays;
  bool isLiked;
  bool isDownloaded;
  String? localAudioPath;

  Song({
    required this.id,
    required this.title,
    required this.artist,
    required this.album,
    required this.category,
    required this.duration,
    required this.durationSec,
    required this.coverUrl,
    required this.audioUrl,
    required this.lyrics,
    required this.plays,
    this.isLiked = false,
    this.isDownloaded = false,
    this.localAudioPath,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'artist': artist,
    'album': album,
    'category': category,
    'duration': duration,
    'durationSec': durationSec,
    'coverUrl': coverUrl,
    'audioUrl': audioUrl,
    'lyrics': lyrics,
    'plays': plays,
    'isLiked': isLiked,
    'isDownloaded': isDownloaded,
    'localAudioPath': localAudioPath,
  };

  factory Song.fromJson(Map<String, dynamic> json) => Song(
    id: json['id'],
    title: json['title'],
    artist: json['artist'],
    album: json['album'],
    category: json['category'],
    duration: json['duration'],
    durationSec: json['durationSec'],
    coverUrl: json['coverUrl'],
    audioUrl: json['audioUrl'],
    lyrics: json['lyrics'],
    plays: json['plays'],
    isLiked: json['isLiked'] ?? false,
    isDownloaded: json['isDownloaded'] ?? false,
    localAudioPath: json['localAudioPath'],
  );
}
