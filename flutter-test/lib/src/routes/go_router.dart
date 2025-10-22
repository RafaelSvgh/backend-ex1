import 'package:flutter_front/src/pages/welcome_page.dart';
import 'package:go_router/go_router.dart';
import '../pages/user_page.dart';
import '../pages/post_page.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (context, state) => const WelcomePage()),
    GoRoute(
      path: '/user',
      builder: (context, state) => const UserPage(),
    ),
    GoRoute(
      path: '/post',
      builder: (context, state) => const PostPage(),
    ),
  ],
);
