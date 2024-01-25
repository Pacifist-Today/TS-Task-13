enum EStatus {
    done = 'done',
    pending = 'pending',
    canceled = 'canceled'
}

interface INote {
    name: string;
    description: string;
    created: Date
    status: EStatus
    id: number | null
}

class TodoList {
    _notes: INote[] = []
    createTask: CreateTask
    editTask: EditTask
    sorting: Sort
    searching: SearchBy

    constructor (createTask: CreateTask, editTask: EditTask, sorting: Sort, searching: SearchBy) {
        this.createTask = createTask
        this.editTask = editTask
        this.sorting = sorting
        this.searching = searching
    }

    addNote (note: INote): void {
        const task = this.createTask.addTask(note)
        this.notes.push(task)
    }

    deleteNote (id: number): void  {
        if (!this._notes) throw new Error ("There no tasks to delete")

        this._notes.filter(note => note.id !== id)
    }

    editNote (id: number): void {
        if (!this._notes) throw new Error ("There no tasks to edit")

        const index = this._notes.findIndex(el => el.id === id)
        const todos = this._notes[index]

        if (!todos) throw new Error ("There no task to edit")

        const editedTask = this.editTask.changeTask(todos)
        this._notes[index] = editedTask
    }

    showNote (id: number): INote[] {
        if (!this._notes) throw new Error ("There no tasks to show")

        return this._notes.filter(note => note.id === id)
    }

    get notes (): INote[] {
        if (!this._notes) throw new Error ("There no tasks to show")

        return this._notes
    }

    makeDone (id: number): void {
        if (!this._notes) throw new Error ("There no tasks to deal with")

        this._notes.map(note => note.id === id ? note.status = EStatus.done : null)
    }

    showUndone (): string {
        if (!this._notes) throw new Error ("There no tasks to show")

        const undone = this._notes.filter(note => note.status === EStatus.pending)
        return `${undone.length} undone tasks of ${this._notes.length}`
    }

    sortList (par: 'created' | "pending" | "done" | "canceled"): INote[] {
        if (!this._notes) throw new Error ("Nothing to sort")

        return this.sorting.sortTodos(this._notes, par)
    }

    searchInList (par: keyof INote, text: string): INote[] {
        if (!this._notes) throw new Error ("Nothing to search")

        return this.searching.search(this._notes, par, text)
    }
}

class CreateTask {

    addTask (task: INote) {
        task.status = EStatus.pending

        const taskValues = Object.values(task)

        for (let i = 0; i < taskValues.length; i++) {
            if(!taskValues[0]) throw new Error("Some field is empty!")
        }

        // task.id = +(Math.random() * 10000000000).toFixed()
        task.id = 5

        return task
    }
}

class EditTask {

    changeTask (task: INote) {
        const form: INote = {
            name: "games",
            description: "everynight",
            created: new Date(),
            status: EStatus.pending,
            id: null
        }

        form.id = task.id

        const editedTask = this.saveChanges(form)
        return editedTask
    }

    saveChanges (task: INote) {
        const taskValues = Object.values(task)

        for (let i = 0; i < taskValues.length; i++) {
            if(!taskValues[0]) throw new Error("Some field is empty!")
        }

        return task
    }
}

class Sort {
    sortTodos (todos: INote[], par: "created" | "pending" | "done" | "canceled"): INote[] {
        const arrToSort = [...todos]

        if (par === 'created') {
            arrToSort.sort((cur, next) => cur[par] > next[par] ? 1 : -1)
        } else {
            const filteredStatus = [...arrToSort]
            filteredStatus.filter(el => el.status.toString() === par)
            arrToSort.filter(el => el.status.toString() !== par)
            return filteredStatus.concat(arrToSort)
        }

        return arrToSort
    }
}

class SearchBy {
    search (todos: INote[], par: keyof INote, text: string): INote[] {
        if (par === 'id') throw new Error("You can't search by id")

        const reg = new RegExp(text, 'gi')

        return todos.filter(el => el[par].toString().match(reg))
    }
}

const todoList = new TodoList(new CreateTask(), new EditTask(), new Sort(), new SearchBy())

todoList.addNote({
    name: "gym",
    description: "everyday",
    created: new Date(),
    status: EStatus.pending,
    id: null
})

console.log(todoList._notes)

todoList.editNote(5)

console.log(todoList._notes)

todoList.sortList('pending')

todoList.searchInList('name', 'games')