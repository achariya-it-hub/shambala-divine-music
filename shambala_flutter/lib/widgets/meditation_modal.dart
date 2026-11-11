import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';

class MeditationModalWidget extends StatelessWidget {
  const MeditationModalWidget({super.key});

  String _formatTime(int totalSeconds) {
    final m = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final s = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final track = provider.activeMeditationTrack;

    if (!provider.isMeditationActive || track == null) {
      return const SizedBox.shrink();
    }

    final primaryColor = provider.themePrimary;
    final secondaryColor = provider.themeSecondary;
    final bgColor = provider.themeScaffoldBg;
    final textColor = provider.themeText;
    final subtitleColor = provider.themeSubtitle;

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Top Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(LucideIcons.sparkles, color: primaryColor, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        'AUTOMATED 12:00 PM MEDITATION',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: primaryColor,
                          letterSpacing: 1.1,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.x, color: textColor),
                    onPressed: provider.stopMeditation,
                  ),
                ],
              ),
              const Spacer(),
              // Day Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: primaryColor.withOpacity(0.4)),
                ),
                child: Text(
                  '${track.dayName} Meditation Session',
                  style: GoogleFonts.lexendDeca(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              // Circular Artwork & Timer
              Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 220,
                    height: 220,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: primaryColor.withOpacity(0.5), width: 3),
                      image: DecorationImage(
                        image: NetworkImage(track.coverUrl),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      decoration: BoxDecoration(
                        color: provider.themeSurfaceBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: primaryColor),
                      ),
                      child: Text(
                        _formatTime(provider.meditationTimeRemaining),
                        style: GoogleFonts.lexendDeca(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: primaryColor,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              // Track Info
              Text(
                track.title,
                textAlign: TextAlign.center,
                style: GoogleFonts.lexendDeca(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                track.description,
                textAlign: TextAlign.center,
                style: GoogleFonts.lexendDeca(
                  fontSize: 13,
                  color: subtitleColor,
                ),
              ),
              const SizedBox(height: 24),
              // Mantra Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: provider.themeSurfaceBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: primaryColor.withOpacity(0.35)),
                ),
                child: Text(
                  track.mantra,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.lexendDeca(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Audio Playback Indicator & Play/Pause Controller
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: () {
                      if (provider.isPlaying) {
                        provider.togglePlay();
                      } else {
                        if (provider.currentTrack?.id.startsWith('meditation-') ?? false) {
                          provider.togglePlay();
                        } else {
                          provider.triggerMeditationSimulation(track.dayIndex);
                        }
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: provider.isPlaying
                              ? [secondaryColor, secondaryColor.withValues(alpha: 0.85)]
                              : [primaryColor, secondaryColor],
                        ),
                        borderRadius: BorderRadius.circular(30),
                        boxShadow: [
                          BoxShadow(
                            color: (provider.isPlaying ? secondaryColor : primaryColor).withOpacity(0.4),
                            blurRadius: 14,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            provider.isPlaying ? LucideIcons.pause : LucideIcons.play,
                            color: Colors.white,
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            provider.isPlaying ? 'Pause Audio' : 'Play Meditation Audio',
                            style: GoogleFonts.lexendDeca(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const Spacer(),
              // Finish Action
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: secondaryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
                onPressed: provider.stopMeditation,
                child: Text(
                  'Complete Meditation Session',
                  style: GoogleFonts.lexendDeca(fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
