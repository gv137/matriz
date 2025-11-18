 // Chave para armazenar dados no LocalStorage
        const STORAGE_KEY = 'eisenhower_tasks';

        // Armazenamento de tarefas em memória
        let tasks = {
            1: [],
            2: [],
            3: [],
            4: []
        };

        // Carregar tarefas do LocalStorage
        function loadTasks() {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    tasks = JSON.parse(saved);
                    console.log('✅ Tarefas carregadas do armazenamento local');
                } catch (e) {
                    console.error('Erro ao carregar tarefas:', e);
                    tasks = { 1: [], 2: [], 3: [], 4: [] };
                }
            }
        }

        // Salvar tarefas no LocalStorage
        function saveTasks() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
                console.log('✅ Tarefas salvas automaticamente');
            } catch (e) {
                console.error('Erro ao salvar tarefas:', e);
                alert('Não foi possível salvar as tarefas. Seu navegador pode estar em modo privado.');
            }
        }

        // Adicionar tarefa
        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const quadrantSelect = document.getElementById('quadrantSelect');
            const taskText = taskInput.value.trim();
            const quadrant = quadrantSelect.value;

            if (taskText === '') {
                alert('Por favor, digite uma tarefa!');
                return;
            }

            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };

            tasks[quadrant].push(task);
            saveTasks();
            taskInput.value = '';
            taskInput.focus();
            renderTasks();
        }

        // Renderizar tarefas
        function renderTasks() {
            for (let q = 1; q <= 4; q++) {
                const taskList = document.getElementById(`tasks-${q}`);
                const count = document.getElementById(`count-${q}`);
                
                if (tasks[q].length === 0) {
                    taskList.innerHTML = '<div class="empty-state">Nenhuma tarefa neste quadrante</div>';
                    count.textContent = '0';
                } else {
                    taskList.innerHTML = tasks[q].map(task => `
                        <div class="task ${task.completed ? 'completed' : ''}">
                            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                                   onchange="toggleTask(${q}, ${task.id})">
                            <span class="task-text">${escapeHtml(task.text)}</span>
                            <button class="task-btn" onclick="deleteTask(${q}, ${task.id})">×</button>
                        </div>
                    `).join('');
                    count.textContent = tasks[q].length;
                }
            }
        }

        // Marcar tarefa como completa
        function toggleTask(quadrant, taskId) {
            const task = tasks[quadrant].find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            }
        }

        // Deletar tarefa
        function deleteTask(quadrant, taskId) {
            tasks[quadrant] = tasks[quadrant].filter(t => t.id !== taskId);
            saveTasks();
            renderTasks();
        }

        // Limpar todas as tarefas
        function clearAll() {
            if (confirm('Tem certeza que deseja limpar TODAS as tarefas? Esta ação não pode ser desfeita!')) {
                for (let q = 1; q <= 4; q++) {
                    tasks[q] = [];
                }
                saveTasks();
                renderTasks();
                alert('Todas as tarefas foram removidas!');
            }
        }

        // Escapar caracteres HTML para segurança
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Permitir adicionar tarefa com Enter
        document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Inicializar - Carregar dados salvos
        window.addEventListener('DOMContentLoaded', function() {
            loadTasks();
            renderTasks();
        });

        // Salvar dados ao sair da página (opcional - para mais segurança)
        window.addEventListener('beforeunload', function() {
            saveTasks();
        });