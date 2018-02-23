// this is a concept, how it could work

// store somewhere data about tasks, possibly in json
const tasks = [{
  name: 'do some',
  id: 'dosome',
  description: 'do some',
  requirements: [{
    type: 'task',
    id: 'do else'
  }]
}, {
  name: 'do else',
  id: 'do else',
  description: 'do else',
  requirements: []
}];

// general task class
class Task {
  constructor(id, name, description, requirements) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.requirements = requirements; // it has many requirements, for example other tasks
  }
}

// general role class
class Role {
  constructor(name, description, tasks) {
    this.name = name;
    this.description = description;
    this.tasks = tasks || []  // it has many tasks
  }


  registerTask(task) {
    this.tasks.push(task);
  }

}

class Game {
  constructor(name, description, roles) {
    this.name = name;
    this.description = description;
    this.roles = roles || []; // it has many roles
  }

  get tasks() { // tasks getter to make work with tasks easier
    let tasks = [];
    this.roles.forEach(role => {
      tasks = [...tasks, ...role.tasks]
    });
    return tasks;
  }

  get incompleteRoles() {

  }

  get orphanTasks() { // orphanTasks getter. Find all tasks that dont have requirements met on this game.
    const orphanTasks = [];
    this.tasks.forEach(task => {
      task.requirements.forEach(requirement => {
        const associatedTask = this.tasks.find(task => task.id === requirement.id);
        if (!associatedTask) {
          orphanTasks.push(task);
        }
      })
    });
    return orphanTasks;
  }

  registerRole(role) {
    this.roles.push(role);
  }
}

// foo implementation just for demonstration purposes

// crate two tasks
const taskA = new Task(tasks[0].id, tasks[0].name, tasks[0].description, tasks[0].requirements);
const taskB = new Task(tasks[1].id, tasks[1].name, tasks[1].description, tasks[1].requirements);
// create two roles
const roleA = new Role('aaa', 'bebebe');
roleA.registerTask(taskA);
const roleB = new Role('aaa', 'bebebe');
roleB.registerTask(taskB);
// create game with two roles
const gameA = new Game('aaaa', 'gagme gem gem');
gameA.registerRole(roleA);
gameA.registerRole(roleB); // try to remove roleB and see!
//good job, no orphan tasks
console.log(gameA.orphanTasks);
