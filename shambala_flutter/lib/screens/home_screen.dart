import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';
import 'podcast_screen.dart';
import 'live_stream_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PageController _pageController = PageController();
  int _activeSlide = 0;
  Timer? _sliderTimer;

  @override
  void initState() {
    super.initState();
    _sliderTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_pageController.hasClients) {
        final nextPage = (_activeSlide + 1) % 4;
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _sliderTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final isDark = provider.isDarkMode;

    final now = DateTime.now();
    final todaysMeditation = provider.meditationSchedule.firstWhere(
      (m) => m.dayIndex == now.weekday,
      orElse: () => provider.meditationSchedule.first,
    );

    final primaryColor = provider.themePrimary;
    final crimsonColor = provider.themeSecondary;
    final textColor = provider.themeText;
    final subtitleColor = provider.themeSubtitle;
    final cardBgColor = provider.themeSurfaceBg;

    final quickPills = [
      {'name': 'All', 'icon': LucideIcons.disc},
      {'name': 'Bhajans', 'icon': LucideIcons.flower2},
      {'name': 'Mantras', 'icon': LucideIcons.sparkles},
      {'name': 'Chants', 'icon': LucideIcons.flame},
      {'name': 'Ambient', 'icon': LucideIcons.sun},
      {'name': 'Podcasts', 'icon': LucideIcons.podcast},
    ];

    final heroSlides = [
      {
        'badge': 'DAILY DIVINE LISTENING',
        'title': 'Divine Music for\na Higher Life',
        'subtitle': 'Mantras • Bhajans • Slokas • Podcasts',
        'cover': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'actionText': provider.isPlaying ? 'Pause Now' : 'Play Now',
        'isPlaying': provider.isPlaying,
        'onTap': () {
          if (provider.currentTrack != null) {
            provider.togglePlay();
          } else {
            provider.playTrack(provider.songs.first, provider.songs);
          }
        },
      },
      {
        'badge': '12:00 PM MEDITATION',
        'title': 'Today: ${todaysMeditation.dayName}',
        'subtitle': '${todaysMeditation.title}\n6-Min Session',
        'cover': todaysMeditation.coverUrl,
        'actionText': 'Start Session',
        'onTap': () => provider.triggerMeditationSimulation(now.weekday),
      },
      {
        'badge': '🔴 LIVE BROADCAST',
        'title': '24/7 Global Satsang',
        'subtitle': 'Tune in live with 1,200+\nseekers worldwide.',
        'cover': provider.liveFeed.coverUrl,
        'actionText': 'Tune In Live',
        'onTap': () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => Scaffold(
            appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0, iconTheme: IconThemeData(color: textColor)),
            backgroundColor: Theme.of(context).scaffoldBackgroundColor,
            body: const LiveStreamScreen(),
          )));
        },
      },
      {
        'badge': '528Hz SOUNDSCAPES',
        'title': 'Chakra Healing',
        'subtitle': 'Harmonize your energy\nwith 432Hz flutes.',
        'cover': 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
        'actionText': 'Explore Chants',
        'onTap': () => provider.setCategory('Ambient'),
      },
    ];

    final popularPlaylists = [
      {
        'title': 'Devi Chants',
        'count': '128 Songs',
        'cover': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
      {
        'title': 'Shiva Mantras',
        'count': '96 Songs',
        'cover': 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
      },
      {
        'title': 'Vishnu Bhajans',
        'count': '86 Songs',
        'cover': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      },
      {
        'title': 'Ganesh Chants',
        'count': '74 Songs',
        'cover': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      },
    ];

    final continueTrack = provider.songs.first;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Interactive Hero Slider Carousel ──
          Column(
            children: [
              SizedBox(
                height: 220,
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (idx) => setState(() => _activeSlide = idx),
                  itemCount: heroSlides.length,
                  itemBuilder: (context, idx) {
                    final slide = heroSlides[idx];
                    return Container(
                      margin: const EdgeInsets.only(right: 4),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(28),
                        boxShadow: [
                          BoxShadow(
                            color: crimsonColor.withOpacity(0.2),
                            blurRadius: 20,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(28),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.network(
                              slide['cover'] as String,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => Container(
                                color: isDark ? const Color(0xFF1E1838) : const Color(0xFFFFF0DF),
                                child: const Center(child: Text('🕉️', style: TextStyle(fontSize: 48))),
                              ),
                            ),
                            Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    isDark ? Colors.black.withOpacity(0.85) : const Color(0xFF1E1B4B).withOpacity(0.75),
                                    isDark ? Colors.black.withOpacity(0.3) : Colors.transparent,
                                  ],
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: primaryColor.withOpacity(0.25),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: primaryColor.withOpacity(0.4)),
                                    ),
                                    child: Text(
                                      slide['badge'] as String,
                                      style: GoogleFonts.lexendDeca(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w800,
                                        color: const Color(0xFFFCD34D),
                                        letterSpacing: 1.1,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    slide['title'] as String,
                                    style: GoogleFonts.lexendDeca(
                                      fontSize: 22,
                                      fontWeight: FontWeight.w900,
                                      color: Colors.white,
                                      height: 1.1,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    slide['subtitle'] as String,
                                    style: GoogleFonts.lexendDeca(
                                      fontSize: 11,
                                      color: Colors.white70,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: crimsonColor,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                                      elevation: 8,
                                      shadowColor: crimsonColor.withOpacity(0.5),
                                    ),
                                    onPressed: slide['onTap'] as VoidCallback,
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon((slide['isPlaying'] == true) ? LucideIcons.pause : LucideIcons.play, size: 14, color: Colors.white),
                                        const SizedBox(width: 6),
                                        Text(
                                          slide['actionText'] as String,
                                          style: GoogleFonts.lexendDeca(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w800,
                                            letterSpacing: 0.5,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 10),

              // Dots Pagination
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  heroSlides.length,
                  (idx) => GestureDetector(
                    onTap: () {
                      _pageController.animateToPage(
                        idx,
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: _activeSlide == idx ? 24 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: _activeSlide == idx
                            ? primaryColor
                            : (isDark ? Colors.white24 : Colors.black12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // ── Quick Category Pills ──
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: quickPills.length,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, idx) {
                final pill = quickPills[idx];
                final isSelected = provider.selectedCategory == pill['name'];
                return GestureDetector(
                  onTap: () {
                    if (pill['name'] == 'Podcasts') {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => Scaffold(
                        appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0, iconTheme: IconThemeData(color: textColor)),
                        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                        body: const PodcastScreen(),
                      )));
                    } else {
                      provider.setCategory(pill['name'] as String);
                    }
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
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
                          color: isSelected
                              ? primaryColor.withOpacity(0.4)
                              : Colors.black.withOpacity(0.04),
                          blurRadius: isSelected ? 12 : 6,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    child: Center(
                      child: Text(
                        pill['name'] as String,
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
              },
            ),
          ),
          const SizedBox(height: 24),

          // ── Continue Listening Section ──
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Continue Listening',
                style: GoogleFonts.lexendDeca(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              Text(
                'See All >',
                style: GoogleFonts.lexendDeca(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: crimsonColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Continue Listening Card
          GestureDetector(
            onTap: () {
              if (provider.currentTrack?.id == continueTrack.id) {
                provider.togglePlay();
              } else {
                provider.playTrack(continueTrack);
              }
            },
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: cardBgColor,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(
                  color: const Color(0x22F59E0B),
                  width: 1.0,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0x0DD97706),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  )
                ],
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: Image.network(
                      continueTrack.coverUrl,
                      width: 58,
                      height: 58,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        width: 58,
                        height: 58,
                        color: isDark ? const Color(0xFF2A244D) : const Color(0xFFFFF0DF),
                        child: const Center(child: Text('🕉️', style: TextStyle(fontSize: 24))),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          continueTrack.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          continueTrack.artist,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 11,
                            color: subtitleColor,
                          ),
                        ),
                        const SizedBox(height: 6),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: 0.45,
                            minHeight: 3,
                            backgroundColor: isDark ? Colors.white12 : Colors.black12,
                            valueColor: AlwaysStoppedAnimation(primaryColor),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Circular Crimson Play Orb
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [crimsonColor, const Color(0xFFBE123C)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: crimsonColor.withOpacity(0.4),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    child: Icon(
                      (provider.currentTrack?.id == continueTrack.id && provider.isPlaying)
                          ? LucideIcons.pause
                          : LucideIcons.play,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 28),

          // ── Popular Collections Grid ──
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Explore Collections',
                style: GoogleFonts.lexendDeca(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              Text(
                'See All >',
                style: GoogleFonts.lexendDeca(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: crimsonColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          SizedBox(
            height: 185,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: popularPlaylists.length,
              separatorBuilder: (_, __) => const SizedBox(width: 14),
              itemBuilder: (context, idx) {
                final pl = popularPlaylists[idx];
                return Container(
                  width: 135,
                  decoration: BoxDecoration(
                    color: cardBgColor,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(
                      color: const Color(0x22F59E0B),
                      width: 1.0,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0x0DD97706),
                        blurRadius: 14,
                        offset: const Offset(0, 6),
                      )
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                        child: Image.network(
                          pl['cover']!,
                          height: 110,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            height: 110,
                            width: double.infinity,
                            color: isDark ? const Color(0xFF2A244D) : const Color(0xFFFFF0DF),
                            child: const Center(child: Text('🕉️', style: TextStyle(fontSize: 32))),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              pl['title']!,
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
                              pl['count']!,
                              style: GoogleFonts.lexendDeca(
                                fontSize: 10,
                                color: subtitleColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }
}
