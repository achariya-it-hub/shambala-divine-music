class ChatMessage {
  final String id;
  final String user;
  final String text;
  final String time;

  ChatMessage({
    required this.id,
    required this.user,
    required this.text,
    required this.time,
  });
}

class LiveStreamFeed {
  final String id;
  final String title;
  final String broadcaster;
  bool isLive;
  int listenerCount;
  final String coverUrl;
  final String audioUrl;
  final List<ChatMessage> chatMessages;

  LiveStreamFeed({
    required this.id,
    required this.title,
    required this.broadcaster,
    required this.isLive,
    required this.listenerCount,
    required this.coverUrl,
    required this.audioUrl,
    required this.chatMessages,
  });
}
