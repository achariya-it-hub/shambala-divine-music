import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:firebase_core/firebase_core.dart';

import 'providers/music_provider.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/admin_screen.dart';

import 'package:flutter/foundation.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kIsWeb) {
    try {
      await Firebase.initializeApp();
    } catch (e) {
      debugPrint('Firebase init check: $e');
    }
  }
  runApp(const ShambalaDivineApp());
}

class ShambalaDivineApp extends StatelessWidget {
  const ShambalaDivineApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => MusicProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: Consumer<MusicProvider>(
        builder: (context, provider, child) {
          final isDark = provider.isDarkMode;
          final activeTheme = provider.currentTheme;
          final scaffoldBg = activeTheme['scaffoldBg'] as Color;
          final surfaceBg = activeTheme['surfaceBg'] as Color;
          final primaryCol = activeTheme['primary'] as Color;
          final secondaryCol = activeTheme['secondary'] as Color;
          final onSurfaceCol = activeTheme['onSurface'] as Color;

          final dynamicTheme = ThemeData(
            brightness: isDark ? Brightness.dark : Brightness.light,
            scaffoldBackgroundColor: scaffoldBg,
            primaryColor: primaryCol,
            colorScheme: isDark
                ? ColorScheme.dark(
                    primary: primaryCol,
                    secondary: secondaryCol,
                    surface: surfaceBg,
                    onSurface: onSurfaceCol,
                  )
                : ColorScheme.light(
                    primary: primaryCol,
                    secondary: secondaryCol,
                    surface: surfaceBg,
                    onSurface: onSurfaceCol,
                  ),
            textTheme: GoogleFonts.lexendDecaTextTheme(
              isDark ? ThemeData.dark().textTheme : ThemeData.light().textTheme,
            ),
            useMaterial3: true,
          );

          return MaterialApp(
            title: 'Happy Shambala',
            debugShowCheckedModeBanner: false,
            themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
            theme: dynamicTheme,
            darkTheme: dynamicTheme,
            routes: {
              '/admin': (ctx) => Scaffold(
                    backgroundColor: scaffoldBg,
                    appBar: AppBar(
                      backgroundColor: Colors.transparent,
                      elevation: 0,
                      title: const Text('Admin Dashboard'),
                    ),
                    body: const AdminScreen(),
                  ),
            },
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}
