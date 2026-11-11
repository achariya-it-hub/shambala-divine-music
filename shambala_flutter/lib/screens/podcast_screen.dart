import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';
import '../models/song.dart';

class PodcastScreen extends StatelessWidget {
  const PodcastScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final primaryColor = provider.themePrimary;
    final crimsonColor = provider.themeSecondary;
    final textColor = provider.themeText;
    final subtitleColor = provider.themeSubtitle;
    final cardBgColor = provider.themeSurfaceBg;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: primaryColor.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(LucideIcons.podcast, color: primaryColor),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Spiritual Podcasts',
                    style: GoogleFonts.lexendDeca(fontSize: 20, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  Text(
                    'Satsangs & scripture audio talks',
                    style: GoogleFonts.lexendDeca(fontSize: 12, color: subtitleColor),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...provider.podcasts.map((pod) {
            return Container(
              margin: const EdgeInsets.only(bottom: 20),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: cardBgColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: primaryColor.withValues(alpha: 0.25)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          pod.coverUrl,
                          width: 70,
                          height: 70,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            width: 70,
                            height: 70,
                            color: primaryColor.withValues(alpha: 0.2),
                            child: const Center(child: Text('🎙️', style: TextStyle(fontSize: 32))),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              pod.title,
                              style: GoogleFonts.lexendDeca(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                            ),
                            Text(
                              'Host: ${pod.host}',
                              style: GoogleFonts.lexendDeca(fontSize: 12, color: primaryColor, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    pod.description,
                    style: GoogleFonts.lexendDeca(fontSize: 12, color: subtitleColor),
                  ),
                  Divider(color: primaryColor.withValues(alpha: 0.2), height: 24),
                  ...pod.episodes.map((ep) {
                    final songEp = Song(
                      id: ep.id,
                      title: ep.title,
                      artist: pod.host,
                      album: pod.title,
                      category: 'Podcast',
                      duration: ep.duration,
                      durationSec: ep.durationSec,
                      coverUrl: pod.coverUrl,
                      audioUrl: ep.audioUrl,
                      lyrics: 'Podcast: ${pod.title}\nHost: ${pod.host}',
                      plays: '1K',
                    );

                    final isEpPlaying = provider.currentTrack?.id == songEp.id && provider.isPlaying;

                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: crimsonColor,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isEpPlaying ? LucideIcons.pause : LucideIcons.play,
                          color: Colors.white,
                          size: 18,
                        ),
                      ),
                      title: Text(ep.title, style: GoogleFonts.lexendDeca(fontSize: 13, color: textColor, fontWeight: FontWeight.bold)),
                      subtitle: Text('${ep.duration} • ${ep.publishedDate}', style: TextStyle(color: subtitleColor, fontSize: 11)),
                      onTap: () => provider.playTrack(songEp),
                    );
                  }),
                ],
              ),
            );
          }),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}
