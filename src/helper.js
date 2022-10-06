import {ActiveItems} from './stores/active'
import {CompletedItems} from './stores/completed'
import {ToDoItems} from './stores/store'

export class Helper {
    updateActive = (todo) => {
        ActiveItems.update(_currentItem => {
            let allActive = todo.filter(item => item.completed === false)
            return allActive
        })
    }
    
    clearCompleted = (completed) => {
        let ids = []
        completed.forEach(item => {
            ids.push(item.id)
        })

        ids.forEach(id=> {
            ToDoItems.update((currentItem)=> {
                return currentItem.filter(item => item.id != id)
            })
            CompletedItems.update((currentItem)=> {
                return currentItem.filter(item => item.id != id)
            })
        })

    }
}