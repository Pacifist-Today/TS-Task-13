//Вам необхідно написати додаток Todo list. У списку нотаток повинні бути методи для додавання нового запису, видалення,
//редагування та отримання повної інформації про нотаток за ідентифікатором, а так само отримання списку всіх нотатік.
// Крім цього, у користувача має бути можливість позначити нотаток, як виконаний, і отримання інформації про те,
// скільки всього нотаток у списку і скільки залишилося невиконаними. Нотатки не повинні бути порожніми.

//Кожний нотаток має назву, зміст, дату створення і редагування та статус. Нотатки бувають двох типів.
// Дефолтні та такі, які вимагають підтвердження при ридагуванні (окремі класи).

//Окремо необхідно розширити поведінку списку та додати можливість пошуку нотатка по будь-якому філду,
//або у якості опції вказувати по якому саме вести пошук.

//Також окремо необхідно розширити список можливістю сортування нотаток за статусом або часом створення.


interface INote {
    id: string
    title: string
    text: string
    created: Date
    isCompleted: boolean
    changeState (): void
    update(value: INote): void
}

class TodoList {
    private readonly _todos: INote[] = []

    get todos (): INote[] {
        return this._todos
    }

    get todosQuantity (): number {
        return this._todos.length
    }

    get unfinishedTask (): number {
        return this._todos.filter(el => !el.isCompleted).length
    }

    add (task: INote): number {
        task.id = Math.floor(Math.random()).toString()

        this._todos.push(task)
        return this._todos.length
    }

    remove (id: string): void {
        if (!this._todos) throw new Error("Nothing to remove")

        this._todos.filter(el => el.id !== id)
    }

    update (id: string, payload: INote): void {
        const task = this._todos.find(el => el.id === id)

        if (!task) throw new Error("Nothing found")

        task.update(payload)
    }

    getNoteById (id: string): INote {
        const task = this._todos.find(el => el.id === id)

        if (!task) throw new Error("Nothing found")

        return task
    }

    changeStatus (id: string): void {
        const task = this._todos.find(el => el.id === id)

        if (!task) throw new Error("Nothing found")

        task.changeState()
    }

    searching (text: string): INote[] {
        if (!this._todos) throw new Error("Nothing to search")

        const reg = new RegExp(text, 'gi')

        return this._todos.filter(el => Object.values(el).join(' ').match(reg))
    }

    sortList (par: 'created' | 'isCompleted') {
        if (!this._todos) throw new Error("Nothing to sort")

        const arrToSort = [...this._todos]

        if (par === 'created') {
            arrToSort.sort((cur, next) => cur[par] > next[par] ? 1 : -1)
        } else {
            const filteredStatus = [...arrToSort]
            filteredStatus.filter(el => !el[par])
            arrToSort.filter(el => el[par])
            return filteredStatus.concat(arrToSort)
        }

        return arrToSort
    }

}

class Note implements INote{
    public readonly id!: string
    public readonly created: Date
    public isCompleted = false

    constructor (
        public title: string,
        public text: string,
    ) {
        this.created = new Date()
    }

    changeState (): void {
        this.isCompleted = !this.isCompleted
    }

    public update(task: Note): void {
        Object.assign(this, task)
    }
}

class NoteConfirm implements INote {
    public readonly id!: string
    public readonly created: Date
    public isCompleted = false


    constructor (
        public title: string,
        public text: string,
        public confirmation: () => boolean
    ) {
        this.created = new Date()
    }

    public changeState (): void {
        this.isCompleted = !this.isCompleted
    }

    public update(task: NoteConfirm): void {
        if (!this.confirmation()) return

        Object.assign(this, task)
    }
}

const note = new NoteConfirm("Hello", "World", confirm)

const todos = new TodoList().add(note)
























// enum EStatus {
//     done = 'done',
//     pending = 'pending',
//     canceled = 'canceled'
// }
//
// interface INote {
//     name: string;
//     description: string;
//     created: Date
//     status: EStatus
//     id: number | null
// }
//
// class TodoList {
//     _notes: INote[] = []
//     createTask: CreateTask
//     editTask: EditTask
//     sorting: Sort
//     searching: SearchBy
//
//     constructor (createTask: CreateTask, editTask: EditTask, sorting: Sort, searching: SearchBy) {
//         this.createTask = createTask
//         this.editTask = editTask
//         this.sorting = sorting
//         this.searching = searching
//     }
//
//     addNote (note: INote): void {
//         const task = this.createTask.addTask(note)
//         this.notes.push(task)
//     }
//
//     deleteNote (id: number): void  {
//         if (!this._notes) throw new Error ("There no tasks to delete")
//
//         this._notes.filter(note => note.id !== id)
//     }
//
//     editNote (id: number): void {
//         if (!this._notes) throw new Error ("There no tasks to edit")
//
//         const index = this._notes.findIndex(el => el.id === id)
//         const todos = this._notes[index]
//
//         if (!todos) throw new Error ("There no task to edit")
//
//         const editedTask = this.editTask.changeTask(todos)
//         this._notes[index] = editedTask
//     }
//
//     showNote (id: number): INote[] {
//         if (!this._notes) throw new Error ("There no tasks to show")
//
//         return this._notes.filter(note => note.id === id)
//     }
//
//     get notes (): INote[] {
//         if (!this._notes) throw new Error ("There no tasks to show")
//
//         return this._notes
//     }
//
//     makeDone (id: number): void {
//         if (!this._notes) throw new Error ("There no tasks to deal with")
//
//         this._notes.map(note => note.id === id ? note.status = EStatus.done : null)
//     }
//
//     showUndone (): string {
//         if (!this._notes) throw new Error ("There no tasks to show")
//
//         const undone = this._notes.filter(note => note.status === EStatus.pending)
//         return `${undone.length} undone tasks of ${this._notes.length}`
//     }
//
//     sortList (par: 'created' | "pending" | "done" | "canceled"): INote[] {
//         if (!this._notes) throw new Error ("Nothing to sort")
//
//         return this.sorting.sortTodos(this._notes, par)
//     }
//
//     searchInList (par: keyof INote, text: string): INote[] {
//         if (!this._notes) throw new Error ("Nothing to search")
//
//         return this.searching.search(this._notes, par, text)
//     }
// }
//
// class CreateTask {
//
//     addTask (task: INote) {
//         task.status = EStatus.pending
//
//         const taskValues = Object.values(task)
//
//         for (let i = 0; i < taskValues.length; i++) {
//             if(!taskValues[0]) throw new Error("Some field is empty!")
//         }
//
//         // task.id = +(Math.random() * 10000000000).toFixed()
//         task.id = 5
//
//         return task
//     }
// }
//
// class EditTask {
//
//     changeTask (task: INote) {
//         const form: INote = {
//             name: "games",
//             description: "everynight",
//             created: new Date(),
//             status: EStatus.pending,
//             id: null
//         }
//
//         form.id = task.id
//
//         const editedTask = this.saveChanges(form)
//         return editedTask
//     }
//
//     saveChanges (task: INote) {
//         const taskValues = Object.values(task)
//
//         for (let i = 0; i < taskValues.length; i++) {
//             if(!taskValues[0]) throw new Error("Some field is empty!")
//         }
//
//         return task
//     }
// }
//
// class Sort {
//     sortTodos (todos: INote[], par: "created" | "pending" | "done" | "canceled"): INote[] {
//         const arrToSort = [...todos]
//
//         if (par === 'created') {
//             arrToSort.sort((cur, next) => cur[par] > next[par] ? 1 : -1)
//         } else {
//             const filteredStatus = [...arrToSort]
//             filteredStatus.filter(el => el.status.toString() === par)
//             arrToSort.filter(el => el.status.toString() !== par)
//             return filteredStatus.concat(arrToSort)
//         }
//
//         return arrToSort
//     }
// }
//
// class SearchBy {
//     search (todos: INote[], par: keyof INote, text: string): INote[] {
//         if (par === 'id') throw new Error("You can't search by id")
//
//         const reg = new RegExp(text, 'gi')
//
//         return todos.filter(el => el[par].toString().match(reg))
//     }
// }
//
// const todoList = new TodoList(new CreateTask(), new EditTask(), new Sort(), new SearchBy())
//
// todoList.addNote({
//     name: "gym",
//     description: "everyday",
//     created: new Date(),
//     status: EStatus.pending,
//     id: null
// })
//
// console.log(todoList._notes)
//
// todoList.editNote(5)
//
// console.log(todoList._notes)
//
// todoList.sortList('pending')
//
// todoList.searchInList('name', 'games')