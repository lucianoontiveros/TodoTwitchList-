

# INTRODUCCION
Este es el bot del canal de cuarto de chenz, la idea era poder hacer algo minimalista y representativo en cuanto a roles que desempeñan las distintas personas del chat. Estas es una de las tantas versiones realizadas, pero la primera que esta alojada en un host. En el canal de pruebas venimos chequeando algunas funcionalidades que son simples como cualquier Todolist, que la complicación está en como se integra tmi.js y como se alojan las tareas en el local host.

[![image.png](https://i.postimg.cc/G2jVNbRL/image.png)](https://postimg.cc/Q9HfKGVw)

## EJECUCIÓN
El componente está realizado con React a través de vite. Lo subimos con intención de hacer modificaciones y tests desde vercel con el canal de pruebas, por lo cual es compatible para dejarlo alojado allí con las variables de entorno correspondiente.

Su funcionalidad es gestionar la tarea de los usuarios que participan de los directos de Study with me, mostrando su listado de tareas en pantalla en algunas de las escenas y funcionando a la vez en el chat los mensajes predefinidos en cada situación. La novedad con respecto a otros bots de estas características, es que cada tarea tiene un ID que se utilizará para marcar o eliminarlas de un modo mas práctico para los usuarios.  Su antecesor mostraba un número de orden que hacía que tengamos que actualizar el listado para ver que posición le correspondía a cada tarea y así poder interactuar.

[![image.png](https://i.postimg.cc/RCpJMsT9/image.png)](https://postimg.cc/YjgCRxVy)

Se mostrará en distinto colores la tipografía de acuerdo al rol de cada usuario, si es moderador, vip, si tiene Prime video independiente si está suscripto o no al canal, y por supuesto a los que están en condición de suscriptores apoyando el canal. Es una forma de darle reconocimiento a su participación.

## COMANDOS

**- !tarea + más la descripción de la tarea:** Ingresando el comando junto con su correspondiente descripción, la misma quedará registrada y un mensaje vía chat avisará que se complió con la petición.

**- !lista:** Ingresando este comando se desplegará en pantalla la lista de tareas, como también se expondrá en el chat. De no tener tareas registradas habrá un aviso informando la situación.

**- !eliminar + ID :** Ingresando el comando más el ID la tarea vinculada se elimina.

**- !marcar + ID:** Ingresando el comando más el ID la tarea vinculada se marca como realizada.

**- !task + task description:** By entering the command and then the description the task will be logged and the log will be displayed on the screen and in the chat.

**- !list:** Displays on screen and in the chat the list of pending tasks. If no task is registered, a message via chat will inform that there are no activities.

**- !delete + ID:** Entering the command and adding the ID will allow you to delete the linked task.

**- !check + ID:** Entering the command to the chat and adding the corresponding ID will allow you to mark your task as done.

**- !clear:** Ingresando este comando se borran todas las tareas. / Entering this command deletes all tasks.

**- !pickup:** ingresando este comando se marcan todas las tareas. / by entering this command all tasks are marked.
