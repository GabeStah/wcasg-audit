import createClient from 'pa11y-webservice-client-node';

// Create client with the base URL of the web-service
const client = createClient('https://audit.widget.wcasg.solarix.dev:3000/');

// Create a task
client.tasks.create({
  name: 'Nature Home Page',
  url: 'nature.com',
  standard: 'WCAG2AA'
}, function (err, task) {
  // task  =  object representing the new task, or null if an error occurred
  console.log(err);
  console.log(task);
});

// Get all tasks
client.tasks.get({}, function (err, tasks) {
  // tasks  =  array of objects representing tasks, or null if an error occurred
  console.log(err);
  console.log(tasks);
});
