Brief Summary Notes of the Solution
===
**Remember**: *Follow these instruction `step by step`.*
***Teachnologies using: `MEAN stack.`***
#### Table of Content

- [TOC]

# References
- [Loopback-Angular SDK](http://loopback.io/doc/en/lb3/AngularJS-JavaScript-SDK.html)
- [Loopback-angular example app](http://loopback.io/doc/en/lb3/Angular-example-app.html)
- [Auto-generate lAngular $resource services](http://loopback.io/doc/en/lb3/AngularJS-Grunt-plugin.html)

# Development Evironment

## Step 1: Install Node
`Using package manager`
- [For Debian and Ubuntu users](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
- [For OSX users](https://nodejs.org/en/download/package-manager/#osx)
- [For Windows users](https://nodejs.org/en/download/package-manager/#windows)

Or [nvm](https://github.com/creationix/nvm)

## Step 2: Install compiler tools
### Overview

	If you don’t have a C++ compiler (Visual C++ on Windows or XCode on OSX) and associated command-line tools, you won’t be able to view most useful metrics, and you won’t be able to perform CPU profiling or take heap snapshots. 


> **Important**: If you ==don’t have compiler tools==, when you run your application, you may ==see== error messages such as “strong-agent could not load optional native add-on”.

```
To eliminate the error messages and enable monitoring and tracing features, install the appropriate C++ compiler and related tools as described below.
```

- [Linux](https://loopback.io/doc/en/lb3/Installing-compiler-tools.html#linux)
- [Windows](https://loopback.io/doc/en/lb3/Installing-compiler-tools.html#windows)
- [MacOS](https://loopback.io/doc/en/lb3/Installing-compiler-tools.html#macos)

## Step 3: Install Strongloop

> **Important**: StrongLoop Arc and slc are no longer under active development, and will soon be deprecated. Arc’s features are being included in the IBM API Connect Developer Toolkit.

	If you’re new to LoopBack, install the LoopBack CLI tool instead. It supports both LoopBack 2.x and 3.x.

 - [Linux](https://loopback.io/doc/en/lb3/Installing-on-Linux.html#install-strongloop-)
 
- [Strongloop] `npm install -g strongloop`

Notice the `-g ` option. It means your strongloop installation will be `global`. Strongloop will also be added in the PATH, so you can run it from anywhere.

## Step 4: MongoDB

`sudo apt-get -y install mongodb`

```bash
// Start the server with port issue
sudo service mongodb stop
sudo mongod
```

# Hello World App

#### 1. Create new project
`slc loopback`

```
     _-----_     
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Let's create a LoopBack │
   `---------´   │       application!       │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? What's the name of your application? Todos
? Which version of LoopBack would you like to use? 2.x (long term support)
? What kind of application do you have in mind? api-server (A LoopBack API server with local User aut
h)

```

#### 2. Create Datasource
`slc loopback:datasource`

Drop database:
`mongo <dbname> --eval "db.dropDatabase()"`

Change db path
`mongod --dbpath /usr/local/mongodb-data`
`mongod --dbpath ~/Desktop/Code/MongoDB/db`

```
slc loopback:datasource
? Enter the data-source name: mongoDB
```
*Connector: mongoDB*

```
? Select the connector for mongoDB: 
  In-memory db (supported by StrongLoop) 
  IBM DB2 (supported by StrongLoop) 
  IBM Cloudant DB (supported by StrongLoop) 
❯ MongoDB (supported by StrongLoop)
  MySQL (supported by StrongLoop) 
  PostgreSQL (supported by StrongLoop) 
  Oracle (supported by StrongLoop) 
(Move up and down to reveal more choices)
```

#### 3. Create Models

```
slc loopback:model
? Enter the model name: todos
? Select the data-source to attach todos to: 
  db (memory) 
❯ mongoDB (mongodb) 
  (no data-source) 
```

```
$:~/Desktop/Code/Loopback projects/Todos$ slc loopback:model
? Enter the model name: todos
? Select the data-source to attach todos to: mongoDB (mongodb)
? Select model's base class PersistedModel
? Expose todos via the REST API? Yes
? Custom plural form (used to build REST URL): 
? Common model or server only? server
Let's add some todos properties now.
```

#### 4. Let's add some Relation

```
$ slc loopback:relation
? Select the model to create the relationship from: todos
? Relation type: 
  has many 
  belongs to 
  has and belongs to many 
❯ has one 
```
```
? Choose a model to create a relationship with: (other)
? Enter the model name: User
? Enter the property name for the relation: users
? Optionally enter a custom foreign key: 
```

#### 5. Access Control Lists

==First of all, deny all Access Control Lists of all existing Models.==

```
$ slc loopback:acl
? Select the model to apply the ACL entry to: (all existing models)
? Select the ACL scope: All methods and properties
? Select the access type: All (match all types)
? Select the role All users
? Select the permission to apply (Use arrow keys)
❯ Explicitly grant access 
  Explicitly deny access 
```


```
slc loopback:acl 
? Select the model to apply the ACL entry to: todos
? Select the ACL scope: All methods and properties
? Select the access type: Read
? Select the role The user owning the object
? Select the permission to apply Explicitly grant access
slc loopback:acl 
? Select the model to apply the ACL entry to: todos
? Select the ACL scope: A single method
? Enter the method name create
? Select the role Any authenticated user
? Select the permission to apply Explicitly grant access
slc loopback:acl
? Select the model to apply the ACL entry to: todos
? Select the ACL scope: All methods and properties
? Select the access type: Write
? Select the role The user owning the object
? Select the permission to apply Explicitly grant access
```
 After we set access control for `todos`, our `todos.json`  looks like this:

```JSON
{
  "name": "todos",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string"
    },
    "completed": {
      "type": "boolean",
      "default": false
    },
    "note": {
      "type": "string"
    },
    "updated_at": {
      "type": "date",
      "defaultFn": "now"
    }
  },
  "validations": [],
  "relations": {
    "users": {
      "type": "hasOne",
      "model": "User",
      "foreignKey": ""
    }
  },
  "acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    {
      "accessType": "READ",
      "principalType": "ROLE",
      "principalId": "$owner",
      "permission": "ALLOW"
    },
    {
      "accessType": "EXECUTE",
      "principalType": "ROLE",
      "principalId": "$authenticated",
      "permission": "ALLOW",
      "property": "create"
    },
    {
      "accessType": "WRITE",
      "principalType": "ROLE",
      "principalId": "$owner",
      "permission": "ALLOW"
    }
  ],
  "methods": {}
}
```
