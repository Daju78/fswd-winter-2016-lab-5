
# Full Stack Web Development - Lab 5: All Your (Data)Base Are Belong To Us

You installed postgres, right? (`brew cask install postgres` and `brew
install postgresql`)

Now:

1. Fork the repository to your own Github account.
2. Clone your fork to your own machine.
3. Navigate to the clone on your machine and run `npm install`
4. Then run `npm run dev_db_create`

## Concepts for today

* **SQL** as a structured language for storing, retrieving and updating persistent data
* **ORM** (Object-Relational Mapping). A layer on top of the database that allows the programmer to more easily retrieve and manipulate the data contained in it.
* **CRUD**: Create, Read, Update, Delete. The four primary database operations.
* **Migrations**: Repeatable ways to alter your database structure and the data within it

## Let's look at the database!

Now install [pgAdmin](http://pgadmin.org) by running `brew cask
install pgadmin3`. Then open it with `open
~/Applications/pgAdmin3.app`. In the `File` menu, select `Add
Server...`. Enter `localhost` for the name and host and click 'OK'.

![pgAdmin3](./pgAdmin_III_and_pgAdmin__PostgreSQL_administration_and_management_tools.png)

# Exercise!

We want to add a column to the tasks table to track when a particular task was completed (and therefore also be able to tell *if* it was completed). To do that, create a new database migration with sequelize.

1. Open `migrations/20160228202524-create-task.js` and `models/task.js` in your text editor. This is the migration that creates the initial `Task` table using [`queryInterface.createTable`](http://docs.sequelizejs.com/en/latest/docs/migrations/#createtabletablename-attributes-options) and the model (the JavaScript side of the **ORM** layer) that was created at the same time.
2. Run `npm run sequelize -- help`
3. Run `npm run sequelize -- help:migration:create`
4. To create a migration, we need to give it a name. Run `npm run sequelize -- migration:create --name AddCreateToTask`
5. The output from that command will include the migration file that was created (something like `migrations/20160525193115-AddCreatedAtToTask.js`). Open it up in your text editor.
6. Using the functions [`queryInterface.addColumn`](http://docs.sequelizejs.com/en/latest/docs/migrations/#addcolumntablename-attributename-datatypeoroptions-options) and [`queryInterface.removeColumn`](http://docs.sequelizejs.com/en/latest/docs/migrations/#removecolumntablename-attributename-options), update the migration to add/remove a `createdAt` column on the `Tasks` table. (Hint: don't forget to check out the [list of data types](http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types))
7. When you feel confident that your migration changes are correct, you can test your migration by running `npm run sequelize -- db:migrate`.
8. Refresh your view of the table and see your changes!

## Links

* [Sequelize DataTypes](http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types)
* [Sequelize Validations](http://docs.sequelizejs.com/en/latest/docs/models-definition/#validations)
* [Sequelize Hooks](http://docs.sequelizejs.com/en/latest/api/hooks/)
* [Sequelize Model methods](http://docs.sequelizejs.com/en/latest/docs/models-usage/)
* [Sequelize Querying](http://docs.sequelizejs.com/en/latest/docs/querying/)
