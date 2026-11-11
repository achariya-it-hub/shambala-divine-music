import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

import '../providers/music_provider.dart';
import '../providers/auth_provider.dart';
import 'auth_screen.dart';
import 'meditation_schedule_screen.dart';
import 'offline_screen.dart';
import 'library_screen.dart';
import 'admin_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _notificationsEnabled = true;
  String _selectedAudioQuality = 'High (320 kbps)';
  String _selectedSignInMethod = 'google';

  void _showEditProfileModal(BuildContext context, AuthProvider authProvider) {
    final nameController = TextEditingController(text: authProvider.user.name);
    final deityController = TextEditingController(text: authProvider.user.topDeity);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF261F4C), Color(0xFF181335)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            border: Border.all(color: const Color(0x66F59E0B), width: 1.5),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Edit Profile Details',
                style: GoogleFonts.lexendDeca(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFFFCD34D),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: nameController,
                style: GoogleFonts.lexendDeca(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Devotional Name',
                  labelStyle: GoogleFonts.lexendDeca(color: Colors.white70),
                  filled: true,
                  fillColor: const Color(0x15FFFFFF),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: deityController,
                style: GoogleFonts.lexendDeca(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Top Favorite Deity / Chant Focus',
                  labelStyle: GoogleFonts.lexendDeca(color: Colors.white70),
                  filled: true,
                  fillColor: const Color(0x15FFFFFF),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE11D48),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                onPressed: () async {
                  await authProvider.updateProfile(
                    name: nameController.text.trim(),
                    topDeity: deityController.text.trim(),
                  );
                  if (ctx.mounted) Navigator.of(ctx).pop();
                },
                child: Text('Save Profile Changes', style: GoogleFonts.lexendDeca(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showSleepTimerModal(BuildContext context, MusicProvider musicProvider) {
    final options = [15, 30, 45, 60, null];
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF181335),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          border: Border.all(color: const Color(0x66F59E0B)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Set Sleep Timer', style: GoogleFonts.lexendDeca(fontSize: 18, fontWeight: FontWeight.w900, color: const Color(0xFFFCD34D))),
            const SizedBox(height: 14),
            ...options.map((mins) {
              final isSelected = musicProvider.sleepTimerMinutes == mins;
              return ListTile(
                leading: Icon(mins == null ? LucideIcons.bellOff : LucideIcons.clock, color: isSelected ? const Color(0xFFF59E0B) : Colors.white70),
                title: Text(
                  mins == null ? 'Turn Off Sleep Timer' : '$mins Minutes',
                  style: GoogleFonts.lexendDeca(color: isSelected ? const Color(0xFFFCD34D) : Colors.white, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal),
                ),
                trailing: isSelected ? const Icon(LucideIcons.check, color: Color(0xFFF59E0B)) : null,
                onTap: () {
                  if (mins == null) {
                    musicProvider.cancelSleepTimer();
                  } else {
                    musicProvider.setSleepTimer(mins);
                  }
                  Navigator.of(ctx).pop();
                },
              );
            }),
          ],
        ),
      ),
    );
  }

  void _showAudioQualityModal(BuildContext context) {
    final qualities = ['High (320 kbps)', 'Standard (192 kbps)', 'Data Saver (128 kbps)'];
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF181335),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          border: Border.all(color: const Color(0x66F59E0B)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Audio Quality Settings', style: GoogleFonts.lexendDeca(fontSize: 18, fontWeight: FontWeight.w900, color: const Color(0xFFFCD34D))),
            const SizedBox(height: 14),
            ...qualities.map((q) {
              final isSelected = _selectedAudioQuality == q;
              return ListTile(
                leading: Icon(LucideIcons.volume2, color: isSelected ? const Color(0xFFF59E0B) : Colors.white70),
                title: Text(q, style: GoogleFonts.lexendDeca(color: isSelected ? const Color(0xFFFCD34D) : Colors.white, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                trailing: isSelected ? const Icon(LucideIcons.check, color: Color(0xFFF59E0B)) : null,
                onTap: () {
                  setState(() => _selectedAudioQuality = q);
                  Navigator.of(ctx).pop();
                },
              );
            }),
          ],
        ),
      ),
    );
  }

  void _showThemePickerModal(BuildContext context, MusicProvider musicProvider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF181335),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          border: Border.all(color: const Color(0x66F59E0B)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Choose App Theme Color Scheme',
              style: GoogleFonts.lexendDeca(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: const Color(0xFFFCD34D),
              ),
            ),
            const SizedBox(height: 14),
            ...musicProvider.appThemes.map((t) {
              final isSelected = musicProvider.currentThemeId == t['id'];
              final bgCol = t['scaffoldBg'] as Color;
              final primCol = t['primary'] as Color;
              final secCol = t['secondary'] as Color;
              return ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                leading: Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: bgCol,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: primCol, width: 1.5),
                  ),
                  child: Center(
                    child: Text(t['emoji'] as String, style: const TextStyle(fontSize: 16)),
                  ),
                ),
                title: Text(
                  t['name'] as String,
                  style: GoogleFonts.lexendDeca(
                    color: isSelected ? const Color(0xFFFCD34D) : Colors.white,
                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                subtitle: Text(
                  t['subtitle'] as String,
                  style: GoogleFonts.lexendDeca(color: Colors.white60, fontSize: 11),
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(width: 12, height: 12, decoration: BoxDecoration(color: primCol, shape: BoxShape.circle)),
                    const SizedBox(width: 4),
                    Container(width: 12, height: 12, decoration: BoxDecoration(color: secCol, shape: BoxShape.circle)),
                    const SizedBox(width: 8),
                    if (isSelected) const Icon(LucideIcons.checkCircle2, color: Color(0xFFF59E0B), size: 18),
                  ],
                ),
                onTap: () {
                  musicProvider.setAppTheme(t['id'] as String);
                  Navigator.of(ctx).pop();
                },
              );
            }),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final musicProvider = Provider.of<MusicProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final isDark = musicProvider.isDarkMode;
    final activeTheme = musicProvider.currentTheme;
    final user = authProvider.user;

    final primaryColor = musicProvider.themePrimary;
    final amberColor = musicProvider.themePrimary;
    final crimsonColor = musicProvider.themeSecondary;
    final textColor = musicProvider.themeText;
    final subtitleColor = musicProvider.themeSubtitle;
    final cardBgColor = musicProvider.themeSurfaceBg;

    final menuItems = [
      {'title': 'My Profile', 'icon': LucideIcons.user, 'badge': ''},
      {'title': '12:00 PM Meditation Scheduler', 'icon': LucideIcons.calendar, 'badge': 'Weekly 7-Days'},
      {'title': 'My Playlists', 'icon': LucideIcons.listMusic, 'badge': '12'},
      {'title': 'Downloads', 'icon': LucideIcons.download, 'badge': musicProvider.offlineSongs.isNotEmpty ? '${musicProvider.offlineSongs.length}' : 'Offline'},
      {'title': 'Listening History', 'icon': LucideIcons.history, 'badge': ''},
      {'title': 'Favorites', 'icon': LucideIcons.heart, 'badge': '48'},
      {'title': 'Sleep Timer', 'icon': LucideIcons.clock, 'badge': musicProvider.sleepTimerMinutes != null ? '${musicProvider.sleepTimerMinutes}m' : 'Off'},
      {'title': 'Audio Quality', 'icon': LucideIcons.volume2, 'badge': _selectedAudioQuality},
      {'title': 'Admin Studio Dashboard', 'icon': LucideIcons.shieldCheck, 'badge': 'Manage'},
    ];

    String authMethodBadgeText = 'Guest Mode • 100% Free';
    if (user.authMethod == 'google') {
      authMethodBadgeText = 'Google Account Verified ✓';
    } else if (user.authMethod == 'email') {
      authMethodBadgeText = 'Email Account Verified ✓';
    } else if (user.authMethod == 'phone') {
      authMethodBadgeText = 'WhatsApp Verified ✓';
    } else if (user.authMethod == 'apple') {
      authMethodBadgeText = 'Apple ID Verified ✓';
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Title & Action Buttons Row ──
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Profile & Analytics',
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.lexendDeca(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: textColor,
                  ),
                ),
              ),

              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: Icon(LucideIcons.pencil, color: amberColor, size: 20),
                    onPressed: () => _showEditProfileModal(context, authProvider),
                  ),
                  IconButton(
                    icon: Icon(user.isLoggedIn ? LucideIcons.logOut : LucideIcons.logIn, color: user.isLoggedIn ? crimsonColor : amberColor, size: 20),
                    onPressed: () async {
                      if (user.isLoggedIn) {
                        await authProvider.signOut();
                      }
                      if (context.mounted) {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const AuthScreen()),
                        );
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),

          // ── User Profile Banner Card ──
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(26),
              border: Border.all(color: const Color(0x33F59E0B), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: const Color(0x12D97706),
                  blurRadius: 18,
                  offset: const Offset(0, 6),
                )
              ],
            ),
            child: Row(
              children: [
                // Glowing Avatar Ring
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: primaryColor, width: 2.5),
                    boxShadow: [
                      BoxShadow(
                        color: primaryColor.withValues(alpha: 0.45),
                        blurRadius: 16,
                        spreadRadius: 2,
                      )
                    ],
                  ),
                  child: ClipOval(
                    child: user.avatarUrl.startsWith('http')
                        ? Image.network(
                            user.avatarUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Image.asset('assets/images/logo.png', fit: BoxFit.cover),
                          )
                        : Image.asset(
                            'assets/images/logo.png',
                            fit: BoxFit.cover,
                          ),
                  ),
                ),
                const SizedBox(width: 16),

                // User Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              user.name,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.lexendDeca(
                                fontSize: 17,
                                fontWeight: FontWeight.w900,
                                color: textColor,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.all(3),
                            decoration: const BoxDecoration(
                              color: Color(0xFF9333EA),
                              shape: BoxShape.circle,
                            ),
                            child: const Text('🕉️', style: TextStyle(fontSize: 10)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        (user.email != null && user.email!.isNotEmpty)
                            ? user.email!
                            : ((user.phone != null && user.phone!.isNotEmpty)
                                ? user.phone!
                                : 'Guest Seeker'),
                        style: GoogleFonts.lexendDeca(
                          fontSize: 12,
                          color: subtitleColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Pill Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                        decoration: BoxDecoration(
                          color: primaryColor.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: primaryColor.withValues(alpha: 0.35)),
                        ),
                        child: Text(
                          authMethodBadgeText,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: isDark ? primaryColor : const Color(0xFFD97706),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // ── Sign-In & Account Sync Options Dropdown Card ──
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0x33F59E0B), width: 1.2),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x12D97706),
                  blurRadius: 16,
                  offset: Offset(0, 6),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(LucideIcons.shieldCheck, color: amberColor, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Sign In & Sync Options',
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.lexendDeca(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: textColor,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Select a sign-in method from the dropdown to sync your devotional streak & analytics',
                  style: GoogleFonts.lexendDeca(fontSize: 11, color: subtitleColor),
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white.withValues(alpha: 0.06) : const Color(0xFFFFF8F0),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0x55F59E0B), width: 1.2),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedSignInMethod,
                      isExpanded: true,
                      dropdownColor: cardBgColor,
                      icon: Icon(LucideIcons.chevronDown, color: amberColor, size: 18),
                      style: GoogleFonts.lexendDeca(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: textColor,
                      ),
                      items: [
                        DropdownMenuItem(
                          value: 'google',
                          child: Row(
                            children: [
                              Container(
                                width: 24,
                                height: 24,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFDC2626),
                                  shape: BoxShape.circle,
                                ),
                                child: const Center(
                                  child: Text('G', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 12)),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Sign in with Google',
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.lexendDeca(fontSize: 13, fontWeight: FontWeight.w700, color: textColor),
                                ),
                              ),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'email',
                          child: Row(
                            children: [
                              Container(
                                width: 24,
                                height: 24,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF2563EB),
                                  shape: BoxShape.circle,
                                ),
                                child: const Center(
                                  child: Icon(LucideIcons.mail, color: Colors.white, size: 13),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Sign in with Email & Password',
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.lexendDeca(fontSize: 13, fontWeight: FontWeight.w700, color: textColor),
                                ),
                              ),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'phone',
                          child: Row(
                            children: [
                              Container(
                                width: 24,
                                height: 24,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF059669),
                                  shape: BoxShape.circle,
                                ),
                                child: const Center(
                                  child: Icon(LucideIcons.messageSquare, color: Colors.white, size: 13),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Sign in via WhatsApp / Phone OTP',
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.lexendDeca(fontSize: 13, fontWeight: FontWeight.w700, color: textColor),
                                ),
                              ),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'apple',
                          child: Row(
                            children: [
                              Container(
                                width: 24,
                                height: 24,
                                decoration: const BoxDecoration(
                                  color: Colors.black,
                                  shape: BoxShape.circle,
                                ),
                                child: const Center(
                                  child: Icon(LucideIcons.apple, color: Colors.white, size: 13),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Sign in with Apple ID',
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.lexendDeca(fontSize: 13, fontWeight: FontWeight.w700, color: textColor),
                                ),
                              ),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'guest',
                          child: Row(
                            children: [
                              Container(
                                width: 24,
                                height: 24,
                                decoration: BoxDecoration(
                                  color: amberColor,
                                  shape: BoxShape.circle,
                                ),
                                child: const Center(
                                  child: Icon(LucideIcons.user, color: Colors.white, size: 13),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Guest Mode (100% Free)',
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.lexendDeca(fontSize: 13, fontWeight: FontWeight.w700, color: textColor),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      onChanged: (val) async {
                        if (val == null) return;
                        setState(() => _selectedSignInMethod = val);
                        if (val == 'guest') {
                          await authProvider.signInAsGuest();
                        } else {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const AuthScreen()),
                          );
                        }
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E1B4B),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () async {
                      if (_selectedSignInMethod == 'guest') {
                        await authProvider.signInAsGuest();
                      } else {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const AuthScreen()),
                        );
                      }
                    },
                    icon: const Icon(LucideIcons.logIn, size: 16),
                    label: Text(
                      'Continue with Selected Sign-In Option',
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.lexendDeca(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // ── Section Title: Devotional Insights & Analytics ──
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: primaryColor.withValues(alpha: 0.15),
                  border: Border.all(color: primaryColor.withValues(alpha: 0.35)),
                ),
                child: Icon(LucideIcons.barChart2, color: isDark ? primaryColor : const Color(0xFFD97706), size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Devotional Insights & Analytics',
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.lexendDeca(
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    color: textColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // ── 2x2 Analytics Grid Cards ──
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 1.25,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            children: [
              _buildAnalyticsCard(
                context: context,
                isDark: isDark,
                cardBgColor: cardBgColor,
                icon: LucideIcons.flame,
                iconColor: const Color(0xFFF97316),
                iconBgColor: const Color(0xFFFFF7ED),
                label: 'Devotional Streak',
                stat: '${user.streakDays} Days',
                subtitle: 'Active daily chanting',
                textColor: textColor,
                subtitleColor: subtitleColor,
                primaryColor: primaryColor,
              ),
              _buildAnalyticsCard(
                context: context,
                isDark: isDark,
                cardBgColor: cardBgColor,
                icon: LucideIcons.sun,
                iconColor: const Color(0xFFEAB308),
                iconBgColor: const Color(0xFFFEFCE8),
                label: 'Meditation Time',
                stat: '${user.meditationMinutes} Mins',
                subtitle: 'Noon 12:00 PM engine',
                textColor: textColor,
                subtitleColor: subtitleColor,
                primaryColor: primaryColor,
              ),
              _buildAnalyticsCard(
                context: context,
                isDark: isDark,
                cardBgColor: cardBgColor,
                icon: LucideIcons.music,
                iconColor: const Color(0xFF3B82F6),
                iconBgColor: const Color(0xFFEFF6FF),
                label: 'Listen Hours',
                stat: '${user.totalListenHours.toStringAsFixed(1)} Hrs',
                subtitle: '${user.totalSongsPlayed} tracks played',
                textColor: textColor,
                subtitleColor: subtitleColor,
                primaryColor: primaryColor,
              ),
              _buildAnalyticsCard(
                context: context,
                isDark: isDark,
                cardBgColor: cardBgColor,
                icon: LucideIcons.sparkles,
                iconColor: const Color(0xFFA855F7),
                iconBgColor: const Color(0xFFAF55F7),
                label: 'Top Deity',
                stat: user.topDeity,
                subtitle: 'Most listened chants',
                textColor: textColor,
                subtitleColor: subtitleColor,
                primaryColor: primaryColor,
              ),
            ],
          ),
          const SizedBox(height: 28),

          // ── Section Title: App Theme Color Schemes ──
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: amberColor.withValues(alpha: 0.15),
                  border: Border.all(color: amberColor.withValues(alpha: 0.35)),
                ),
                child: Icon(LucideIcons.palette, color: isDark ? primaryColor : const Color(0xFFD97706), size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'App Theme Color Schemes',
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.lexendDeca(
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    color: textColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // ── Theme Color Scheme Dropdown Card ──
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0x33F59E0B), width: 1.2),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x12D97706),
                  blurRadius: 16,
                  offset: Offset(0, 6),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Choose a sacred theme color scheme from the dropdown:',
                  style: GoogleFonts.lexendDeca(fontSize: 11, color: subtitleColor),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white.withValues(alpha: 0.06) : const Color(0xFFFFF8F0),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0x55F59E0B), width: 1.2),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: musicProvider.currentThemeId,
                      isExpanded: true,
                      dropdownColor: cardBgColor,
                      icon: Icon(LucideIcons.chevronDown, color: amberColor, size: 18),
                      items: musicProvider.appThemes.map((t) {
                        final primCol = t['primary'] as Color;
                        final secCol = t['secondary'] as Color;
                        final bgCol = t['scaffoldBg'] as Color;
                        return DropdownMenuItem<String>(
                          value: t['id'] as String,
                          child: Row(
                            children: [
                              Container(
                                width: 26,
                                height: 26,
                                decoration: BoxDecoration(
                                  color: bgCol,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: primCol, width: 1.5),
                                ),
                                child: Center(
                                  child: Text(t['emoji'] as String, style: const TextStyle(fontSize: 13)),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  '${t['name']} — ${t['subtitle']}',
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.lexendDeca(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: textColor,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                width: 10,
                                height: 10,
                                decoration: BoxDecoration(color: primCol, shape: BoxShape.circle),
                              ),
                              const SizedBox(width: 4),
                              Container(
                                width: 10,
                                height: 10,
                                decoration: BoxDecoration(color: secCol, shape: BoxShape.circle),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          musicProvider.setAppTheme(val);
                        }
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // ── Section Title: Menu & Settings ──
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: amberColor.withValues(alpha: 0.15),
                  border: Border.all(color: amberColor.withValues(alpha: 0.35)),
                ),
                child: Icon(LucideIcons.slidersHorizontal, color: isDark ? primaryColor : const Color(0xFFD97706), size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Menu & Settings',
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.lexendDeca(
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    color: textColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // ── Full Interactive Menu List ──
          Container(
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0x33F59E0B), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: const Color(0x12D97706),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                )
              ],
            ),
            child: Column(
              children: [
                ...menuItems.map((item) {
                  final title = item['title'] as String;
                  return Column(
                    children: [
                      ListTile(
                        leading: Icon(item['icon'] as IconData, color: textColor, size: 20),
                        title: Text(
                          title,
                          style: GoogleFonts.lexendDeca(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: textColor,
                          ),
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if ((item['badge'] as String).isNotEmpty)
                              Text(
                                item['badge'] as String,
                                style: GoogleFonts.lexendDeca(
                                  fontSize: 12,
                                  color: subtitleColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            const SizedBox(width: 6),
                            Icon(LucideIcons.chevronRight, color: subtitleColor, size: 16),
                          ],
                        ),
                        onTap: () {
                          if (title == 'My Profile') {
                            _showEditProfileModal(context, authProvider);
                          } else if (title.contains('Meditation Scheduler')) {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const MeditationScheduleScreen()),
                            );
                          } else if (title == 'Downloads') {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const OfflineScreen()),
                            );
                          } else if (title == 'My Playlists') {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const LibraryScreen(initialTab: 'Playlists')),
                            );
                          } else if (title == 'Favorites') {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const LibraryScreen(initialTab: 'Favorites')),
                            );
                          } else if (title == 'Listening History') {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const LibraryScreen(initialTab: 'History')),
                            );
                          } else if (title == 'Sleep Timer') {
                            _showSleepTimerModal(context, musicProvider);
                          } else if (title == 'Audio Quality') {
                            _showAudioQualityModal(context);
                          } else if (title == 'Admin Studio Dashboard') {
                            Navigator.of(context).pushNamed('/admin');
                          }
                        },
                      ),
                      Divider(height: 1, color: isDark ? Colors.white12 : Colors.black.withValues(alpha: 0.05)),
                    ],
                  );
                }),

                // Notifications Switch
                ListTile(
                  leading: Icon(LucideIcons.bell, color: textColor, size: 20),
                  title: Text(
                    'Notifications',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                  trailing: Switch(
                    value: _notificationsEnabled,
                    activeThumbColor: Colors.white,
                    activeTrackColor: const Color(0xFFF59E0B),
                    onChanged: (val) {
                      setState(() => _notificationsEnabled = val);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(val ? '12:00 PM Notifications Enabled 🔔' : 'Notifications Muted 🔕', style: GoogleFonts.lexendDeca(color: Colors.white)),
                          backgroundColor: amberColor,
                          duration: const Duration(seconds: 1),
                        ),
                      );
                    },
                  ),
                ),
                Divider(height: 1, color: isDark ? Colors.white12 : Colors.black.withValues(alpha: 0.05)),

                // App Theme Switcher
                ListTile(
                  leading: Icon(LucideIcons.palette, color: textColor, size: 20),
                  title: Text(
                    'App Theme',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        musicProvider.currentThemeName,
                        style: GoogleFonts.lexendDeca(fontSize: 12, color: subtitleColor, fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(width: 6),
                      Icon(LucideIcons.chevronRight, color: subtitleColor, size: 16),
                    ],
                  ),
                  onTap: () => _showThemePickerModal(context, musicProvider),
                ),
                Divider(height: 1, color: isDark ? Colors.white12 : Colors.black.withValues(alpha: 0.05)),

                // Sign Out / Sign In Button
                ListTile(
                  leading: Icon(
                    user.isLoggedIn ? LucideIcons.logOut : LucideIcons.logIn,
                    color: user.isLoggedIn ? const Color(0xFFE11D48) : amberColor,
                    size: 20,
                  ),
                  title: Text(
                    user.isLoggedIn ? 'Sign Out' : 'Sign In / Connect Account',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: user.isLoggedIn ? const Color(0xFFE11D48) : amberColor,
                    ),
                  ),
                  onTap: () async {
                    if (user.isLoggedIn) {
                      await authProvider.signOut();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Signed out of Shambala Music', style: GoogleFonts.lexendDeca(color: Colors.white)),
                            backgroundColor: crimsonColor,
                            duration: const Duration(milliseconds: 1500),
                          ),
                        );
                      }
                    } else {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const AuthScreen()),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildAnalyticsCard({
    required BuildContext context,
    required bool isDark,
    required Color cardBgColor,
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String label,
    required String stat,
    required String subtitle,
    required Color textColor,
    required Color subtitleColor,
    required Color primaryColor,
  }) {
    final statColor = isDark ? primaryColor : const Color(0xFFD97706);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBgColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0x33F59E0B), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0x12D97706),
            blurRadius: 12,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isDark ? iconColor.withValues(alpha: 0.2) : iconBgColor,
                ),
                child: Icon(icon, color: iconColor, size: 16),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.lexendDeca(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: subtitleColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              stat,
              style: GoogleFonts.lexendDeca(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: statColor,
              ),
            ),
          ),
          const SizedBox(height: 2),
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
    );
  }
}
