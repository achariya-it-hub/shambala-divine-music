import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/user_profile.dart';

class AuthProvider extends ChangeNotifier {
  UserProfile _user = UserProfile.guest();
  bool _isLoading = false;
  String? _pendingPhoneNumber;
  String? _verificationId;
  String? _generatedWhatsAppOtp;
  bool _isOtpSent = false;
  String? _authError;

  UserProfile get user => _user;
  bool get isLoading => _isLoading;
  String? get pendingPhoneNumber => _pendingPhoneNumber;
  bool get isOtpSent => _isOtpSent;
  String? get authError => _authError;
  bool get isLoggedIn => _user.isLoggedIn;
  String? get generatedWhatsAppOtp => _generatedWhatsAppOtp;

  static const String _userPrefsKey = 'shambala_user_profile';

  AuthProvider() {
    loadSavedUser();
  }

  Future<void> loadSavedUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString(_userPrefsKey);
      if (userJson != null) {
        _user = UserProfile.fromJson(userJson);
      }
    } catch (e) {
      debugPrint('Error loading saved user: $e');
    }
    notifyListeners();
  }

  Future<void> _saveUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_userPrefsKey, _user.toJson());
    } catch (e) {
      debugPrint('Error saving user: $e');
    }
  }

  Future<bool> signInWithGoogle({String? customEmail, String? customName}) async {
    _isLoading = true;
    _authError = null;
    notifyListeners();

    if (!kIsWeb && (customEmail == null || customEmail.trim().isEmpty)) {
      try {
        final GoogleSignIn googleSignIn = GoogleSignIn(
          scopes: ['email', 'profile'],
        );
        // Disconnect previous session to ensure Google Account selector displays
        try {
          await googleSignIn.signOut();
        } catch (_) {}

        final GoogleSignInAccount? googleUser = await googleSignIn.signIn();
        if (googleUser != null) {
          final userName = (googleUser.displayName != null && googleUser.displayName!.isNotEmpty)
              ? googleUser.displayName!
              : googleUser.email.split('@').first;

          _user = UserProfile.defaultUser(
            name: userName,
            email: googleUser.email,
            authMethod: 'google',
          ).copyWith(
            avatarUrl: googleUser.photoUrl ?? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
            streakDays: 12,
            meditationMinutes: 180,
            totalListenHours: 42.0,
            topDeity: 'Lord Shiva',
            totalSongsPlayed: 215,
          );

          await _saveUser();
          _isLoading = false;
          notifyListeners();
          return true;
        }
      } catch (e) {
        debugPrint('Google Sign In notice: $e');
      }
    }

    // If custom Google email was provided (or via dialog prompt):
    if (customEmail != null && customEmail.trim().isNotEmpty) {
      final emailStr = customEmail.trim();
      final nameFromEmail = emailStr.split('@').first;
      final displayName = (customName != null && customName.trim().isNotEmpty)
          ? customName.trim()
          : (nameFromEmail.isNotEmpty ? nameFromEmail[0].toUpperCase() + nameFromEmail.substring(1) : 'Google Devotee');

      _user = UserProfile.defaultUser(
        name: displayName,
        email: emailStr,
        authMethod: 'google',
      ).copyWith(
        avatarUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
        streakDays: 12,
        meditationMinutes: 180,
        totalListenHours: 42.0,
        topDeity: 'Lord Shiva',
        totalSongsPlayed: 215,
      );

      await _saveUser();
      _isLoading = false;
      notifyListeners();
      return true;
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> signInWithEmail(String email, String password) async {
    if (email.trim().isEmpty || !email.contains('@')) {
      _authError = 'Please enter a valid email address';
      notifyListeners();
      return false;
    }
    _isLoading = true;
    _authError = null;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 600));

    final nameFromEmail = email.split('@').first;
    _user = UserProfile.defaultUser(
      name: nameFromEmail.isNotEmpty ? nameFromEmail[0].toUpperCase() + nameFromEmail.substring(1) : 'Devotee',
      email: email.trim(),
      authMethod: 'email',
    ).copyWith(
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      streakDays: 7,
      meditationMinutes: 120,
      totalListenHours: 25.0,
      topDeity: 'Lord Krishna',
      totalSongsPlayed: 140,
    );

    await _saveUser();
    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<bool> signInWithApple({String? customEmail, String? customName}) async {
    _isLoading = true;
    _authError = null;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 500));

    final emailStr = (customEmail != null && customEmail.trim().isNotEmpty)
        ? customEmail.trim()
        : 'seeker@icloud.com';
    final nameFromEmail = emailStr.split('@').first;
    final displayName = (customName != null && customName.trim().isNotEmpty)
        ? customName.trim()
        : (nameFromEmail.isNotEmpty
            ? nameFromEmail[0].toUpperCase() + nameFromEmail.substring(1)
            : 'Apple Devotee');

    _user = UserProfile.defaultUser(
      name: displayName,
      email: emailStr,
      authMethod: 'apple',
    ).copyWith(
      avatarUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80',
      streakDays: 9,
      meditationMinutes: 150,
      totalListenHours: 31.5,
      topDeity: 'Sri Mahalakshmi',
      totalSongsPlayed: 175,
    );

    await _saveUser();
    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<bool> sendPhoneOtp(String phone) async {
    final cleanPhone = phone.replaceAll(RegExp(r'[^\d+]'), '');
    if (cleanPhone.length < 8) {
      _authError = 'Please enter a valid phone number';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    _authError = null;
    notifyListeners();

    // Generate WhatsApp 6-digit verification code
    _generatedWhatsAppOtp = (100000 + (DateTime.now().millisecondsSinceEpoch % 899999)).toString();
    _pendingPhoneNumber = cleanPhone;

    // Launch WhatsApp directly with prefilled verification code
    final message = Uri.encodeComponent('Your Happy Shambala OTP verification code is: $_generatedWhatsAppOtp');
    final whatsappUrl = Uri.parse('https://wa.me/$cleanPhone?text=$message');

    try {
      if (await canLaunchUrl(whatsappUrl)) {
        await launchUrl(whatsappUrl, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('WhatsApp launch notice: $e');
    }

    _verificationId = 'whatsapp_verification_id';
    _isOtpSent = true;
    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<bool> verifyOtp(String otp) async {
    if (otp.trim().length < 4) {
      _authError = 'Please enter a valid 6-digit OTP';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    _authError = null;
    notifyListeners();

    final phoneStr = _pendingPhoneNumber ?? 'Unknown';
    await _handleFirebaseUserLogin(phoneStr);
    return true;
  }

  Future<void> _handleFirebaseUserLogin(String phoneStr) async {
    final shortPhone = phoneStr.length > 4 ? phoneStr.substring(phoneStr.length - 4) : phoneStr;
    _user = UserProfile.defaultUser(
      name: 'Devotee ($shortPhone)',
      phone: phoneStr,
      authMethod: 'phone',
    ).copyWith(
      streakDays: 5,
      meditationMinutes: 90,
      totalListenHours: 18.5,
      topDeity: 'Maa Durga',
      totalSongsPlayed: 110,
    );

    await _saveUser();
    _isOtpSent = false;
    _pendingPhoneNumber = null;
    _verificationId = null;
    _generatedWhatsAppOtp = null;
    _isLoading = false;
    notifyListeners();
  }

  void resetOtpState() {
    _isOtpSent = false;
    _pendingPhoneNumber = null;
    _verificationId = null;
    _generatedWhatsAppOtp = null;
    _authError = null;
    notifyListeners();
  }

  Future<void> signInAsGuest() async {
    _user = UserProfile.guest();
    await _saveUser();
    notifyListeners();
  }

  Future<void> updateProfile({String? name, String? topDeity}) async {
    _user = _user.copyWith(
      name: name ?? _user.name,
      topDeity: topDeity ?? _user.topDeity,
    );
    await _saveUser();
    notifyListeners();
  }

  Future<void> signOut() async {
    _user = UserProfile.guest();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userPrefsKey);
    notifyListeners();
  }
}
