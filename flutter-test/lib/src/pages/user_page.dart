import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/user_service.dart';

class UserPage extends StatefulWidget {
  const UserPage({super.key});

  @override
  State<UserPage> createState() => _UserPageState();
}

class _UserPageState extends State<UserPage> {
  final UserService _service = UserService();
  List<User> _items = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  Future<void> _loadItems() async {
    try {
      final items = await _service.getAll();
      setState(() {
        _items = items;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showErrorDialog('Error loading users: $e');
    }
  }

  Future<void> _showCreateDialog() async {
    await _showFormDialog(null);
  }

  Future<void> _showEditDialog(User item) async {
    await _showFormDialog(item);
  }

  Future<void> _showFormDialog(User? item) async {
    final _idController = TextEditingController();
    final _nameController = TextEditingController();
    final _emailController = TextEditingController();
    final _createdAtController = TextEditingController();

    if (item != null) {
      _idController.text = item.id?.toString() ?? '';
      _nameController.text = item.name?.toString() ?? '';
      _emailController.text = item.email?.toString() ?? '';
      _createdAtController.text = item.createdAt?.toString() ?? '';
    }

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(item == null ? 'Create User' : 'Edit User'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _idController,
                decoration: InputDecoration(labelText: 'Id'),
              ),
              TextField(
                controller: _nameController,
                decoration: InputDecoration(labelText: 'Name'),
              ),
              TextField(
                controller: _emailController,
                decoration: InputDecoration(labelText: 'Email'),
              ),
              TextField(
                controller: _createdAtController,
                decoration: InputDecoration(labelText: 'CreatedAt'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              await _saveItem(item, {
                'id': _idController.text,
                'name': _nameController.text,
                'email': _emailController.text,
                'createdAt': _createdAtController.text,
              });
              Navigator.pop(context);
            },
            child: Text(item == null ? 'Create' : 'Update'),
          ),
        ],
      ),
    );
  }

  Future<void> _saveItem(User? existingItem, Map<String, dynamic> data) async {
    try {
      final item = User.fromJson(data);
      
      if (existingItem == null) {
        await _service.create(item);
      } else {
        await _service.update(existingItem.id!, item);
      }
      
      await _loadItems();
    } catch (e) {
      _showErrorDialog('Error saving user: $e');
    }
  }

  Future<void> _deleteItem(User item) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: Text('Are you sure you want to delete this user?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await _service.delete(item.id!);
        await _loadItems();
      } catch (e) {
        _showErrorDialog('Error deleting user: $e');
      }
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Users'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showCreateDialog,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadItems,
              child: ListView.builder(
                itemCount: _items.length,
                itemBuilder: (context, index) {
                  final item = _items[index];
                  return Card(
                    margin: const EdgeInsets.all(8.0),
                    child: ListTile(
                      title: Text(item.name?.toString() ?? 'No name'),
                      subtitle: Text('Id: ${item.id ?? "N/A"} | Email: ${item.email ?? "N/A"}'),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit),
                            onPressed: () => _showEditDialog(item),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete),
                            onPressed: () => _deleteItem(item),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
