import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final isDark = provider.isDarkMode;

    final primaryColor = provider.themePrimary;
    final textColor = provider.themeText;
    final subtitleColor = provider.themeSubtitle;
    final cardBgColor = provider.themeSurfaceBg;

    final filterPills = ['All', 'Mantras', 'Bhajans', 'Slokas', 'Chants'];

    final exploreGrid = [
      {
        'title': 'Devi Chants',
        'count': '128 Songs',
        'cover': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'cat': 'Chants',
      },
      {
        'title': 'Shiva Mantras',
        'count': '96 Songs',
        'cover': 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
        'cat': 'Mantras',
      },
      {
        'title': 'Vishnu Bhajans',
        'count': '86 Songs',
        'cover': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
        'cat': 'Bhajans',
      },
      {
        'title': 'Ganesh Chants',
        'count': '74 Songs',
        'cover': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        'cat': 'Chants',
      },
      {
        'title': 'Meditation Music',
        'count': '120 Songs',
        'cover': 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=800&q=80',
        'cat': 'Ambient',
      },
      {
        'title': 'Healing Frequencies',
        'count': '64 Songs',
        'cover': 'https://images.unsplash.com/photo-1528319725582-ddc09f38b617?auto=format&fit=crop&w=800&q=80',
        'cat': 'Ambient',
      },
      {
        'title': 'Morning Chants',
        'count': '92 Songs',
        'cover': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'cat': 'Chants',
      },
      {
        'title': 'Night Meditation',
        'count': '58 Songs',
        'cover': 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
        'cat': 'Ambient',
      },
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title Header
          Text(
            'Explore',
            style: GoogleFonts.lexendDeca(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: textColor,
            ),
          ),
          const SizedBox(height: 16),

          // Search Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(30),
              border: Border.all(
                color: primaryColor.withValues(alpha: 0.28),
                width: 1.2,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: Row(
              children: [
                Icon(LucideIcons.search, color: subtitleColor, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    onChanged: provider.setSearch,
                    style: GoogleFonts.lexendDeca(color: textColor, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Search divine songs, mantras...',
                      hintStyle: GoogleFonts.lexendDeca(color: subtitleColor, fontSize: 13),
                      border: InputBorder.none,
                    ),
                  ),
                ),
                Icon(LucideIcons.mic, color: subtitleColor, size: 20),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Category Pill Tags
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: filterPills.length,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, idx) {
                final tag = filterPills[idx];
                final isSelected = provider.selectedCategory == tag;
                return GestureDetector(
                  onTap: () => provider.setCategory(tag),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: isSelected
                          ? LinearGradient(
                              colors: [primaryColor, primaryColor.withValues(alpha: 0.85)],
                            )
                          : null,
                      color: isSelected ? null : cardBgColor,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isSelected ? primaryColor : primaryColor.withValues(alpha: 0.25),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: isSelected ? primaryColor.withOpacity(0.4) : Colors.transparent,
                          blurRadius: 10,
                        )
                      ],
                    ),
                    child: Center(
                      child: Text(
                        tag,
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

          // 2-Column Grid of 3D Artwork Tiles
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: exploreGrid.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.1,
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
            ),
            itemBuilder: (context, idx) {
              final item = exploreGrid[idx];
              return GestureDetector(
                onTap: () => provider.setCategory(item['cat'] as String),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.12),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      )
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(22),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.network(
                          item['cover'] as String,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(color: cardBgColor),
                        ),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Colors.black.withOpacity(0.85),
                                Colors.transparent,
                              ],
                              begin: Alignment.bottomCenter,
                              end: Alignment.topCenter,
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item['title'] as String,
                                style: GoogleFonts.lexendDeca(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item['count'] as String,
                                style: GoogleFonts.lexendDeca(
                                  fontSize: 10,
                                  color: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }
}
