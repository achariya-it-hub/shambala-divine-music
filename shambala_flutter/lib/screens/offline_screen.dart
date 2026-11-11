import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';

class OfflineScreen extends StatelessWidget {
  const OfflineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final isDark = provider.isDarkMode;

    final primaryColor = provider.themePrimary;
    final amberColor = provider.themePrimary;
    final textColor = provider.themeText;
    final subtitleColor = provider.themeSubtitle;
    final cardBgColor = provider.themeSurfaceBg;

    final canPop = Navigator.canPop(context);

    Widget content = SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0x3310B981), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: const Color(0x1210B981),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                )
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(LucideIcons.download, color: Color(0xFF10B981), size: 24),
                    ),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Offline Storage',
                          style: GoogleFonts.lexendDeca(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
                        ),
                        Text(
                          '${provider.offlineSongs.length} Tracks Cached Locally',
                          style: GoogleFonts.lexendDeca(fontSize: 12, color: subtitleColor),
                        ),
                      ],
                    ),
                  ],
                ),
                Switch(
                  value: provider.isOfflineMode,
                  activeThumbColor: Colors.white,
                  activeTrackColor: const Color(0xFF10B981),
                  onChanged: (_) => provider.toggleOfflineMode(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Offline Tracks Section Title
          Text(
            'Downloaded Chants & Music',
            style: GoogleFonts.lexendDeca(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
          ),
          const SizedBox(height: 12),

          if (provider.offlineSongs.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: cardBgColor,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0x22F59E0B)),
              ),
              child: Column(
                children: [
                  Icon(LucideIcons.downloadCloud, size: 48, color: subtitleColor),
                  const SizedBox(height: 12),
                  Text(
                    'No Offline Tracks Yet',
                    style: GoogleFonts.lexendDeca(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Tap the download icon on any song to save it for offline playback without internet.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.lexendDeca(fontSize: 12, color: subtitleColor),
                  ),
                ],
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: provider.offlineSongs.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, idx) {
                final song = provider.offlineSongs[idx];
                return Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: cardBgColor,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0x33F59E0B), width: 1.0),
                  ),
                  child: ListTile(
                    leading: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        song.coverUrl,
                        width: 48,
                        height: 48,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          width: 48,
                          height: 48,
                          color: const Color(0xFF10B981).withValues(alpha: 0.2),
                          child: const Center(child: Text('🕉️', style: TextStyle(fontSize: 20))),
                        ),
                      ),
                    ),
                    title: Text(
                      song.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.lexendDeca(fontSize: 13, fontWeight: FontWeight.bold, color: textColor),
                    ),
                    subtitle: Text(
                      '${song.artist} • ${song.duration}',
                      style: GoogleFonts.lexendDeca(color: subtitleColor, fontSize: 11),
                    ),
                    trailing: IconButton(
                      icon: const Icon(LucideIcons.trash2, color: Color(0xFFF43F5E), size: 20),
                      onPressed: () => provider.removeDownloadedSong(song),
                    ),
                    onTap: () => provider.playTrack(song, provider.offlineSongs),
                  ),
                );
              },
            ),
          const SizedBox(height: 100),
        ],
      ),
    );

    if (canPop) {
      return Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: Icon(LucideIcons.arrowLeft, color: textColor),
            onPressed: () => Navigator.of(context).pop(),
          ),
          title: Text(
            'Offline Downloads',
            style: GoogleFonts.lexendDeca(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: textColor,
            ),
          ),
        ),
        body: content,
      );
    }

    return content;
  }
}
