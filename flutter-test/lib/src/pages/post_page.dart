import 'package:flutter/material.dart';
import '../models/post_model.dart';
import '../services/post_service.dart';

class PostPage extends StatefulWidget {
  const PostPage({super.key});

  @override
  State<PostPage> createState() => _PostPageState();
}

class _PostPageState extends State<PostPage> {
  final PostService _service = PostService();
  List<Post> _items = [];
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
      _showErrorDialog('Error loading posts: $e');
    }
  }

  Future<void> _showCreateDialog() async {
    await _showFormDialog(null);
  }

  Future<void> _showEditDialog(Post item) async {
    await _showFormDialog(item);
  }

  Future<void> _showFormDialog(Post? item) async {
    final _idController = TextEditingController();
    final _titleController = TextEditingController();
    final _contentController = TextEditingController();
    final _publishedAtController = TextEditingController();

    if (item != null) {
      _idController.text = item.id?.toString() ?? '';
      _titleController.text = item.title?.toString() ?? '';
      _contentController.text = item.content?.toString() ?? '';
      _publishedAtController.text = item.publishedAt?.toString() ?? '';
    }

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(item == null ? 'Create Post' : 'Edit Post'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _idController,
                decoration: InputDecoration(labelText: 'Id'),
              ),
              TextField(
                controller: _titleController,
                decoration: InputDecoration(labelText: 'Title'),
              ),
              TextField(
                controller: _contentController,
                decoration: InputDecoration(labelText: 'Content'),
              ),
              TextField(
                controller: _publishedAtController,
                decoration: InputDecoration(labelText: 'PublishedAt'),
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
                'title': _titleController.text,
                'content': _contentController.text,
                'publishedAt': _publishedAtController.text,
              });
              Navigator.pop(context);
            },
            child: Text(item == null ? 'Create' : 'Update'),
          ),
        ],
      ),
    );
  }

  Future<void> _saveItem(Post? existingItem, Map<String, dynamic> data) async {
    try {
      final item = Post.fromJson(data);
      
      if (existingItem == null) {
        await _service.create(item);
      } else {
        await _service.update(existingItem.id!, item);
      }
      
      await _loadItems();
    } catch (e) {
      _showErrorDialog('Error saving post: $e');
    }
  }

  Future<void> _deleteItem(Post item) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: Text('Are you sure you want to delete this post?'),
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
        _showErrorDialog('Error deleting post: $e');
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
        title: Text('Posts'),
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
                      title: Text(item.title?.toString() ?? 'No name'),
                      subtitle: Text('Id: ${item.id ?? "N/A"} | Content: ${item.content ?? "N/A"}'),
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
