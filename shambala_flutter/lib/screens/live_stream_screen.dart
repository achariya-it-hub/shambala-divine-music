import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';

class LiveStreamScreen extends StatefulWidget {
  const LiveStreamScreen({super.key});

  @override
  State<LiveStreamScreen> createState() => _LiveStreamScreenState();
}

class _LiveStreamScreenState extends State<LiveStreamScreen> {
  String _activeTab = 'chat'; // 'chat' | 'schedule'
  String _streamMode = 'video'; // 'video' | 'audio'
  int _selectedEventIdx = 0;
  int _offeringsCount = 108;
  final TextEditingController _chatController = TextEditingController();

  final List<Map<String, String>> _videoEvents = [
    {
      'title': 'Live Maha Aarti & Divine Darshan',
      'subtitle': 'Shambala Main Sanctuary • HD 1080p Live Video',
      'tag': '🔴 LIVE NOW',
      'viewers': '1.4K watching',
      'cover': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    },
    {
      'title': 'Vedic Homa & Rudra Abhishekam',
      'subtitle': 'Sacred Fire Ritual & 108 Mantras • Multi-Cam',
      'tag': '🔥 SACRED RITUAL',
      'viewers': '890 watching',
      'cover': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    },
    {
      'title': 'Evening Satsang with Gurudev',
      'subtitle': 'Guided Dhyana & Bhajan Kirtan • Live Hall',
      'tag': '🕉️ SATSANG',
      'viewers': '1.1K watching',
      'cover': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    },
  ];

  @override
  void dispose() {
    _chatController.dispose();
    super.dispose();
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

    final scheduleEvents = [
      {'time': '10:00 AM', 'title': 'Morning Vedic Chants & Prayers'},
      {'time': '12:00 PM', 'title': 'Sharp 6-Min Global Noon Meditation'},
      {'time': '04:00 PM', 'title': 'Solfeggio Sound Healing Session'},
      {'time': '07:00 PM', 'title': 'Evening Satsang & Bhajan Kirtan'},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header (Reference Image 1 Screen 1)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: crimsonColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(LucideIcons.radio, color: crimsonColor, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '24/7 Live Satsang',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: crimsonColor,
                        ),
                      ),
                      Text(
                        'Always On Divine Vibration',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 10,
                          color: crimsonColor.withOpacity(0.8),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: cardBgColor,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: primaryColor.withValues(alpha: 0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    GestureDetector(
                      onTap: () => setState(() => _streamMode = 'video'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: _streamMode == 'video' ? crimsonColor : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: [
                            Icon(LucideIcons.video, size: 12, color: _streamMode == 'video' ? Colors.white : subtitleColor),
                            const SizedBox(width: 4),
                            Text(
                              'Video',
                              style: GoogleFonts.lexendDeca(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: _streamMode == 'video' ? Colors.white : subtitleColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => _streamMode = 'audio'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: _streamMode == 'audio' ? primaryColor : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: [
                            Icon(LucideIcons.headphones, size: 12, color: _streamMode == 'audio' ? const Color(0xFF1E1B4B) : subtitleColor),
                            const SizedBox(width: 4),
                            Text(
                              'Audio',
                              style: GoogleFonts.lexendDeca(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: _streamMode == 'audio' ? const Color(0xFF1E1B4B) : subtitleColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Horizontal Spiritual Event Channel Selector
          SizedBox(
            height: 68,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _videoEvents.length,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, idx) {
                final evt = _videoEvents[idx];
                final isSelected = idx == _selectedEventIdx;
                return GestureDetector(
                  onTap: () => setState(() => _selectedEventIdx = idx),
                  child: Container(
                    width: 215,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: cardBgColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? crimsonColor : primaryColor.withValues(alpha: 0.25),
                        width: isSelected ? 1.8 : 1.0,
                      ),
                    ),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.network(
                            evt['cover']!,
                            width: 48,
                            height: 48,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(width: 48, height: 48, color: crimsonColor.withValues(alpha: 0.2)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                evt['tag']!,
                                style: GoogleFonts.lexendDeca(fontSize: 8, fontWeight: FontWeight.w900, color: crimsonColor),
                              ),
                              Text(
                                evt['title']!,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.lexendDeca(fontSize: 11, fontWeight: FontWeight.bold, color: textColor),
                              ),
                              Text(
                                evt['viewers']!,
                                style: GoogleFonts.lexendDeca(fontSize: 9, color: subtitleColor),
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
          const SizedBox(height: 14),

          // Live Stream Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0x22F59E0B), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(18),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.network(
                          provider.liveFeed.coverUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(color: cardBgColor),
                        ),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                              begin: Alignment.bottomCenter,
                              end: Alignment.topCenter,
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(12),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: crimsonColor,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(LucideIcons.radio, color: Colors.white, size: 12),
                                    const SizedBox(width: 4),
                                    Text(
                                      'LIVE',
                                      style: GoogleFonts.lexendDeca(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.black54,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(LucideIcons.users, color: Color(0xFFFACC15), size: 12),
                                    const SizedBox(width: 4),
                                    Text(
                                      '1.2K',
                                      style: GoogleFonts.lexendDeca(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: const Color(0xFFFACC15),
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
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _videoEvents[_selectedEventIdx]['title']!,
                            style: GoogleFonts.lexendDeca(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                          Text(
                            '${_videoEvents[_selectedEventIdx]['subtitle']!} • $_offeringsCount Offerings',
                            style: GoogleFonts.lexendDeca(
                              fontSize: 11,
                              color: subtitleColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        setState(() => _offeringsCount++);
                        provider.addChatMessage('🪔 Offered Sacred Diya Lamp during Live Darshan');
                      },
                      icon: const Text('🪔', style: TextStyle(fontSize: 14)),
                      label: Text('Aarti', style: GoogleFonts.lexendDeca(fontSize: 11, fontWeight: FontWeight.bold, color: primaryColor)),
                    ),
                    IconButton(
                      icon: const Icon(LucideIcons.heart, color: Color(0xFFE11D48), size: 20),
                      onPressed: () {
                        setState(() => _offeringsCount++);
                        provider.addChatMessage('🌸 Offered Lotus Flowers to the Sanctuary');
                      },
                    ),
                    IconButton(
                      icon: Icon(LucideIcons.share2, color: subtitleColor, size: 20),
                      onPressed: () {},
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Sub-Tabs: Chat vs Schedule
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _activeTab = 'chat'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      gradient: _activeTab == 'chat'
                          ? const LinearGradient(
                              colors: [Color(0xFFFDE047), Color(0xFFFACC15), Color(0xFFF59E0B)],
                            )
                          : null,
                      color: _activeTab == 'chat' ? null : crimsonColor.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Center(
                      child: Text(
                        'Chat',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: _activeTab == 'chat' ? const Color(0xFF1E1B4B) : crimsonColor,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _activeTab = 'schedule'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      gradient: _activeTab == 'schedule'
                          ? const LinearGradient(
                              colors: [Color(0xFFFDE047), Color(0xFFFACC15), Color(0xFFF59E0B)],
                            )
                          : null,
                      color: _activeTab == 'schedule' ? null : crimsonColor.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Center(
                      child: Text(
                        'Schedule',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: _activeTab == 'schedule' ? const Color(0xFF1E1B4B) : crimsonColor,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Chat Feed / Schedule View
          if (_activeTab == 'chat')
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: cardBgColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0x22F59E0B), width: 1.2),
              ),
              child: Column(
                children: [
                  SizedBox(
                    height: 220,
                    child: ListView.builder(
                      itemCount: provider.liveFeed.chatMessages.length,
                      itemBuilder: (context, idx) {
                        final msg = provider.liveFeed.chatMessages[idx];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 14,
                                backgroundColor: primaryColor.withOpacity(0.2),
                                child: Text(
                                  msg.user[0],
                                  style: GoogleFonts.lexendDeca(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: const Color(0xFFD97706),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          msg.user,
                                          style: GoogleFonts.lexendDeca(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: textColor,
                                          ),
                                        ),
                                        Text(
                                          msg.time,
                                          style: GoogleFonts.lexendDeca(
                                            fontSize: 9,
                                            color: subtitleColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Text(
                                      msg.text,
                                      style: GoogleFonts.lexendDeca(
                                        fontSize: 11,
                                        color: textColor.withOpacity(0.9),
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

                  // Chat Input Form
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _chatController,
                          style: GoogleFonts.lexendDeca(color: textColor, fontSize: 12),
                          decoration: InputDecoration(
                            hintText: 'Type a message...',
                            hintStyle: GoogleFonts.lexendDeca(color: subtitleColor, fontSize: 12),
                            filled: true,
                            fillColor: isDark ? const Color(0xFF1E152A) : const Color(0xFFFFF8F0),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(24),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      GestureDetector(
                        onTap: () {
                          if (_chatController.text.trim().isNotEmpty) {
                            provider.addChatMessage(_chatController.text.trim());
                            _chatController.clear();
                          }
                        },
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: const BoxDecoration(
                            color: Color(0xFFE11D48),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(LucideIcons.send, color: Colors.white, size: 18),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            )
          else
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: cardBgColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0x22F59E0B), width: 1.2),
              ),
              child: Column(
                children: scheduleEvents.map((evt) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          evt['time']!,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFFD97706),
                          ),
                        ),
                        Text(
                          evt['title']!,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 12,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }
}
