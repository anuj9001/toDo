let todos = [];
        let currentFilter = 'all';

        // Load todos from memory on page load
        document.addEventListener('DOMContentLoaded', () => {
            loadTodos();
            render();
        });

        // Event listeners
        document.getElementById('addBtn').addEventListener('click', addTodo);
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });

        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                setFilter(e.target.dataset.filter);
            });
        });

        document.getElementById('clearCompleted').addEventListener('click', clearCompleted);

        // Functions
        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();
            
            if (text === '') {
                alert('Please enter a task');
                return;
            }

            const todo = {
                id: Date.now(),
                text: text,
                completed: false
            };

            todos.push(todo);
            input.value = '';
            saveTodos();
            render();
        }

        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodos();
                render();
            }
        }

        function deleteTodo(id) {
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            render();
        }

        function setFilter(filter) {
            currentFilter = filter;
            
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.filter === filter) {
                    tab.classList.add('active');
                }
            });
            
            render();
        }

        function clearCompleted() {
            todos = todos.filter(t => !t.completed);
            saveTodos();
            render();
        }

        function getFilteredTodos() {
            if (currentFilter === 'active') {
                return todos.filter(t => !t.completed);
            } else if (currentFilter === 'completed') {
                return todos.filter(t => t.completed);
            }
            return todos;
        }

        function render() {
            const todoList = document.getElementById('todoList');
            const filteredTodos = getFilteredTodos();
            
            if (filteredTodos.length === 0) {
                todoList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <p>${getEmptyMessage()}</p>
                    </div>
                `;
                updateStats();
                return;
            }

            todoList.innerHTML = filteredTodos.map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}">
                    <div class="checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                    <div class="todo-actions">
                        <button class="btn-icon btn-delete" onclick="deleteTodo(${todo.id})" aria-label="Delete">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');

            updateStats();
        }

        function getEmptyMessage() {
            if (currentFilter === 'active') {
                return 'No active tasks. Great job!';
            } else if (currentFilter === 'completed') {
                return 'No completed tasks yet.';
            }
            return 'No tasks yet. Add one to get started!';
        }

        function updateStats() {
            const activeCount = todos.filter(t => !t.completed).length;
            const countText = activeCount === 1 ? '1 item left' : `${activeCount} items left`;
            document.getElementById('todoCount').textContent = countText;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function saveTodos() {
            // Using in-memory storage only (no localStorage in sandbox environment)
            // Todos persist during the session
        }

        function loadTodos() {
            // In a real application, this would load from localStorage
            // For this sandbox environment, we start with an empty array
            todos = [];
        }
