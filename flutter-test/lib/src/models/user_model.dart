class User {
  final String? id;
  final String? name;
  final String? email;
  final String? createdAt;
  final List<Post>? posts;

  const User({
    this.id, this.name, this.email, this.createdAt, this.posts
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
    id: json['id'],
    name: json['name'],
    email: json['email'],
    createdAt: json['createdAt'],
    posts: json['posts'] != null 
        ? (json['posts'] as List).map((i) => Post.fromJson(i)).toList() 
        : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'createdAt': createdAt,
      'posts': posts?.map((e) => e.toJson()).toList(),
    };
  }
}
