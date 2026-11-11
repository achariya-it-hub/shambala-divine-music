import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';
import '../models/song.dart';

class AdminScreen extends StatefulWidget {
  const AdminScreen({super.key});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  final _songTitleController = TextEditingController();
  final _artistController = TextEditingController();
  final _coverUrlController = TextEditingController();
  final _audioUrlController = TextEditingController();
  final _lyricsController = TextEditingController();
  String _selectedCategory = 'Mantras';

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MusicProvider>(context);
    final primaryColor = provider.themePrimary;
    final secondaryColor = provider.themeSecondary;
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
                child: Icon(LucideIcons.shieldCheck, color: primaryColor),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Admin Studio', style: GoogleFonts.lexendDeca(fontSize: 20, fontWeight: FontWeight.bold, color: textColor)),
                  Text('Publish songs, podcasts & manage live stream', style: GoogleFonts.lexendDeca(fontSize: 12, color: subtitleColor)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Upload Song Section
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: primaryColor.withValues(alpha: 0.25)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Publish New Divine Song', style: GoogleFonts.lexendDeca(fontSize: 16, fontWeight: FontWeight.bold, color: primaryColor)),
                const SizedBox(height: 16),
                _buildTextField(_songTitleController, 'Song Title *', textColor, subtitleColor, primaryColor),
                const SizedBox(height: 10),
                _buildTextField(_artistController, 'Artist / Choir Name', textColor, subtitleColor, primaryColor),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  initialValue: _selectedCategory,
                  dropdownColor: cardBgColor,
                  style: TextStyle(color: textColor),
                  decoration: _inputDecoration('Category', subtitleColor, primaryColor),
                  items: ['Mantras', 'Bhajans', 'Ambient', 'Chants', 'Instrumental']
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedCategory = val);
                  },
                ),
                const SizedBox(height: 10),
                _buildTextField(_coverUrlController, 'Cover Image URL', textColor, subtitleColor, primaryColor),
                const SizedBox(height: 10),
                _buildTextField(_audioUrlController, 'Audio Stream URL (MP3/WAV)', textColor, subtitleColor, primaryColor),
                const SizedBox(height: 10),
                _buildTextField(_lyricsController, 'Sanskrit Lyrics & Translation', textColor, subtitleColor, primaryColor, maxLines: 3),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: secondaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: () {
                      if (_songTitleController.text.trim().isNotEmpty) {
                        provider.addNewSong(
                          Song(
                            id: 'song-${DateTime.now().millisecondsSinceEpoch}',
                            title: _songTitleController.text.trim(),
                            artist: _artistController.text.trim().isEmpty ? 'Shambala Choir' : _artistController.text.trim(),
                            album: 'Divine Single',
                            category: _selectedCategory,
                            duration: '05:00',
                            durationSec: 300,
                            coverUrl: _coverUrlController.text.trim().isEmpty
                                ? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
                                : _coverUrlController.text.trim(),
                            audioUrl: _audioUrlController.text.trim().isEmpty
                                ? 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3'
                                : _audioUrlController.text.trim(),
                            lyrics: _lyricsController.text.trim(),
                            plays: '1',
                          ),
                        );
                        _songTitleController.clear();
                        _artistController.clear();
                        _coverUrlController.clear();
                        _audioUrlController.clear();
                        _lyricsController.clear();
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('🎉 New Divine Song Published!')));
                      }
                    },
                    icon: const Icon(LucideIcons.plus),
                    label: Text('Publish Song', style: GoogleFonts.lexendDeca(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          // Live Broadcast Switcher
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: primaryColor.withValues(alpha: 0.25)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('24/7 Live Broadcast', style: GoogleFonts.lexendDeca(fontSize: 16, fontWeight: FontWeight.bold, color: textColor)),
                    Text(provider.liveFeed.isLive ? '🔴 LIVE BROADCASTING' : '⚪ OFFLINE', style: TextStyle(color: subtitleColor, fontSize: 12)),
                  ],
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: provider.liveFeed.isLive ? const Color(0xFFF43F5E) : const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                  ),
                  onPressed: provider.toggleLiveStatus,
                  child: Text(provider.liveFeed.isLive ? 'Stop Live' : 'Go Live', style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint, Color textColor, Color subtitleColor, Color primaryColor, {int maxLines = 1}) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      style: TextStyle(color: textColor),
      decoration: _inputDecoration(hint, subtitleColor, primaryColor),
    );
  }

  InputDecoration _inputDecoration(String hint, Color subtitleColor, Color primaryColor) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: subtitleColor, fontSize: 13),
      filled: true,
      fillColor: primaryColor.withValues(alpha: 0.08),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: primaryColor.withValues(alpha: 0.25))),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: primaryColor.withValues(alpha: 0.25))),
    );
  }
}
