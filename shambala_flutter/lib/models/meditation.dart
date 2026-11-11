class MeditationTrack {
  final int dayIndex;
  final String dayName;
  final String title;
  final String description;
  final int durationSec;
  final String coverUrl;
  final String audioUrl;
  final String mantra;

  MeditationTrack({
    required this.dayIndex,
    required this.dayName,
    required this.title,
    required this.description,
    required this.durationSec,
    required this.coverUrl,
    required this.audioUrl,
    required this.mantra,
  });
}
