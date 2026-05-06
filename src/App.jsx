import React, { useState, useEffect } from "react"
import Header from "./components/Header"
import AIModal from "./components/AI"

const App = () => {
    const [tasks, setTasks] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

const addTasks = async () => {
    if (!input.trim() || loading) return
    setLoading(true)
    try {
        const res = await fetch('https://notes-api-production-2fc5.up.railway.app/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: input,
                done: 0
             })
        });
        if (!res.ok) throw new Error("POST failed")
        const newTask = await res.json()

        setTasks(prev => [...prev, newTask])

        setInput("")
    } catch (error) {
        alert("Ошибка. Не удалось добавить задачу")
    } finally {
        setLoading(false)
    }
};


const deleteTask = async (id) => {
    try {
        await fetch(`https://notes-api-production-2fc5.up.railway.app/notes/${id}`, {
            method: 'DELETE'
        });
        setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
        alert("Ошибка. Не удалось удалить задачу");
    }
};

const loadTasks = async () => {
    try {
        const response = await fetch('https://notes-api-production-2fc5.up.railway.app/notes');
        const data = await response.json();
        setTasks(data);
    } catch (error) {
        alert("Ошибка. Не удалось загрузить задачу");
    }
};

useEffect(() => {
    loadTasks();
}, []);

const toggleTask = async (task) => {
    try {
        const updatedDone = task.done ? 0 : 1

        await fetch(`https://notes-api-production-2fc5.up.railway.app/notes/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ done: updatedDone })
        });

        // обновляем UI
        setTasks(prev =>
            prev.map(t =>
                t.id === task.id ? { ...t, done: updatedDone } : t
            )
        )

    } catch (error) {
        alert("Ошибка при обновлении")
    }
    
}

console.log(tasks);

    return (
      <div>
         <Header />
         <div className="input-div">
         <input
         placeholder="Начни свои заметки здесь"
         value={input}
         onChange={(e) => setInput(e.target.value)}
         onKeyDown={(e) => {
            
            if (e.key === "Enter") {
                addTasks()
            }
         }}
          />
          
      <button
      className="ai-button" 
      onClick={() => setIsModalOpen(true)}>
        ✨
      </button>

      <AIModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
         <ul>
          {tasks.map((task) => (
    <li 
  key={task.id}
  onClick={() => toggleTask(task)}
>
  <span className={task.done ? "done" : ""}>
    {task.text}
  </span>

  <button 
    onClick={(e) => {
      e.stopPropagation()
      deleteTask(task.id)
    }}
  >
    &times;
  </button>
</li>
))}
            
         </ul>
      </div>
    )
    }

export default App
