document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // Weather App Logic
    // ==========================================
    const cityInput = document.getElementById('city-input');
    const searchWeatherBtn = document.getElementById('search-weather-btn');
    const weatherResult = document.getElementById('weather-result');
    const weatherError = document.getElementById('weather-error');
    
    // OpenWeatherMap API Key Placeholder
    const apiKey = 'YOUR_API_KEY_HERE'; 

    async function fetchWeather(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API Key. Using mock data for demonstration.');
                }
                throw new Error('City not found. Please try again.');
            }
            
            const data = await response.json();
            displayWeather(data);
            localStorage.setItem('lastCity', city);
            weatherError.style.display = 'none';
        } catch (error) {
            if (error.message.includes('mock data') || apiKey === 'YOUR_API_KEY_HERE') {
                // Mock data fallback if API key is not provided
                displayWeather({
                    name: city,
                    weather: [{ icon: '01d' }],
                    main: { temp: 22.5, humidity: 60 },
                    wind: { speed: 3.5 }
                });
                localStorage.setItem('lastCity', city);
                weatherError.style.display = 'none';
            } else {
                weatherError.textContent = error.message;
                weatherError.style.display = 'block';
                weatherResult.style.display = 'none';
            }
        }
    }

    function displayWeather(data) {
        document.getElementById('weather-city').textContent = data.name;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        document.getElementById('weather-temp').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('weather-wind').textContent = `${data.wind.speed} m/s`;
        weatherResult.style.display = 'block';
    }

    if (searchWeatherBtn) {
        searchWeatherBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeather(city);
            }
        });
    }

    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = cityInput.value.trim();
                if (city) fetchWeather(city);
            }
        });
    }

    const lastCity = localStorage.getItem('lastCity');
    if (lastCity && cityInput) {
        cityInput.value = lastCity;
        fetchWeather(lastCity);
    }


    // ==========================================
    // Todo List App Logic
    // ==========================================
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        if (!todoList) return;
        todoList.innerHTML = '';
        
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="edit-btn">✎</button>
                    <button class="delete-btn">🗑</button>
                </div>
            `;

            // Toggle Complete
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                todo.completed = checkbox.checked;
                saveTodos();
                renderTodos();
            });

            // Edit Task
            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit task:', todo.text);
                if (newText !== null && newText.trim() !== '') {
                    todo.text = newText.trim();
                    saveTodos();
                    renderTodos();
                }
            });

            // Delete Task
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
            });

            todoList.appendChild(li);
        });
    }

    if (todoForm) {
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = todoInput.value.trim();
            if (text) {
                todos.push({
                    id: Date.now().toString(),
                    text,
                    completed: false
                });
                saveTodos();
                todoInput.value = '';
                renderTodos();
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderTodos();
        });
    });

    renderTodos();
});
