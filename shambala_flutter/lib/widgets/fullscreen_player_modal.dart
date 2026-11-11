import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';
import '../providers/auth_provider.dart';
import 'guest_login_gate_modal.dart';

class FullscreenPlayerModal extends StatelessWidget {
  const FullscreenPlayerModal({super.key});

  String _formatTime(Duration d) {
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: GoogleFonts.lexendDeca(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        backgroundColor: const Color(0xFFE11D48),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _showSleepTimerBottomSheet(BuildContext context, MusicProvider provider, bool isDark) {
    final options = [
      {'label': '15 Minutes', 'mins': 15},
      {'label': '30 Minutes', 'mins': 30},
      {'label': '45 Minutes', 'mins': 45},
      {'label': '60 Minutes', 'mins': 60},
      {'label': 'Turn Off Timer', 'mins': null},
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: isDark ? const Color(0xFF1F112B) : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(LucideIcons.timer, color: Color(0xFFF59E0B), size: 22),
                const SizedBox(width: 10),
                Text(
                  'Sleep Timer',
                  style: GoogleFonts.lexendDeca(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF1E1B4B),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...options.map((opt) {
              final isSelected = provider.sleepTimerMinutes == opt['mins'];
              return ListTile(
                title: Text(
                  opt['label'] as String,
                  style: GoogleFonts.lexendDeca(
                    color: isDark ? Colors.white : const Color(0xFF1E1B4B),
                    fontSize: 14,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  ),
                ),
                trailing: isSelected
                    ? Icon(LucideIcons.check, color: const Color(0xFFE11D48))
                    : null,
                onTap: () {
                  final mins = opt['mins'] as int?;
                  provider.setSleepTimer(mins);
                  Navigator.pop(ctx);
                  _showSnackBar(
                    context,
                    mins != null ? 'Sleep timer set for $mins minutes' : 'Sleep timer turned off',
                  );
                },
              );
            }),
          ],
        ),
      ),
    );
  }

  void _showShareBottomSheet(BuildContext context, dynamic track, bool isDark) {
    final shareUrl = 'https://happyshambala.com/track/${track.id}';

    showModalBottomSheet(
      context: context,
      backgroundColor: isDark ? const Color(0xFF1F112B) : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF2A163B) : const Color(0xFFFFF8F0),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                      track.coverUrl,
                      width: 48,
                      height: 48,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Center(child: Text('🕉️')),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          track.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.lexendDeca(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: isDark ? Colors.white : const Color(0xFF1E1B4B),
                          ),
                        ),
                        Text(
                          track.artist,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 11,
                            color: isDark ? Colors.white54 : const Color(0xFF475569),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildShareOption(
                  icon: LucideIcons.copy,
                  label: 'Copy Link',
                  isDark: isDark,
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: shareUrl));
                    Navigator.pop(ctx);
                    _showSnackBar(context, 'Track link copied to clipboard!');
                  },
                ),
                _buildShareOption(
                  icon: LucideIcons.messageCircle,
                  label: 'WhatsApp',
                  isDark: isDark,
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: 'Listen to "${track.title}" on Happy Shambala: $shareUrl'));
                    Navigator.pop(ctx);
                    _showSnackBar(context, 'Link copied! Open WhatsApp to paste.');
                  },
                ),
                _buildShareOption(
                  icon: LucideIcons.share,
                  label: 'More Apps',
                  isDark: isDark,
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: shareUrl));
                    Navigator.pop(ctx);
                    _showSnackBar(context, 'Track link ready for sharing!');
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShareOption({
    required IconData icon,
    required String label,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isDark ? const Color(0xFF2A163B) : const Color(0xFFFFF8F0),
              border: Border.all(
                color: const Color(0x22F59E0B),
              ),
            ),
            child: Icon(icon, color: const Color(0xFFE11D48), size: 22),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: GoogleFonts.lexendDeca(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white70 : const Color(0xFF1E1B4B),
            ),
          ),
        ],
      ),
    );
  }

  void _showLyricsBottomSheet(BuildContext context, String lyrics, bool isDark) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: isDark ? const Color(0xFF1F112B) : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.4,
        maxChildSize: 0.9,
        expand: false,
        builder: (_, scrollController) => Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Divine Lyrics & Mantras',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFE11D48),
                    ),
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.copy, color: isDark ? Colors.white70 : Colors.black54, size: 18),
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: lyrics));
                      Navigator.pop(ctx);
                      _showSnackBar(context, 'Lyrics copied to clipboard!');
                    },
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Text(
                    lyrics,
                    style: GoogleFonts.lexendDeca(
                      fontSize: 14,
                      color: isDark ? Colors.white70 : const Color(0xFF1E1B4B),
                      height: 1.7,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showMoreOptionsBottomSheet(BuildContext context, MusicProvider provider, dynamic track, bool isDark) {
    showModalBottomSheet(
      context: context,
      backgroundColor: isDark ? const Color(0xFF1F112B) : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(
                LucideIcons.heart,
                color: track.isLiked ? const Color(0xFFE11D48) : (isDark ? Colors.white70 : Colors.black54),
              ),
              title: Text(
                track.isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs',
                style: GoogleFonts.lexendDeca(color: isDark ? Colors.white : const Color(0xFF1E1B4B)),
              ),
              onTap: () {
                provider.toggleLikedSong(track);
                Navigator.pop(ctx);
                _showSnackBar(context, track.isLiked ? 'Added to Liked Songs ❤️' : 'Removed from Liked Songs');
              },
            ),
            ListTile(
              leading: Icon(LucideIcons.fileText, color: isDark ? Colors.white70 : Colors.black54),
              title: Text(
                'View Lyrics & Mantras',
                style: GoogleFonts.lexendDeca(color: isDark ? Colors.white : const Color(0xFF1E1B4B)),
              ),
              onTap: () {
                Navigator.pop(ctx);
                _showLyricsBottomSheet(context, track.lyrics, isDark);
              },
            ),
            ListTile(
              leading: Icon(LucideIcons.share2, color: isDark ? Colors.white70 : Colors.black54),
              title: Text(
                'Share Track',
                style: GoogleFonts.lexendDeca(color: isDark ? Colors.white : const Color(0xFF1E1B4B)),
              ),
              onTap: () {
                Navigator.pop(ctx);
                _showShareBottomSheet(context, track, isDark);
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final isDark = provider.isDarkMode;
    final track = provider.currentTrack;

    if (track == null) return const SizedBox.shrink();

    final auth = Provider.of<AuthProvider>(context);
    final crimsonColor = provider.themeSecondary;
    final amberColor = provider.themePrimary;
    final bgColor = provider.themeScaffoldBg;
    final textColor = provider.themeText;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(LucideIcons.chevronDown, color: textColor),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Now Playing',
          style: GoogleFonts.lexendDeca(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: textColor,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(LucideIcons.moreHorizontal, color: textColor),
            onPressed: () => _showMoreOptionsBottomSheet(context, provider, track, isDark),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            children: [
              const Spacer(),

              // Large Artwork Card
              Container(
                width: 280,
                height: 280,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: crimsonColor.withOpacity(0.25),
                      blurRadius: 30,
                      spreadRadius: 2,
                    )
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(28),
                  child: Image.network(
                    track.coverUrl,
                    width: 280,
                    height: 280,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: isDark ? const Color(0xFF2A244D) : const Color(0xFFFFF0DF),
                      child: const Center(
                        child: Text('🕉️', style: TextStyle(fontSize: 80)),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Title, Artist & Heart Icon Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          track.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          track.artist,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 13,
                            color: isDark ? Colors.white60 : const Color(0xFF475569),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      LucideIcons.heart,
                      color: track.isLiked ? crimsonColor : (isDark ? Colors.white38 : Colors.black26),
                    ),
                    onPressed: () {
                      if (!auth.isLoggedIn) {
                        GuestLoginGateModal.show(
                          context,
                          title: 'Sign In Required for Favorites',
                          message: 'Guest Mode cannot save favorites. Sign in with Gmail or Phone (100% Free) to save your favorite songs and track your devotional streak!',
                        );
                        return;
                      }
                      provider.toggleLikedSong(track);
                      _showSnackBar(
                        context,
                        track.isLiked ? 'Added to Liked Songs ❤️' : 'Removed from Liked Songs',
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Scrubber Progress Bar
              SliderTheme(
                data: SliderThemeData(
                  trackHeight: 4,
                  activeTrackColor: amberColor,
                  inactiveTrackColor: isDark ? Colors.white12 : Colors.black12,
                  thumbColor: amberColor,
                  thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                ),
                child: Slider(
                  min: 0,
                  max: provider.duration.inSeconds.toDouble() > 0
                      ? provider.duration.inSeconds.toDouble()
                      : 100,
                  value: provider.position.inSeconds.toDouble().clamp(
                        0,
                        provider.duration.inSeconds.toDouble() > 0
                            ? provider.duration.inSeconds.toDouble()
                            : 100,
                      ),
                  onChanged: (val) {
                    provider.seek(Duration(seconds: val.toInt()));
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _formatTime(provider.position),
                      style: GoogleFonts.lexendDeca(
                        fontSize: 11,
                        color: isDark ? Colors.white38 : const Color(0xFF475569),
                      ),
                    ),
                    Text(
                      _formatTime(provider.duration),
                      style: GoogleFonts.lexendDeca(
                        fontSize: 11,
                        color: isDark ? Colors.white38 : const Color(0xFF475569),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Playback Controls Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  IconButton(
                    icon: Icon(
                      LucideIcons.shuffle,
                      color: provider.isShuffle ? crimsonColor : (isDark ? Colors.white38 : Colors.black26),
                    ),
                    onPressed: provider.toggleShuffle,
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.skipBack, color: textColor, size: 28),
                    onPressed: provider.handlePrevTrack,
                  ),
                  GestureDetector(
                    onTap: provider.togglePlay,
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: [crimsonColor, const Color(0xFFBE123C)],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: crimsonColor.withOpacity(0.4),
                            blurRadius: 16,
                          )
                        ],
                      ),
                      child: Icon(
                        provider.isPlaying ? LucideIcons.pause : LucideIcons.play,
                        color: Colors.white,
                        size: 26,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.skipForward, color: textColor, size: 28),
                    onPressed: provider.handleNextTrack,
                  ),
                  IconButton(
                    icon: Icon(
                      provider.repeatMode == 'track' ? LucideIcons.repeat1 : LucideIcons.repeat,
                      color: provider.repeatMode != 'off' ? crimsonColor : (isDark ? Colors.white38 : Colors.black26),
                    ),
                    onPressed: provider.toggleRepeatMode,
                  ),
                ],
              ),
              const Spacer(),

              // Bottom 4 Actions Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildBottomActionButton(
                    icon: LucideIcons.fileText,
                    label: 'Lyrics',
                    textColor: textColor,
                    onTap: () => _showLyricsBottomSheet(context, track.lyrics, isDark),
                  ),
                  _buildBottomActionButton(
                    icon: track.isDownloaded ? LucideIcons.check : LucideIcons.download,
                    label: track.isDownloaded ? 'Downloaded' : 'Download',
                    textColor: track.isDownloaded ? crimsonColor : textColor,
                    onTap: () async {
                      if (!auth.isLoggedIn) {
                        GuestLoginGateModal.show(
                          context,
                          title: 'Sign In Required for Downloads',
                          message: 'Offline downloads are reserved for signed-in seekers. Sign in with Gmail or Phone (100% Free) to save songs to local storage!',
                        );
                        return;
                      }
                      if (track.isDownloaded) {
                        await provider.removeDownloadedSong(track);
                        if (context.mounted) {
                          _showSnackBar(context, 'Removed track from offline downloads');
                        }
                      } else {
                        await provider.downloadSong(track);
                        if (context.mounted) {
                          _showSnackBar(context, 'Track downloaded for offline playback! 📥');
                        }
                      }
                    },
                  ),
                  _buildBottomActionButton(
                    icon: LucideIcons.timer,
                    label: provider.sleepTimerMinutes != null
                        ? '${provider.sleepTimerMinutes}m Timer'
                        : 'Sleep Timer',
                    textColor: provider.sleepTimerMinutes != null ? crimsonColor : textColor,
                    onTap: () => _showSleepTimerBottomSheet(context, provider, isDark),
                  ),
                  _buildBottomActionButton(
                    icon: LucideIcons.share2,
                    label: 'Share',
                    textColor: textColor,
                    onTap: () => _showShareBottomSheet(context, track, isDark),
                  ),
                ],
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomActionButton({
    required IconData icon,
    required String label,
    required Color textColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: textColor.withOpacity(0.85), size: 20),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.lexendDeca(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: textColor.withOpacity(0.85),
            ),
          ),
        ],
      ),
    );
  }
}
