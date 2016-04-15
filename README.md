OpenEddi
========

OpenEddi is a next-generation data collection software package. It was born out of the need to collect the wide range of complex social network data. But these needs have created a concept which will collect a nearly endless variety of different data.

**Version 0.0.2**
* Data export is implemented
* Alter interpreters are implemented
* Planning a few different options for collecting alter-alter ties
* There is some framework built for designing / editing pools, but it is far from complete

Installation
=====

**System dependencies**
On a clean install of Ubuntu, this is how an install goes.

First install Node.js and NPM:
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install nodejs-legacy
sudo apt-get install npm
```

OpenEddi uses PostgreSQL:
```
sudo apt-get install postgresql
```

Git isn't really necessary but it's helpful when you try to fetch and update the software.
```
sudo apt-get install git
```

Screen isn't in Ubuntu by default (why not!?) but it's incredibly useful when launching OpenEddi and then returning to it.
```
sudo apt-get install screen
```

Now install bower, which we'll need for installing the other dependencies.
```
sudo npm install bower -g
```

**Database**

Set up the database and database user. Create a user and password. The username and password for the database can be changed in the config file for OpenEddi if you don't want to use the u/p here.

```
sudo -i -u postgres
createuser openeddi
```

Then enter postgres and create a database and create a user entry.

```
psql
create database openeddi;
alter user openeddi password 'openeddi';
\q
```

Now exit the postgres user.
```
exit
```

**Install OpenEddi**

Pull the openeddi software from the repository and pull all the necessary libraries.

```
git clone https://github.com/jfaganUK/openeddi3.git
cd openeddi3
sudo npm install
```

Installing the NPM dependencies (mostly server dependencies) will take a bit. Then go into the main OE folder and run the client dependencies.

```
cd oe/
bower install
```

Configure the Log File
======================

This is the config file for OpenEddi is located in ```./oe/config.json```.

```
{
  "db": {
    "forceSync": false,
    "database": "openeddi",
    "username": "openeddi",
    "password": "openeddi"
  },
  "adminAccount": {
    "username": "admin",
    "password": "changeThisPassword",
    "email": "admin@changeThisEmail.com",
    "firstName": "Admin",
    "lastName": "McAdmin"
  },
  "appPort": 4444
}
```

The first part is the database settings. If ```forceSync``` is **true** it will ***completely wipe the database***. This can be useful on occasion but there is no confirmation before you use it. Only use it when you need to clear out the database for some reason.
 
It is recommended that you change the default admin password.

The ```appPort``` changes the port that the server listens on. If you have multiple instances of OpenEddi running (as I sometimes do) you may need to run them on different ports.

Launching OpenEddi
==================

Now that OpenEddi is installed and configured you should be able to launch it using Node.js. Change directory to where OpenEddi is installed and launch using ```node```.

```
cd ~/openeddi3
node server.js
```

If you want to create a screen instance and pipe to a log:

```
screen -S openeddi -L
node server.js
```

You can then exit the screen without quitting OpenEddi by pressing [CTRL]-[A] then [D]. You can resume the instance by typing:

```
screen -R openeddi
```
