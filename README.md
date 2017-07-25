## Project Background

Building a geospatial web development stack. The purpose of this project was to build a geospatial enabled web stack from Operating System to final web map. A goal was to touch as many modern frameworks as possible. In short, this project is primarily a REST api that serves complex GeoJSON polygons from various sources. The front-end of the application communicates with the REST API to get data and display on a Leaflet.js map. I wanted to compare performance between static GeoJSON files on the server, PostgreSQL/PostGIS queries and queries from MongoDB, a fast noSQL document database.

Demo [map](http://104.236.16.91:8641/):

![http://104.236.16.91:8641/](http://storage6.static.itmages.com/i/17/0724/h_1500923403_9513361_eba9dd45f7.png)

Federal land geojson polygons can be shown/hidden by clicking the checkboxes. There are 4 data sources, which can be be switched with the buttons in the legend.

  * GEOJSON static files on the web server
  * POSTGIS Geospatial queries
    * ST_SimplifyPreserveTopology and ST_MakeEnvelope used
    * Requires query on each map zoom/pan
  * POSTGRESQL queries (no PostGIS) for comparison to MongoDB
  * MONGODB queries

![](http://storage9.static.itmages.com/i/17/0725/h_1500998724_1432167_ebce238242.png)

## Web Stack
* [Operating System](#operating-system)
  * Linux 17.04 minimal install
    * [Sudo user setup (geodevadmin)](#sudo-user-setup-geodevadmin)
* [Backend](#backend)
  * [PostgreSQL](#install-postgresql) - Powerful, open source object-relational database system. [link](https://www.postgresql.org/)
    * [PostGIS](#install-postgis) - Geospatial database extender for PostgreSQL. [link](http://postgis.net/)
    * [PostgreSQL database administration](#postgresql-database-administration)
  * [MongoDB](#mongodb) - Document database (noSQL) based on scalability and flexibility. [link](https://www.mongodb.com/)
* [Web framework](#web-framework)
  * [Install NVM](#install-nvm) - Simple bash script to manage multiple active Node.js versions [link](https://github.com/creationix/nvm)
  * [Install Node.js](#install-node) - Runtime built on Chrome's V8 JavaScript engine. [link](https://nodejs.org/)
  * [Git](#git) - Version control. [link](https://git-scm.com/)
  * [Clone geodev-node-rest application](#clone-geodev-node-rest-application)
    * [Application set up](#application-set-up)
    * [Key Packages](#key-packages)
      * [Express.js](#express) - Web framework for Node.js. [link](https://expressjs.com/)
      * [Knex.js](#knex) - Query builder for PostgreSQL/Node.js. [link](http://knexjs.org/)
      * [Mongoose.js](#mongoose) - Object modeler for MongoDB/Node.js. [link](http://mongoosejs.com/)
      * [Joi.js](#joi) - Validator for JavaScript objects. [link](http://mongoosejs.com/)
  * [Populate PostgreSQL tables](#populate-postgresql-tables)
  * [Populate MongoDB collections](#populate-mongodb-collections)
  * [REST api](#rest-api)
    * [PostGIS route](#postgis-route)
* [Front-end](#front-end)
  * [Vue.js](#vue) - Open-source progressive JavaScript framework for building user interfaces. [link](https://vuejs.org/)
  * [Leaflet.js](#leaflet) - Leading open-source JavaScript library for mobile-friendly interactive maps. [link](http://leafletjs.com/)
  * [Bootstrap](#bootstrap) - Popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web. [link](http://getbootstrap.com/)
* [Utilities](#utilities)
  * [Postman](#postman) - Powerful HTTP client for testing web services. [link](https://www.getpostman.com/)
  * [Oracle VirtualBox](#oracle-virtualbox) - Virtual Machine. [link](https://www.virtualbox.org/)

### Operating System

Ubuntu Linux was chosen primarily because it is free and open source. The target production environment is a DigitalOcean Droplet server. https://www.digitalocean.com/products/compute/


* Ubuntu 17.04 "Zesty Zapus"
* https://help.ubuntu.com/community/Installation/MinimalCD
  * http://archive.ubuntu.com/ubuntu/dists/zesty/main/installer-amd64/current/images/netboot/mini.iso

##### Virtual machine setup (optional)

If you are using VirtualBox virtual machine to build this stack, the following commands are useful in order to communicate to you virtual machine via SSH from your host, and to browse to the final rendered map from your host. https://www.virtualbox.org/wiki/VirtualBox

Allows SSH connections to your virtual machine from your host on port 2222 (22 default SSH port). http://127.0.0.1:18641 (on host) => http://127.0.0.1:8641 (on virtual machine).

~~~~
VBoxManage modifyvm "geodev" --natpf1 "guestssh,tcp,,2222,,22"
~~~~

Allow browsing to map from host at the url: http://127.0.0.1:18641
~~~~
VBoxManage modifyvm "geodev" --natpf1 "guesthttp,tcp,,18641,,8641"
~~~~

#### Sudo user setup (geodevadmin)

This project assumes you have a Sudo user on your system (geodevadmin)

Source:
https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart

~~~~
geodevadmin $ sudo adduser geodevadmin
$ usermod -aG sudo geodevadmin
$ sudo -i -u geodevadmin
~~~~

### Backend

Why GeoJSON vs. PostgreSQL vs. PostGIS vs. MongoDB? Basically this was a good way to get experience with the different query methods and performance differences. The PostGIS query is interesting in that only the data for the current map bounds is sent to the map. Unfortunately, this requires a new query each time the map is zoomed or panned.

Source: https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-postgis-on-ubuntu-14-04

#### Install PostgreSQL

~~~~
$ sudo apt-get update
$ sudo apt-get install postgresql postgresql-contrib
~~~~

#### Install PostGIS extension.

~~~~
$ sudo apt-get install postgis
~~~~

#### PostgreSQL database administration

The following steps are for configuring PostgreSQL. A new database role/user will be created, the geodevdb database will be created, the PostGIS extention will be created and the PostgreSQL server will be configured for PostGIS.

Source:

##### Create geodevdb database and role/user

~~~~
$ sudo -i -u postgres
$ createuser --interactive
Enter name of role to add: geodevdb
Shall the new role be a superuser? (y/n) y
~~~~

##### Create geodevdb database
~~~~
$ createdb geodevdb
~~~~

##### Set geodevdb database password
~~~~
$ psql
psql (9.6.3)
Type "help" for help.
postgres=# ALTER USER geodevdb WITH PASSWORD 'admin123';
~~~~

##### Set geodevdb ownership
~~~~
postgres=# ALTER DATABASE geodevdb OWNER TO geodevdb;
postgres=# \q
$ logout
~~~~
Log back in as geodevadmin
~~~~
$ sudo adduser geodevdb
Adding user `geodevdb' ...
Adding new group `geodevdb' (1001) ...
Adding new user `geodevdb' (1001) with group `geodevdb' ...
Creating home directory `/home/geodevdb' ...
Copying files from `/etc/skel' ...
Enter new UNIX password: admin123
Retype new UNIX password: admin123
passwd: password updated successfully
Changing the user information for geodevdb
Enter the new value, or press ENTER for the default
	Full Name []:##
	Room Number []:
	Work Phone []:
	Home Phone []:
	Other []:
Is the information correct? [Y/n]
~~~~

Make geodevdb a sudo user on the system with full rights.

~~~~
$ sudo usermod -aG sudo geodevdb
~~~~

##### Enable PostGIS spatial Features
~~~~
geodevadmin@geodev:~$ sudo -i -u postgres
postgres@geodev:~$ psql -d geodevdb
psql (9.6.3)
Type "help" for help.

geodevdb=# CREATE EXTENSION postgis;
CREATE EXTENSION
geodevdb=# SELECT PostGIS_version();
            postgis_version            
---------------------------------------
 2.3 USE_GEOS=1 USE_PROJ=1 USE_STATS=1
(1 row)

geodevdb=# \q
$ logout
~~~~

##### Optimize PostgreSQL for GIS Database Objects

~~~~
$ sudo nano /etc/postgresql/9.6/main/postgresql.conf

shared_buffers = 200MB                  # min 128kB
work_mem = 16MB                         # min 64kB
maintenance_work_mem = 128MB            # min 1MB
wal_keep_segments = 6                   # in logfile segments, 16MB each; 0 disables
random_page_cost = 2.0                  # same scale as above
~~~~

##### Allow connections to geodevdb

This will allow geodevdb password protected connections to the PostgreSQL server.

~~~~
$ sudo nano /etc/postgresql/9.6/main/pg_hba.conf

# add at end to allow connections for user geodevb using a password
host     all             geodevdb        0.0.0.0/0               md5

$ sudo service postgresql restart
~~~~

#### MongoDB

Why MongoDB? I was interested in implementing a noSQL document database to see if there was any performance difference. MongoDB was easy to set up, populate and integrate into the project. It seemed to be a natural database for Node.js. It doesn't have the geospatial query capabilities that PostGIS has, but it does have intersection plus others: https://docs.mongodb.com/manual/reference/operator/query-geospatial/

Install Mongodb.

Source: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

~~~~
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
$ echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
~~~~

Create data/db folder for mongodb
~~~~
$ sudo mkdir /data
$ sudo mkdir /data/db
~~~~

Grant ownership for /data/db to geodevadmin
~~~~
$ sudo chown -R 'geodevadmin' /data/db
$ mongod
2017-07-19T12:18:34.084-0600 I NETWORK  [thread1] waiting for connections on port 27017
~~~~

### Web Framework

Node.js and Express.js were an early choice for the project. I wanted to keep the project completely JavaScript if possible. I have been impressed with the easy of deployment and the utility of NPM and Yarn.

#### Install NVM

[NVM](https://github.com/creationix/nvm) is a Node.js version manager. It helps to install and keep track of multiple Node.js versions.

~~~~
$ mkdir download
$ cd download
$ curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh -o install_nvm.sh
$ bash install_nvm.sh

=> Downloading nvm from git to '/home/geodevadmin/.nvm'
=> Cloning into '/home/geodevadmin/.nvm'...
remote: Counting objects: 6492, done.
...
...
Total 6492 (delta 4285), reused 2001 (delta 0)

=> Appending nvm source string to /home/geodevadmin/.bashrc
=> Appending bash_completion source string to /home/geodevadmin/.bashrc
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

$ logout
~~~~

Login as geodevadmin.

This will list you the available node versions.
~~~~
geodevadmin $ nvm ls-remote
~~~~

##### Install Node

~~~~
$ nvm install 7.6.0
Downloading and installing node v7.6.0...
Downloading https://nodejs.org/dist/v7.6.0/node-v7.6.0-linux-x64.tar.xz...
######################################################################## 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v7.6.0 (npm v4.1.2)
Creating default alias: default -> 7.6.0 (-> v7.6.0)
~~~~

We need to install Node.js version 7.6.0 for this project. Why?

In controllers/fedlandP.js, in the getFedlandPForOwnerCode method (below) we return a federal land polygon collection for a passed ownercode. This method is marked async (asyncronous javascript). We need to use Node.js version 7.6.0 in order to use async / await in the project. More details here: http://stackabuse.com/node-js-async-await-in-es7/

![](http://storage9.static.itmages.com/i/17/0725/h_1501007615_7213900_d6700020f9.png)

#### Git

If the version control package, Git, was not installed previously install it now.
~~~~
$ sudo apt-get install git
~~~~

#### Clone geodev-node-rest application

~~~~
$ mkdir app
$ cd app
$ sudo git clone https://github.com/FergusDevelopmentLLC/geodev-node-rest.git
Cloning into 'geodev-node-rest'...
remote: Counting objects: 267, done.
remote: Compressing objects: 100% (73/73), done.
remote: Total 267 (delta 29), reused 73 (delta 16), pack-reused 177
Receiving objects: 100% (267/267), 36.30 MiB | 9.66 MiB/s, done.
Resolving deltas: 100% (114/114), done.
~~~~

#### Application set up

The set up steps below are required for the application to run.

##### Grant geodevadmin ownership of geodev-node-rest
~~~~
$ sudo chown -R geodevadmin /home/geodevadmin/app/geodev-node-rest
~~~~

##### Install packages via NPM

This will install all the packages needed.

~~~~
$ cd geodev-node-rest/
$ npm install
~~~~

##### Download static geojson archive

For the GEOJSON route, the app will use the GeoJSON files in the /home/geodevadmin/app/geodev-node-rest/public/data/ folder. Download an archive of them. They are large files .gitignore(d) from the repository.

~~~~
$ cd public/data
$ wget http://104.236.16.91:8641/data/fedland_geojson.tar.gz
~~~~

##### Untar to get individual GeoJSON files
~~~~
$ tar xvf fedland_geojson.tar.gz
~~~~

##### Add knexfile.js

This is another file .gitignore(d) from the repository. It controls the username and password for connecting to the PostgreSQL geodevdb database. There are development and production sections. The app will default to the development settings unless started with specific production settings. More on this later.

~~~~
$ sudo nano ~/app/geodev-node-rest/knexfile.js

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host : '127.0.0.1',
      port: '5432',
      user : 'geodevdb',
      password : 'admin123',
      database : 'geodevdb'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    connection: {
      host : '127.0.0.1',
      port: '5432',
      user : 'geodevdb',
      password : 'admin123',
      database : 'geodevdb'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
~~~~

#### Key packages

The following list highlights key packages as part of the application and why they were used.

##### Express

https://expressjs.com/

Express.js is a popular web framework for Node.js that is minimal, flexible and feature rich. It allows the app to serve routes for the REST API and ultimately, the map to a client web browser. For example, here are the routes to serve all the fedlands data and fedlands for a specific owner_code. ([/routes/fedlandsP.js](https://github.com/FergusDevelopmentLLC/geodev-node-rest/blob/master/routes/fedlandsP.js))

![](http://storage3.static.itmages.com/i/17/0725/h_1501007924_4975495_35ef084978.png)

##### Knex

Knex.js is a query builder for PostgreSQL/Node.js. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

##### Mongoose

Similarly, Mongoose.js is an object modeler for MongoDB/Node.js At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.

##### Joi

Joi.js is a validator for JavaScript objects. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos.

#### Populate PostgreSQL tables

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos.

##### Download Federal Lands shapefile
~~~~
$ logout
$ sudo -i -u geodevdb
$ cd ~
$ mkdir download
$ cd download
$ wget http://dds.cr.usgs.gov/pub/data/nationalatlas/fedlanp020_nt00012.tar.gz
~~~~

##### Untar shapefile
~~~~
$ tar -xvzf fedlanp020_nt00012.tar.gz
fedlanp020.dbf
fedlanp020.shp
fedlanp020.shx
fedlanp020.txt
~~~~

##### Populate fedland_orig table from shapefile

~~~~
$ shp2pgsql -s 4326 ~/download/fedlanp020.shp public.fedland_orig | psql -d geodevdb -U geodevdb
...
INSERT 0 1
INSERT 0 1
INSERT 0 1
COMMIT
ANALYZE

$ psql
psql (9.6.3)
Type "help" for help.

geodevdb=# \dt
              List of relations
 Schema |      Name       | Type  |  Owner   
--------+-----------------+-------+----------
 public | fedland_orig    | table | geodevdb
 public | spatial_ref_sys | table | postgres
(2 rows)

geodevdb=# \q
$ logout
~~~~
Login in as geodevadmin.

##### Install Knex.js globally
~~~~
geodevadmin $ cd app/geodev-node-rest
$ npm install knex -g
~~~~

##### Run knexjs migrate

This will create the fedland and owner table in geodevdb.
~~~~
$ knex migrate:latest
Using environment: development
Batch 1 run: X migrations
...
~~~~

##### Check to see that fedland table was created by the migration.
~~~~
$ sudo -i -u geodevdb
$ psql

geodevdb=# select * from fedland;
 id | geojson | owner | owner_code | name | state | state_fips
----+---------+-------+------------+------+-------+------------
(0 rows)

geodevdb=# select * from owner;
 id | owner_code | owner | color | orderby
----+------------+-------+-------+---------
(0 rows)
~~~~

#####  Populate fedland table from fedland_orig

~~~~
geodevdb=#
insert into fedland
select gid as id, ST_AsGeoJSON(geom, 3) as geojson, feature1 as owner, agbur as owner_code, name1 as name, state, state_fips
from fedland_orig;
~~~~

#####  Populate fedland_postgis table from fedland_orig

Create fedland_postgis table, this time don't convert the geom to geojson. Why? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos.

~~~~
geodevdb=#
select gid as id, geom, feature1 as owner, agbur as owner_code, name1 as name, state, state_fips
into fedland_postgis
from fedland_orig;
~~~~

Final set of tables
~~~~
geodevdb=# \dt
                List of relations
 Schema |         Name         | Type  |  Owner   
--------+----------------------+-------+----------
 public | fedland              | table | geodevdb
 public | fedland_orig         | table | geodevdb
 public | fedland_postgis      | table | geodevdb
 public | knex_migrations      | table | geodevdb
 public | knex_migrations_lock | table | geodevdb
 public | owner                | table | geodevdb
 public | spatial_ref_sys      | table | postgres
(7 rows)
~~~~

##### Populate owner table
~~~~
INSERT INTO owner (owner_code, owner, color, orderby) VALUES ('BOR', 'Bureau of Reclamation', '#9f4fdb', 1);
INSERT INTO owner (owner_code, owner, color, orderby) VALUES ('BLM', 'Bureau of Land Management', '#c23d99', 2);
INSERT INTO owner (owner_code, owner, color, orderby) VALUES ('DOD', 'Department of Defense', '#003049', 3);
INSERT INTO owner (owner_code, owner, color, orderby) VALUES ('FWS', 'Fish and Wildlife Service', '#0b6f94', 4);
INSERT INTO owner (owner_code, owner, color, orderby) VALUES ('FS', 'Forest Service', '#CE6A46', 5);
INSERT INTO owner (owner_code, owner, color, orderby) VALUES ('NPS', 'National Park Service', '#3f9233', 6);
INSERT INTO owner (owner_code, owner, color, orderby) VALUES ('TVA', 'Tennessee Valley Authority', '#773344', 7);
INSERT INTO owner (owner_code, owner, color, orderby) VALUES ('PRI', 'State/Private', '#6B6558', 8);
~~~~

##### Update where owner_code is null to 'PRI'
Why? Accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
~~~~
geodevdb=# update fedland set owner_code = 'PRI' where owner_code is null;
UPDATE 22045
geodevdb=# update fedland_postgis set owner_code = 'PRI' where owner_code is null;
UPDATE 22045
~~~~

#### Populate MongoDB collections

Basically we are going to export the PostgreSQL tables to csv and then import those csv files into MongoDB collections.

##### Export fedland table to csv
~~~~
geodevdb=# COPY fedland TO '/tmp/fedland.csv' DELIMITER ',' CSV HEADER;
COPY 49778
~~~~

##### Export owner table to csv
~~~~
geodevdb=# COPY owner TO '/tmp/owner.csv' DELIMITER ',' CSV HEADER;
COPY 8
geodevdb=# \q
$ logout
~~~~

##### Import owner.csv to owners MongoDB collection
~~~~
$ mongoimport -d geodevdb -c owners --type csv --file /tmp/owner.csv --headerline
2017-07-19T15:42:59.346-0600	connected to: localhost
2017-07-20T12:51:43.111-0600	imported 8 documents
~~~~

##### Import fedland.csv to fedlands MongoDB collection
~~~~
$ mongoimport -d geodevdb -c fedlands --type csv --file /tmp/fedland.csv --headerline
2017-07-19T15:42:59.346-0600	connected to: localhost
2017-07-19T15:43:02.332-0600	imported 49778 documents
~~~~

##### Parse the geojson column in mongodb
Why? Accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt.
~~~~
$ mongo
> use geodevdb
> db.fedlands.find().forEach( function(obj) {
    obj.geojson = new Object(JSON.parse(obj.geojson));
    db.fedlands.save(obj);
});
> exit
~~~~

#### REST API

Start server
~~~~
$ cd ~/app/geodev-node-rest
$ node server.js
or
NODE_ENV=production node server.js
~~~~

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

API routes:
~~~~
/ownerP
/ownerM
/asdfsad/
~~~~

##### PostGIS tricks

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
~~~~
select id, ST_AsGeoJSON(ST_SimplifyPreserveTopology(geom,simplification),geojson_digits) as geojson, owner, owner_code, name, state, state_fips
from fedland_postgis
where owner_code = owner_code
AND ST_SimplifyPreserveTopology(geom, simplification) && ST_MakeEnvelope(left_lng, bottom_lat, right_lng, top_lat, srid);
~~~~

### Front end
At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

#### Vue
https://vuejs.org/

Vue.js is open-source progressive JavaScript framework for building user interfaces.

#### Leaflet
http://leafletjs.com/

Leaflet.js is a leading open-source JavaScript library for mobile-friendly interactive maps.

#### Bootstrap
Bootstrap is a popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web](http://getbootstrap.com/)

### Utilities

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

#### Postman
https://www.getpostman.com/

Powerful HTTP client for testing web services. eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

#### Oracle Virtualbox
https://www.virtualbox.org/

Oracle Virtual box is Virtual Machine software that can be used to install this stack.
