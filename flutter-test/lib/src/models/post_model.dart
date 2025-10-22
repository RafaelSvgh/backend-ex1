class Post {
  final String? id;
  final String? title;
  final String? content;
  final String? publishedAt;
  final User? user;

  const Post({
    this.id, this.title, this.content, this.publishedAt, this.user
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
    id: json['id'],
    title: json['title'],
    content: json['content'],
    publishedAt: json['publishedAt'],
    user: json['user'] != null 
        ? User.fromJson(json['user']) 
        : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'publishedAt': publishedAt,
      'user': user?.toJson(),
    };
  }
}
