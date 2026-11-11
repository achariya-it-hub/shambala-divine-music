import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';
import 'home_screen.dart';
import 'explore_screen.dart';
import 'library_screen.dart';
import 'profile_screen.dart';
import 'meditation_schedule_screen.dart';
import '../widgets/fullscreen_player_modal.dart';
import '../widgets/meditation_modal.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    ExploreScreen(),
    LibraryScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final isDark = provider.isDarkMode;
    final track = provider.currentTrack;

    final primaryColor = provider.themePrimary;
    final amberColor = provider.themePrimary;
    final crimsonColor = provider.themeSecondary;
    final navBgColor = provider.themeSurfaceBg;
    final textColor = provider.themeText;

    return Stack(
      children: [
        Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            title: Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: primaryColor.withOpacity(0.3),
                        blurRadius: 10,
                      )
                    ],
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      'assets/images/logo.png',
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Center(child: Text('🕉️', style: TextStyle(fontSize: 18))),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'HAPPY SHAMBALA',
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.lexendDeca(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: textColor,
                          letterSpacing: 0.5,
                        ),
                      ),
                      Text(
                        'AWAKENING AVADHANIES',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 8,
                          fontWeight: FontWeight.w800,
                          color: amberColor,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            actions: [
              IconButton(
                icon: Icon(LucideIcons.calendar, color: amberColor, size: 20),
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const MeditationScheduleScreen()),
                  );
                },
                tooltip: '12:00 PM Meditation Scheduler',
              ),
              IconButton(
                icon: Icon(
                  isDark ? LucideIcons.sun : LucideIcons.moon,
                  color: amberColor,
                  size: 20,
                ),
                onPressed: provider.toggleTheme,
                tooltip: 'Cycle App Theme (${provider.currentThemeName})',
              ),
              IconButton(
                icon: Icon(LucideIcons.bell, color: textColor.withOpacity(0.8), size: 20),
                onPressed: () {},
              ),
              IconButton(
                icon: Icon(LucideIcons.search, color: textColor.withOpacity(0.8), size: 20),
                onPressed: () {},
              ),
            ],
          ),
          body: IndexedStack(
            index: _currentIndex > 3 ? 0 : _currentIndex,
            children: _screens,
          ),
          bottomNavigationBar: Container(
            decoration: BoxDecoration(
              color: navBgColor,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.06),
                  blurRadius: 20,
                  offset: const Offset(0, -4),
                )
              ],
              border: Border(
                top: BorderSide(
                  color: primaryColor.withValues(alpha: 0.22),
                ),
              ),
            ),
            child: SafeArea(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Mini Player Strip
                  if (track != null) _buildMiniPlayer(context, provider, track, isDark, amberColor, crimsonColor, textColor),

                  // Bottom 5-Tab Navigation Bar with Elevated Center Music Button
                  SizedBox(
                    height: 64,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildNavItem(0, LucideIcons.home, 'Home', amberColor, provider.themeSubtitle),
                        _buildNavItem(1, LucideIcons.compass, 'Explore', amberColor, provider.themeSubtitle),

                        // Center Play Button 🎵
                        GestureDetector(
                          onTap: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (_) => const FullscreenPlayerModal(),
                            );
                          },
                          child: Container(
                            width: 54,
                            height: 54,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [crimsonColor, primaryColor],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: crimsonColor.withOpacity(0.4),
                                  blurRadius: 16,
                                  offset: const Offset(0, 4),
                                )
                              ],
                            ),
                            child: const Icon(
                              LucideIcons.music,
                              color: Colors.white,
                              size: 24,
                            ),
                          ),
                        ),

                        _buildNavItem(2, LucideIcons.library, 'Library', amberColor, provider.themeSubtitle),
                        _buildNavItem(3, LucideIcons.user, 'Profile', amberColor, provider.themeSubtitle),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        // Automated 12:00 PM Meditation Fullscreen Modal Overlay
        if (provider.isMeditationActive) const MeditationModalWidget(),
      ],
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label, Color activeColor, Color inactiveColor) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isSelected ? activeColor : inactiveColor,
            size: 22,
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: GoogleFonts.lexendDeca(
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
              color: isSelected ? activeColor : inactiveColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniPlayer(
    BuildContext context,
    MusicProvider provider,
    dynamic track,
    bool isDark,
    Color activeColor,
    Color crimsonColor,
    Color textColor,
  ) {
    return GestureDetector(
      onTap: () {
        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          backgroundColor: Colors.transparent,
          builder: (_) => const FullscreenPlayerModal(),
        );
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        decoration: BoxDecoration(
          color: provider.themeSurfaceBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: activeColor.withValues(alpha: 0.3),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                track.coverUrl,
                width: 42,
                height: 42,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 42,
                  height: 42,
                  color: activeColor.withValues(alpha: 0.2),
                  child: const Center(child: Text('🕉️', style: TextStyle(fontSize: 20))),
                ),
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
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    track.artist,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.lexendDeca(
                      fontSize: 10,
                      color: provider.themeSubtitle,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              icon: Icon(LucideIcons.skipBack, color: provider.themeSubtitle, size: 18),
              onPressed: provider.handlePrevTrack,
            ),
            GestureDetector(
              onTap: provider.togglePlay,
              child: Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: crimsonColor,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  provider.isPlaying ? LucideIcons.pause : LucideIcons.play,
                  color: Colors.white,
                  size: 18,
                ),
              ),
            ),
            IconButton(
              icon: Icon(LucideIcons.skipForward, color: provider.themeSubtitle, size: 18),
              onPressed: provider.handleNextTrack,
            ),
          ],
        ),
      ),
    );
  }
}
