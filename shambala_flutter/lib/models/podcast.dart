class PodcastEpisode {
  final String id;
  final String title;
  final String duration;
  final int durationSec;
  final String publishedDate;
  final String audioUrl;

  PodcastEpisode({
    required this.id,
    required this.title,
    required this.duration,
    required this.durationSec,
    required this.publishedDate,
    required this.audioUrl,
  });
}

class PodcastShow {
  final String id;
  final String title;
  final String host;
  final String coverUrl;
  final String description;
  final List<PodcastEpisode> episodes;

  PodcastShow({
    required this.id,
    required this.title,
    required this.host,
    required this.coverUrl,
    required this.description,
    required this.episodes,
  });
}
