import 'dart:convert';

class UserProfile {
  final String id;
  final String name;
  final String? email;
  final String? phone;
  final String avatarUrl;
  final String authMethod; // 'google', 'phone', 'guest'
  final bool isLoggedIn;

  // Devotional Analytics
  final int streakDays;
  final int meditationMinutes;
  final double totalListenHours;
  final String topDeity;
  final int totalSongsPlayed;

  UserProfile({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    required this.avatarUrl,
    required this.authMethod,
    required this.isLoggedIn,
    this.streakDays = 7,
    this.meditationMinutes = 108,
    this.totalListenHours = 24.5,
    this.topDeity = 'Lord Shiva',
    this.totalSongsPlayed = 142,
  });

  factory UserProfile.guest() {
    return UserProfile(
      id: 'guest_user',
      name: 'Devotional Seeker',
      email: null,
      phone: null,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      authMethod: 'guest',
      isLoggedIn: false,
      streakDays: 3,
      meditationMinutes: 30,
      totalListenHours: 4.5,
      topDeity: 'Universal Divine',
      totalSongsPlayed: 25,
    );
  }

  factory UserProfile.defaultUser({
    required String name,
    String? email,
    String? phone,
    required String authMethod,
  }) {
    return UserProfile(
      id: 'user_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      phone: phone,
      avatarUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
      authMethod: authMethod,
      isLoggedIn: true,
      streakDays: 7,
      meditationMinutes: 108,
      totalListenHours: 24.5,
      topDeity: 'Lord Shiva',
      totalSongsPlayed: 142,
    );
  }

  UserProfile copyWith({
    String? name,
    String? email,
    String? phone,
    String? avatarUrl,
    String? authMethod,
    bool? isLoggedIn,
    int? streakDays,
    int? meditationMinutes,
    double? totalListenHours,
    String? topDeity,
    int? totalSongsPlayed,
  }) {
    return UserProfile(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      authMethod: authMethod ?? this.authMethod,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      streakDays: streakDays ?? this.streakDays,
      meditationMinutes: meditationMinutes ?? this.meditationMinutes,
      totalListenHours: totalListenHours ?? this.totalListenHours,
      topDeity: topDeity ?? this.topDeity,
      totalSongsPlayed: totalSongsPlayed ?? this.totalSongsPlayed,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'avatarUrl': avatarUrl,
      'authMethod': authMethod,
      'isLoggedIn': isLoggedIn,
      'streakDays': streakDays,
      'meditationMinutes': meditationMinutes,
      'totalListenHours': totalListenHours,
      'topDeity': topDeity,
      'totalSongsPlayed': totalSongsPlayed,
    };
  }

  factory UserProfile.fromMap(Map<String, dynamic> map) {
    return UserProfile(
      id: map['id'] ?? 'guest_user',
      name: map['name'] ?? 'Devotional Seeker',
      email: map['email'],
      phone: map['phone'],
      avatarUrl: map['avatarUrl'] ?? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      authMethod: map['authMethod'] ?? 'guest',
      isLoggedIn: map['isLoggedIn'] ?? false,
      streakDays: map['streakDays']?.toInt() ?? 7,
      meditationMinutes: map['meditationMinutes']?.toInt() ?? 108,
      totalListenHours: (map['totalListenHours'] as num?)?.toDouble() ?? 24.5,
      topDeity: map['topDeity'] ?? 'Lord Shiva',
      totalSongsPlayed: map['totalSongsPlayed']?.toInt() ?? 142,
    );
  }

  String toJson() => json.encode(toMap());

  factory UserProfile.fromJson(String source) => UserProfile.fromMap(json.decode(source));
}
