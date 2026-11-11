import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/auth_provider.dart';
import 'main_navigation_screen.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _selectedCountryCode = '+91';

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _showEmailSignInModal(BuildContext context, AuthProvider auth) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
        ),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFFFF8F0), Color(0xFFFFF5EA)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            border: Border.all(color: const Color(0x44F59E0B), width: 1.5),
            boxShadow: const [
              BoxShadow(
                color: Color(0x221E1B4B),
                blurRadius: 24,
                offset: Offset(0, -6),
              )
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
                      ),
                      border: Border.all(color: Colors.white, width: 1.5),
                    ),
                    child: const Icon(LucideIcons.mail, color: Colors.white, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Sign in with Email',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF1E1B4B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                style: GoogleFonts.lexendDeca(color: const Color(0xFF1E1B4B)),
                decoration: InputDecoration(
                  hintText: 'name@example.com',
                  hintStyle: GoogleFonts.lexendDeca(color: const Color(0xFF94A3B8)),
                  labelText: 'Email Address',
                  labelStyle: GoogleFonts.lexendDeca(color: const Color(0xFF475569)),
                  prefixIcon: const Icon(LucideIcons.atSign, color: Color(0xFFF59E0B), size: 18),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0x33F59E0B)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0x33F59E0B)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFFF59E0B), width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: _passwordController,
                obscureText: true,
                style: GoogleFonts.lexendDeca(color: const Color(0xFF1E1B4B)),
                decoration: InputDecoration(
                  hintText: '••••••••',
                  hintStyle: GoogleFonts.lexendDeca(color: const Color(0xFF94A3B8)),
                  labelText: 'Password',
                  labelStyle: GoogleFonts.lexendDeca(color: const Color(0xFF475569)),
                  prefixIcon: const Icon(LucideIcons.lock, color: Color(0xFFF59E0B), size: 18),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0x33F59E0B)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0x33F59E0B)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFFF59E0B), width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 22),
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x332563EB),
                      blurRadius: 12,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E1B4B),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                    elevation: 0,
                  ),
                  onPressed: () async {
                    Navigator.of(ctx).pop();
                    final success = await auth.signInWithEmail(_emailController.text, _passwordController.text);
                    if (success && context.mounted) {
                      _proceedToMain();
                    }
                  },
                  child: Text(
                    'Sign In',
                    style: GoogleFonts.lexendDeca(fontSize: 15, fontWeight: FontWeight.w800),
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  void _showGoogleAccountSyncModal(BuildContext context, AuthProvider auth) {
    final googleEmailController = TextEditingController();
    final googleNameController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
        ),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFFFF8F0), Color(0xFFFFF5EA)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            border: Border.all(color: const Color(0x44EF4444), width: 1.5),
            boxShadow: const [
              BoxShadow(
                color: Color(0x221E1B4B),
                blurRadius: 24,
                offset: Offset(0, -6),
              )
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
                      ),
                      border: Border.all(color: Colors.white, width: 1.5),
                    ),
                    child: const Center(
                      child: Text('G', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Sync Your Google Account',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF1E1B4B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Enter your Google account email address to sync your personal profile & stats.',
                style: GoogleFonts.lexendDeca(fontSize: 12, color: const Color(0xFF64748B)),
              ),
              const SizedBox(height: 18),
              TextField(
                controller: googleEmailController,
                keyboardType: TextInputType.emailAddress,
                style: GoogleFonts.lexendDeca(color: const Color(0xFF1E1B4B)),
                decoration: InputDecoration(
                  hintText: 'yourname@gmail.com',
                  hintStyle: GoogleFonts.lexendDeca(color: const Color(0xFF94A3B8)),
                  labelText: 'Google Email Address',
                  labelStyle: GoogleFonts.lexendDeca(color: const Color(0xFF475569)),
                  prefixIcon: const Icon(LucideIcons.atSign, color: Color(0xFFEF4444), size: 18),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0x33EF4444)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: googleNameController,
                style: GoogleFonts.lexendDeca(color: const Color(0xFF1E1B4B)),
                decoration: InputDecoration(
                  hintText: 'e.g. Rahul Sharma',
                  hintStyle: GoogleFonts.lexendDeca(color: const Color(0xFF94A3B8)),
                  labelText: 'Your Name (Optional)',
                  labelStyle: GoogleFonts.lexendDeca(color: const Color(0xFF475569)),
                  prefixIcon: const Icon(LucideIcons.user, color: Color(0xFFEF4444), size: 18),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0x33EF4444)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 22),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFDC2626),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                  elevation: 0,
                ),
                onPressed: () async {
                  Navigator.of(ctx).pop();
                  final success = await auth.signInWithGoogle(
                    customEmail: googleEmailController.text,
                    customName: googleNameController.text,
                  );
                  if (success && context.mounted) {
                    _proceedToMain();
                  }
                },
                child: Text(
                  'Confirm & Sync Google Account',
                  style: GoogleFonts.lexendDeca(fontSize: 14, fontWeight: FontWeight.w800),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  void _showAppleSignInModal(BuildContext context, AuthProvider auth) {
    final appleEmailController = TextEditingController();
    final appleNameController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
        ),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFFFF8F0), Color(0xFFFFF5EA)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            border: Border.all(color: const Color(0x441E1B4B), width: 1.5),
            boxShadow: const [
              BoxShadow(
                color: Color(0x221E1B4B),
                blurRadius: 24,
                offset: Offset(0, -6),
              )
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.black,
                      border: Border.all(color: Colors.white, width: 1.5),
                    ),
                    child: const Center(
                      child: Icon(LucideIcons.apple, color: Colors.white, size: 18),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Sign in with Apple ID',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF1E1B4B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Enter your Apple ID / iCloud email to sync your devotional profile & stats.',
                style: GoogleFonts.lexendDeca(fontSize: 12, color: const Color(0xFF64748B)),
              ),
              const SizedBox(height: 18),
              TextField(
                controller: appleEmailController,
                keyboardType: TextInputType.emailAddress,
                style: GoogleFonts.lexendDeca(color: const Color(0xFF1E1B4B)),
                decoration: InputDecoration(
                  hintText: 'yourname@icloud.com',
                  hintStyle: GoogleFonts.lexendDeca(color: const Color(0xFF94A3B8)),
                  labelText: 'Apple ID / iCloud Email',
                  labelStyle: GoogleFonts.lexendDeca(color: const Color(0xFF475569)),
                  prefixIcon: const Icon(LucideIcons.atSign, color: Color(0xFF1E1B4B), size: 18),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0x331E1B4B)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFF1E1B4B), width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: appleNameController,
                style: GoogleFonts.lexendDeca(color: const Color(0xFF1E1B4B)),
                decoration: InputDecoration(
                  hintText: 'e.g. Ananya Rao',
                  hintStyle: GoogleFonts.lexendDeca(color: const Color(0xFF94A3B8)),
                  labelText: 'Your Name (Optional)',
                  labelStyle: GoogleFonts.lexendDeca(color: const Color(0xFF475569)),
                  prefixIcon: const Icon(LucideIcons.user, color: Color(0xFF1E1B4B), size: 18),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0x331E1B4B)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFF1E1B4B), width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 22),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                  elevation: 0,
                ),
                onPressed: () async {
                  Navigator.of(ctx).pop();
                  final success = await auth.signInWithApple(
                    customEmail: appleEmailController.text,
                    customName: appleNameController.text,
                  );
                  if (success && context.mounted) {
                    _proceedToMain();
                  }
                },
                child: Text(
                  'Continue with Apple ID',
                  style: GoogleFonts.lexendDeca(fontSize: 14, fontWeight: FontWeight.w800),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  void _proceedToMain() {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (_, __, ___) => const MainNavigationScreen(),
        transitionsBuilder: (_, animation, __, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 500),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFFF8F0),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),

              // 3D Header Logo & Divine Icon Orb
              Center(
                child: Container(
                  width: 104,
                  height: 104,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFCD34D), Color(0xFFF59E0B), Color(0xFFB45309)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x55F59E0B),
                        blurRadius: 24,
                        spreadRadius: 2,
                      ),
                      BoxShadow(
                        color: Color(0x33E11D48),
                        blurRadius: 36,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(3),
                    child: Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/images/logo.png',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              color: const Color(0xFFFFF8F0),
                              child: const Center(
                                child: Text('🕉️', style: TextStyle(fontSize: 44)),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 22),

              // Title & Welcome Note
              Text(
                'Welcome to Happy Shambala',
                textAlign: TextAlign.center,
                style: GoogleFonts.lexendDeca(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFFD97706),
                  shadows: const [
                    Shadow(
                      color: Color(0x33F59E0B),
                      blurRadius: 10,
                      offset: Offset(0, 2),
                    )
                  ],
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Awakening Avadhanies',
                textAlign: TextAlign.center,
                style: GoogleFonts.lexendDeca(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.8,
                  color: const Color(0xFF78350F),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Sign in to build your devotional streak & personalized chanting analytics',
                textAlign: TextAlign.center,
                style: GoogleFonts.lexendDeca(
                  fontSize: 12,
                  color: const Color(0xFF64748B),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 22),

              // 3D Free Badge Banner Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF261F4C), Color(0xFF181335)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: const Color(0x66F59E0B),
                    width: 1.5,
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x331E1B4B),
                      blurRadius: 12,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 26,
                        height: 26,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0x33F59E0B),
                          border: Border.all(color: const Color(0x66F59E0B)),
                        ),
                        child: const Icon(LucideIcons.sparkles, color: Color(0xFFFCD34D), size: 14),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        '100% Free Forever • No Subscriptions Required',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFFFCD34D),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Error Display
              if (auth.authError != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0x15E11D48),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0x66E11D48), width: 1.5),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.alertCircle, color: Color(0xFFE11D48), size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          auth.authError!,
                          style: GoogleFonts.lexendDeca(
                            color: const Color(0xFFE11D48),
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // 3D Google Sign In Button
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(26),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x221E1B4B),
                      blurRadius: 14,
                      offset: Offset(0, 6),
                    )
                  ],
                ),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF1E1B4B),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(26),
                      side: const BorderSide(color: Color(0x221E1B4B), width: 1),
                    ),
                    elevation: 0,
                  ),
                  onPressed: auth.isLoading
                      ? null
                      : () async {
                          final success = await auth.signInWithGoogle();
                          if (success && context.mounted) {
                            _proceedToMain();
                          } else if (context.mounted) {
                            _showGoogleAccountSyncModal(context, auth);
                          }
                        },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // 3D Google G Icon Badge Orb
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                          border: Border.all(color: Colors.white, width: 1.5),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x44EF4444),
                              blurRadius: 6,
                              offset: Offset(0, 2),
                            )
                          ],
                        ),
                        child: const Center(
                          child: Text(
                            'G',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Sign in with Google',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFF1E1B4B),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // 3D Email Sign In Button
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(26),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x331E1B4B),
                      blurRadius: 14,
                      offset: Offset(0, 6),
                    )
                  ],
                ),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E1B4B),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(26),
                    ),
                    elevation: 0,
                  ),
                  onPressed: auth.isLoading ? null : () => _showEmailSignInModal(context, auth),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // 3D Email Icon Badge Orb
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                          border: Border.all(color: Colors.white, width: 1.5),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x443B82F6),
                              blurRadius: 6,
                              offset: Offset(0, 2),
                            )
                          ],
                        ),
                        child: const Center(
                          child: Icon(LucideIcons.mail, color: Colors.white, size: 14),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Sign in with Email',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // 3D Apple ID Sign In Button
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(26),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x22000000),
                      blurRadius: 14,
                      offset: Offset(0, 6),
                    )
                  ],
                ),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(26),
                    ),
                    elevation: 0,
                  ),
                  onPressed: auth.isLoading ? null : () => _showAppleSignInModal(context, auth),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF1F2937),
                          border: Border.all(color: Colors.white, width: 1.5),
                        ),
                        child: const Center(
                          child: Icon(LucideIcons.apple, color: Colors.white, size: 14),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Sign in with Apple ID',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // OR Divider
              Row(
                children: [
                  const Expanded(child: Divider(color: Color(0x221E1B4B), thickness: 1.2)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: Text(
                      'OR WHATSAPP / PHONE OTP',
                      style: GoogleFonts.lexendDeca(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.5,
                        color: const Color(0xFF64748B),
                      ),
                    ),
                  ),
                  const Expanded(child: Divider(color: Color(0x221E1B4B), thickness: 1.2)),
                ],
              ),
              const SizedBox(height: 24),

              // Phone / WhatsApp Sign-In Section
              if (!auth.isOtpSent) ...[
                // 3D Phone / WhatsApp Number Input Card
                Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF261F4C), Color(0xFF181335)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(
                      color: const Color(0x44F59E0B),
                      width: 1.5,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x331E1B4B),
                        blurRadius: 16,
                        offset: Offset(0, 6),
                      )
                    ],
                  ),
                  child: Row(
                    children: [
                      // Country Code Selector
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                        decoration: const BoxDecoration(
                          border: Border(
                            right: BorderSide(color: Color(0x33FFFFFF), width: 1.2),
                          ),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _selectedCountryCode,
                            dropdownColor: const Color(0xFF181335),
                            style: GoogleFonts.lexendDeca(
                              color: const Color(0xFFFCD34D),
                              fontWeight: FontWeight.w800,
                              fontSize: 14,
                            ),
                            icon: const Icon(LucideIcons.chevronDown, color: Colors.white54, size: 16),
                            onChanged: (val) {
                              if (val != null) {
                                setState(() => _selectedCountryCode = val);
                              }
                            },
                            items: const [
                              DropdownMenuItem(value: '+91', child: Text('🇮🇳 +91')),
                              DropdownMenuItem(value: '+1', child: Text('🇺🇸 +1')),
                              DropdownMenuItem(value: '+44', child: Text('🇬🇧 +44')),
                              DropdownMenuItem(value: '+971', child: Text('🇦🇪 +971')),
                            ],
                          ),
                        ),
                      ),

                      // Phone Input Field
                      Expanded(
                        child: TextField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          style: GoogleFonts.lexendDeca(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                          decoration: InputDecoration(
                            hintText: 'Enter phone / WhatsApp number',
                            hintStyle: GoogleFonts.lexendDeca(color: Colors.white38, fontSize: 14),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),

                // 3D Send WhatsApp OTP Button
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(26),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x44059669),
                        blurRadius: 16,
                        offset: Offset(0, 6),
                      )
                    ],
                  ),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF059669),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(26),
                      ),
                      elevation: 0,
                    ),
                    onPressed: auth.isLoading
                        ? null
                        : () async {
                            final fullPhone = '$_selectedCountryCode ${_phoneController.text}';
                            await auth.sendPhoneOtp(fullPhone);
                          },
                    child: auth.isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 28,
                                height: 28,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF10B981), Color(0xFF059669)],
                                  ),
                                  border: Border.all(color: Colors.white, width: 1.5),
                                  boxShadow: const [
                                    BoxShadow(
                                      color: Color(0x3310B981),
                                      blurRadius: 6,
                                      offset: Offset(0, 2),
                                    )
                                  ],
                                ),
                                child: const Icon(LucideIcons.messageSquare, color: Colors.white, size: 15),
                              ),
                              const SizedBox(width: 10),
                              Text(
                                'Send OTP via WhatsApp',
                                style: GoogleFonts.lexendDeca(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                  ),
                ),
                const SizedBox(height: 8),
                Center(
                  child: Text(
                    '💬 Instant 6-digit verification code sent via WhatsApp',
                    style: GoogleFonts.lexendDeca(
                      fontSize: 11,
                      color: const Color(0xFF059669),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ] else ...[
                // OTP Input Drawer / 3D Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF261F4C), Color(0xFF181335)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: const Color(0xFF10B981), width: 1.5),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x4410B981),
                        blurRadius: 18,
                        offset: Offset(0, 6),
                      )
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(LucideIcons.messageSquare, color: Color(0xFF10B981), size: 18),
                              const SizedBox(width: 8),
                              Text(
                                'Enter WhatsApp OTP',
                                style: GoogleFonts.lexendDeca(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: const Color(0xFF10B981),
                                ),
                              ),
                            ],
                          ),
                          TextButton(
                            onPressed: () => auth.resetOtpState(),
                            child: Text(
                              'Edit Number',
                              style: GoogleFonts.lexendDeca(
                                fontSize: 12,
                                color: Colors.white60,
                              ),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        'Sent via WhatsApp to ${auth.pendingPhoneNumber}',
                        style: GoogleFonts.lexendDeca(
                          fontSize: 12,
                          color: Colors.white60,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // OTP Textfield
                      TextField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.lexendDeca(
                          color: const Color(0xFF1E1B4B),
                          fontSize: 22,
                          letterSpacing: 10,
                          fontWeight: FontWeight.bold,
                        ),
                        decoration: InputDecoration(
                          counterText: '',
                          hintText: '123456',
                          hintStyle: GoogleFonts.lexendDeca(
                            color: const Color(0xFF94A3B8),
                            letterSpacing: 10,
                          ),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0x33F59E0B)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFF59E0B), width: 1.5),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Verify & Login 3D Button
                      SizedBox(
                        width: double.infinity,
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(22),
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0x44F59E0B),
                                blurRadius: 16,
                                offset: Offset(0, 6),
                              )
                            ],
                          ),
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF59E0B),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(22),
                              ),
                              elevation: 0,
                            ),
                            onPressed: auth.isLoading
                                ? null
                                : () async {
                                    final success = await auth.verifyOtp(_otpController.text);
                                    if (success && context.mounted) {
                                      _proceedToMain();
                                    }
                                  },
                            child: auth.isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  )
                                : Text(
                                    'Verify & Sign In',
                                    style: GoogleFonts.lexendDeca(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 32),

              // 3D Continue as Guest Option Button Card
              Center(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF261F4C), Color(0xFF181335)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: const Color(0x66F59E0B),
                      width: 1.2,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x331E1B4B),
                        blurRadius: 10,
                        offset: Offset(0, 4),
                      )
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(20),
                      onTap: () async {
                        await auth.signInAsGuest();
                        if (context.mounted) {
                          _proceedToMain();
                        }
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        child: Text(
                          'Skip & Explore as Guest →',
                          style: GoogleFonts.lexendDeca(
                            fontSize: 13,
                            color: const Color(0xFFFCD34D),
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}

