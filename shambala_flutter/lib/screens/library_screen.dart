import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';
import '../models/song.dart';

class LibraryScreen extends StatefulWidget {
  final String initialTab;
  const LibraryScreen({super.key, this.initialTab = 'Songs'});

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  late String _selectedTab;

  @override
  void initState() {
    super.initState();
    _selectedTab = widget.initialTab;
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final isDark = provider.isDarkMode;

    final primaryColor = provider.themePrimary;
    final crimsonColor = provider.themeSecondary;
    final textColor = provider.themeText;
    final subtitleColor = provider.themeSubtitle;
    final cardBgColor = provider.themeSurfaceBg;

    final tabs = ['Songs', 'Playlists', 'Favorites', 'History'];
    final canPop = Navigator.canPop(context);

    // Filter displayed songs based on selected tab
    List<Song> displayedSongs = provider.songs;
    if (_selectedTab == 'Favorites') {
      displayedSongs = provider.songs.where((s) => s.isLiked).toList();
    } else if (_selectedTab == 'History') {
      displayedSongs = provider.songs.take(5).toList(); // Recent play queue
    }

    Widget content = SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _selectedTab == 'Favorites'
                    ? 'My Favorites'
                    : (_selectedTab == 'Playlists'
                        ? 'Devotional Playlists'
                        : (_selectedTab == 'History' ? 'Listening History' : 'My Library')),
                style: GoogleFonts.lexendDeca(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: textColor,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: primaryColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: primaryColor.withValues(alpha: 0.3)),
                ),
                child: Text(
                  '${displayedSongs.length} Tracks',
                  style: GoogleFonts.lexendDeca(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: isDark ? primaryColor : const Color(0xFFD97706),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Tabs: Songs, Playlists, Favorites, History
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: tabs.map((tab) {
                final isSelected = _selectedTab == tab;
                return Padding(
                  padding: const EdgeInsets.only(right: 10),
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedTab = tab),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      decoration: BoxDecoration(
                        gradient: isSelected
                            ? LinearGradient(
                                colors: [primaryColor, primaryColor.withValues(alpha: 0.85)],
                              )
                            : null,
                        color: isSelected ? null : cardBgColor,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: isSelected ? primaryColor : primaryColor.withValues(alpha: 0.25),
                          width: 1.2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isSelected ? primaryColor.withValues(alpha: 0.4) : Colors.black.withValues(alpha: 0.04),
                            blurRadius: isSelected ? 12 : 6,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: Text(
                        tab,
                        style: GoogleFonts.lexendDeca(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: isSelected
                              ? (provider.currentThemeId == 'lotus' ? Colors.white : const Color(0xFF1E1B4B))
                              : subtitleColor,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 24),

          // Render Playlists Grid if Playlists tab is selected
          if (_selectedTab == 'Playlists') ...[
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              childAspectRatio: 0.85,
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
              children: [
                _buildPlaylistCard(
                  title: 'Morning Chants',
                  subtitle: '12 Divine Mantras',
                  coverUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=400&q=80',
                  color: const Color(0xFFF59E0B),
                  textColor: textColor,
                  subtitleColor: subtitleColor,
                  onTap: () => provider.playTrack(provider.songs.first),
                ),
                _buildPlaylistCard(
                  title: 'Shiv Tandav & Stotrams',
                  subtitle: '8 Powerful Hymns',
                  coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80',
                  color: const Color(0xFF9333EA),
                  textColor: textColor,
                  subtitleColor: subtitleColor,
                  onTap: () => provider.playTrack(provider.songs[1]),
                ),
                _buildPlaylistCard(
                  title: 'Night Meditation Soundscapes',
                  subtitle: 'Deep Alpha Frequency',
                  coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
                  color: const Color(0xFF2563EB),
                  textColor: textColor,
                  subtitleColor: subtitleColor,
                  onTap: () => provider.playTrack(provider.songs[2]),
                ),
                _buildPlaylistCard(
                  title: 'Krishna Flute Bliss',
                  subtitle: 'Peaceful Vrindavan Melodies',
                  coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
                  color: const Color(0xFF10B981),
                  textColor: textColor,
                  subtitleColor: subtitleColor,
                  onTap: () => provider.playTrack(provider.songs[3]),
                ),
              ],
            ),
          ] else if (displayedSongs.isEmpty) ...[
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: cardBgColor,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: primaryColor.withValues(alpha: 0.25)),
              ),
              child: Column(
                children: [
                  Icon(LucideIcons.heartOff, size: 48, color: subtitleColor),
                  const SizedBox(height: 12),
                  Text(
                    'No Songs Found',
                    style: GoogleFonts.lexendDeca(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _selectedTab == 'Favorites'
                        ? 'Tap the heart icon on any song to add it to your Favorites!'
                        : 'Explore tracks to build your listening history.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.lexendDeca(fontSize: 12, color: subtitleColor),
                  ),
                ],
              ),
            ),
          ] else ...[
            // Track List Items
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: displayedSongs.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, idx) {
                final song = displayedSongs[idx];
                final isCurrent = provider.currentTrack?.id == song.id;
                return GestureDetector(
                  onTap: () => provider.playTrack(song, displayedSongs),
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: isCurrent
                          ? crimsonColor.withValues(alpha: isDark ? 0.18 : 0.10)
                          : cardBgColor,
                      borderRadius: BorderRadius.circular(18),
                      border: Border(
                        left: BorderSide(
                          color: isCurrent ? crimsonColor : Colors.transparent,
                          width: isCurrent ? 4.0 : 0.0,
                        ),
                        top: BorderSide(color: primaryColor.withValues(alpha: 0.22), width: 1.0),
                        right: BorderSide(color: primaryColor.withValues(alpha: 0.22), width: 1.0),
                        bottom: BorderSide(color: primaryColor.withValues(alpha: 0.22), width: 1.0),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            song.coverUrl,
                            width: 52,
                            height: 52,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(
                              width: 52,
                              height: 52,
                              color: isDark ? const Color(0xFF4A0A20) : const Color(0xFFFFF0DF),
                              child: const Center(child: Text('🕉️', style: TextStyle(fontSize: 22))),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                song.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.lexendDeca(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: isCurrent ? crimsonColor : textColor,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${song.category} • ${song.duration}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.lexendDeca(
                                  fontSize: 11,
                                  color: subtitleColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: Icon(
                            song.isLiked ? LucideIcons.heart : LucideIcons.heart,
                            color: song.isLiked ? crimsonColor : subtitleColor,
                            size: 20,
                          ),
                          onPressed: () => provider.toggleLikedSong(song),
                        ),
                        IconButton(
                          icon: Icon(
                            LucideIcons.moreVertical,
                            color: subtitleColor,
                            size: 18,
                          ),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
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
            'Library & Collections',
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

  Widget _buildPlaylistCard({
    required String title,
    required String subtitle,
    required String coverUrl,
    required Color color,
    required Color textColor,
    required Color subtitleColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withValues(alpha: 0.3), width: 1.2),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.network(
                  coverUrl,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: color.withValues(alpha: 0.3),
                    child: const Center(child: Text('🕉️', style: TextStyle(fontSize: 32))),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.lexendDeca(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.lexendDeca(
                fontSize: 10,
                color: subtitleColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
