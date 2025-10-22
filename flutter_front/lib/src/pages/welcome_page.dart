import 'package:flutter/material.dart';
import 'package:flutter_front/src/pages/user_page.dart';

class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  // List of pages with titles so we can build the Drawer dynamically
  final pages = [
    {'title': 'Página 1', 'widget': const UserPage()},
  ];

  // Currently selected page index
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Welcome Page')),
      body: pages[_selectedIndex]['widget'] as Widget,
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const DrawerHeader(
                decoration: BoxDecoration(color: Colors.blue),
                child: Text(
                  'Navegación',
                  style: TextStyle(color: Colors.white, fontSize: 20),
                ),
              ),
              ...List.generate(pages.length, (i) {
                final title = pages[i]['title'] as String;
                return ListTile(
                  title: Text(title),
                  selected: i == _selectedIndex,
                  onTap: () {
                    setState(() {
                      _selectedIndex = i;
                    });
                    Navigator.of(context).pop();
                  },
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
