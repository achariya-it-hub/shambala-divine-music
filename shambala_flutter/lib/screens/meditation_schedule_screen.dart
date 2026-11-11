import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';

class MeditationScheduleScreen extends StatelessWidget {
  const MeditationScheduleScreen({super.key});

  String _getTimeUntilNoonStr() {
    final now = DateTime.now();
    DateTime todayNoon = DateTime(now.year, now.month, now.day, 12, 0, 0);
    if (now.isAfter(todayNoon.add(const Duration(minutes: 6)))) {
      todayNoon = todayNoon.add(const Duration(days: 1));
    }
    final diff = todayNoon.difference(now);
    if (diff.isNegative) {
      return 'Session Live Now! 🕉️';
    }
    final hours = diff.inHours;
    final mins = diff.inMinutes.remainder(60);
    final secs = diff.inSeconds.remainder(60);
    return '${hours.toString().padLeft(2, '0')}:${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final isDark = provider.isDarkMode;

    final primaryColor = provider.themePrimary;
    final amberColor = provider.themePrimary;
    final crimsonColor = provider.themeSecondary;
    final textColor = provider.themeText;
    final subtitleColor = provider.themeSubtitle;
    final cardBgColor = provider.themeSurfaceBg;

    final currentWeekday = DateTime.now().weekday; // 1 = Monday, 7 = Sunday

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
          '12:00 PM Meditation Scheduler',
          style: GoogleFonts.lexendDeca(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: textColor,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Top Countdown & Status Card ──
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2E0927), Color(0xFF12081B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(26),
                border: Border.all(color: const Color(0x66F59E0B), width: 1.5),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x33E11D48),
                    blurRadius: 20,
                    offset: Offset(0, 6),
                  )
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: crimsonColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: crimsonColor.withOpacity(0.4)),
                        ),
                        child: Row(
                          children: [
                            const Icon(LucideIcons.sparkles, color: Color(0xFFFACC15), size: 14),
                            const SizedBox(width: 6),
                            Text(
                              'GLOBAL NOON MEDITATION',
                              style: GoogleFonts.lexendDeca(
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                                color: const Color(0xFFFACC15),
                                letterSpacing: 0.8,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Auto-Schedule Switch
                      Row(
                        children: [
                          Text(
                            'Daily Alarm',
                            style: GoogleFonts.lexendDeca(
                              fontSize: 11,
                              color: Colors.white70,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Switch(
                            value: provider.isDailyMeditationScheduled,
                            activeThumbColor: Colors.white,
                            activeTrackColor: amberColor,
                            onChanged: (_) => provider.toggleDailyMeditationSchedule(),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Countdown Timer
                  Text(
                    'NEXT GLOBAL SESSION IN',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: Colors.white60,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _getTimeUntilNoonStr(),
                    style: GoogleFonts.lexendDeca(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: primaryColor,
                      letterSpacing: 2,
                      shadows: [
                        BoxShadow(
                          color: amberColor.withOpacity(0.5),
                          blurRadius: 14,
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Info Note
                  Text(
                    'Every day at 12:00 PM sharp, thousands of seekers join for a synchronized 6-minute divine sound meditation.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.lexendDeca(
                      fontSize: 12,
                      color: Colors.white70,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // ── Section Title: Weekly 7-Day Meditation Schedule ──
            Row(
              children: [
                Icon(LucideIcons.calendar, color: amberColor, size: 20),
                const SizedBox(width: 8),
                Text(
                  '7-Day Weekly Meditation Schedule',
                  style: GoogleFonts.lexendDeca(
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    color: textColor,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // ── 7 Days List ──
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: provider.meditationSchedule.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (ctx, idx) {
                final track = provider.meditationSchedule[idx];
                final isToday = track.dayIndex == currentWeekday;

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: cardBgColor,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(
                      color: isToday ? amberColor : const Color(0x22F59E0B),
                      width: isToday ? 2 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isToday ? amberColor.withOpacity(0.15) : Colors.transparent,
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      )
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Cover Thumbnail
                          ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.network(
                              track.coverUrl,
                              width: 60,
                              height: 60,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(
                                width: 60,
                                height: 60,
                                color: isDark ? const Color(0xFF4A0A20) : const Color(0xFFFFF0DF),
                                child: const Center(child: Text('🕉️', style: TextStyle(fontSize: 24))),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),

                          // Details
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: isToday ? crimsonColor : amberColor.withOpacity(0.15),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        track.dayName.toUpperCase() + (isToday ? ' • TODAY' : ''),
                                        style: GoogleFonts.lexendDeca(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                          color: isToday ? Colors.white : (isDark ? primaryColor : const Color(0xFFD97706)),
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    Text(
                                      '12:00 PM • 6 mins',
                                      style: GoogleFonts.lexendDeca(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: subtitleColor,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  track.title,
                                  style: GoogleFonts.lexendDeca(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w800,
                                    color: textColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),

                      // Mantra Pill
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0x22FFFFFF) : const Color(0xFFFFF8F0),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0x15F59E0B)),
                        ),
                        child: Text(
                          'Mantra: ${track.mantra}',
                          style: GoogleFonts.lexendDeca(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: isDark ? const Color(0xFFFCD34D) : const Color(0xFFB45309),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Play Session Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isToday ? crimsonColor : const Color(0xFF1E1B4B),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            elevation: 0,
                          ),
                          icon: const Icon(LucideIcons.play, size: 16),
                          label: Text(
                            isToday ? 'Start Today\'s 12:00 PM Session' : 'Play ${track.dayName} Meditation',
                            style: GoogleFonts.lexendDeca(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          onPressed: () {
                            provider.triggerMeditationSimulation(track.dayIndex);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Started ${track.dayName} 12:00 PM Meditation Session', style: GoogleFonts.lexendDeca(color: Colors.white)),
                                backgroundColor: crimsonColor,
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 36),
          ],
        ),
      ),
    );
  }
}
