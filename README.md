# GeoWebStack

## Project Background
Building a geospatial web development stack. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.

Demo [map](http://104.236.16.91:8641/):

![http://104.236.16.91:8641/](http://storage6.static.itmages.com/i/17/0724/h_1500923403_9513361_eba9dd45f7.png)

## Web Stack
* [Operating System](#operating-system)
  * Linux 17.04 minimal install
    * [Virtual machine setup (optional)](#virtual-machine-setup)
    * [Sudo user setup (geodevadmin)](#sudo-user-setup-geodevadmin)
* [Backend](#backend)
  * [PostgreSQL](#postgresql) - [Powerful, open source object-relational database system](https://www.postgresql.org/)
    * [PostGIS](#postgis) - [Geospatial database extender for PostgreSQL](http://postgis.net/)
    * [PostgreSQL database administration](#postgresql-database-administration)
  * [MongoDB](#mongodb) - [Document database (noSQL) based on scalability and flexibility](https://www.mongodb.com/)
* geodev-node-rest application
  * Web server
    * [Node.js](https://nodejs.org/) - Runtime built on Chrome's V8 JavaScript engine
      * [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
      * [Knex.js](http://knexjs.org/) - Query builder for PostgreSQL
      * [Mongoose.js](http://mongoosejs.com/) - Elegant mongodb object modeling for node.js
      * [Joi.js](https://github.com/hapijs/joi) - Validator for JavaScript objects
    * [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer) - way of providing interoperability between computer systems on the Internet
      * [GeoJSON](http://geojson.org/) - Javascript format for encoding a variety of geographic data structures
  * Front-end
    * [Vue.js](https://vuejs.org/) - Open-source progressive JavaScript framework for building user interfaces
    * [Leaflet.js](http://leafletjs.com/) - Leading open-source JavaScript library for mobile-friendly interactive maps
    * [Bootstrap](http://getbootstrap.com/) - Popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web
* Utilities
  * [Postman](https://www.getpostman.com/) - Powerful HTTP client for testing web services
  * [Oracle VirtualBox](https://www.virtualbox.org/) - Virtual Machine

### Operating System

Why Linux? Digital Ocean? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

* Ubuntu 17.04 "Zesty Zapus"
* https://help.ubuntu.com/community/Installation/MinimalCD
  * http://archive.ubuntu.com/ubuntu/dists/zesty/main/installer-amd64/current/images/netboot/mini.iso

#### Virtual machine setup

If you are using a virtual machine to build this stack...At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores. Port forwarding information if server is on a VirtualBox virtual machine.
https://www.virtualbox.org/wiki/VirtualBox

This will allow you to make SSH connections to your vm on port 2222 (22 is standard)
~~~~
VBoxManage modifyvm "geodev" --natpf1 "guestssh,tcp,,2222,,22"
~~~~

This will allow you to hit the web server at a localhost url:

http://127.0.0.1:18641 (on host) = http://127.0.0.1:8641 (on vm)
~~~~
VBoxManage modifyvm "geodev" --natpf1 "guesthttp,tcp,,18641,,8641"
~~~~

#### Sudo user setup (geodevadmin)

This project assumes you have a Sudo user on your system named:
geodevadmin

Source:
https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart

~~~~
$ sudo adduser geodevadmin
$ usermod -aG sudo geodevadmin
$ sudo -i -u geodevadmin
~~~~

### Backend

Why GeoJSON vs. PostgreSQL vs. PostGIS vs. MongoDB? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

#### PostgreSQL

Install PostgreSQL.

~~~~
$ sudo apt-get update
$ sudo apt-get install postgresql postgresql-contrib
~~~~

#### PostGIS

Install PostGIS extension.

~~~~
$ sudo apt-get install postgis
~~~~

#### PostgreSQL database administration

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

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
Make geodevdb a sudoer
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

~~~~
$ sudo nano /etc/postgresql/9.6/main/pg_hba.conf

# add at end to allow connections for user geodevb using a password
host     all             geodevdb        0.0.0.0/0               md5

$ sudo service postgresql restart
~~~~

#### MongoDB

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

#### REST API

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

API routes:
~~~~
/ownerP
/ownerM
/asdfsad/
~~~~


### Node.js

Install Nodejs with nvm

~~~~
$ mkdir download
$ cd download
$ curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh -o install_nvm.sh
$ bash install_nvm.sh

=> Downloading nvm from git to '/home/geodevadmin/.nvm'
=> Cloning into '/home/geodevadmin/.nvm'...
remote: Counting objects: 6492, done.
remote: Compressing objects: 100% (14/14), done.
remote: Total 6492 (delta 7), reused 10 (delta 3), pack-reused 6475
Receiving objects: 100% (6492/6492), 1.95 MiB | 0 bytes/s, done.
Resolving deltas: 100% (4023/4023), done.
* (HEAD detached at v0.33.2)
  master
=> Compressing and cleaning up git repository
Counting objects: 6492, done.
Compressing objects: 100% (6448/6448), done.
Writing objects: 100% (6492/6492), done.
Total 6492 (delta 4285), reused 2001 (delta 0)

=> Appending nvm source string to /home/geodevadmin/.bashrc
=> Appending bash_completion source string to /home/geodevadmin/.bashrc
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

$ logout
~~~~

log in as geodevadmin

~~~~
$ nvm ls-remote
$ nvm install 7.6.0
Downloading and installing node v7.6.0...
Downloading https://nodejs.org/dist/v7.6.0/node-v7.6.0-linux-x64.tar.xz...
######################################################################## 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v7.6.0 (npm v4.1.2)
Creating default alias: default -> 7.6.0 (-> v7.6.0)
~~~~

## Install Git

~~~~
sudo apt-get install git
~~~~

## Install geodev-node-rest

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

## Take ownership of geodev-node-rest, npm install packages
~~~~
$ sudo chown -R geodevadmin /home/geodevadmin/app/geodev-node-rest
$ cd geodev-node-rest/
$ npm install
~~~~

## Download and unarchive static geojson files:
~~~~
$ cd public/data
$ wget http://104.236.16.91:8641/data/fedland_geojson.tar.gz
$ tar xvf fedland_geojson.tar.gz
~~~~

## add ./knexfile for connections to PostgreSql
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

## App will run from static files
~~~~
$ cd ..
$ cd ..
$ node server
App listening at port 8641
~~~~

![](http://storage6.static.itmages.com/i/17/0719/h_1500498051_9389335_648afe145b.png)

We need some data. Use ctrl-c to stop the server

## Download Federal Lands shapefile

~~~~
$ logout
$ sudo -i -u geodevdb
$ cd ~
$ mkdir download
$ cd download
$ wget http://dds.cr.usgs.gov/pub/data/nationalatlas/fedlanp020_nt00012.tar.gz
$ tar -xvzf fedlanp020_nt00012.tar.gz
fedlanp020.dbf
fedlanp020.shp
fedlanp020.shx
fedlanp020.txt
~~~~

## Populate fedland_orig table from shapefile

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

#VM 2 created

## Run knexjs migrate
~~~~
$ cd app/geodev-node-rest
$ npm install knex -g
~~~~

This will create the fedland table in geodevdb
~~~~
$ knex migrate:latest
Using environment: development
Batch 1 run: X migrations
...
~~~~

Check to see that fedland table was created by the migration.
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

## Populate fedland table

~~~~
geodevdb=#
insert into fedland
select gid as id, ST_AsGeoJSON(geom, 3) as geojson, feature1 as owner, agbur as owner_code, name1 as name, state, state_fips
from fedland_orig;
~~~~

Create fedland_postgis, this time don't convert the geom to geojson.

~~~~
geodevdb=#
select gid as id, geom, feature1 as owner, agbur as owner_code, name1 as name, state, state_fips
into fedland_postgis
from fedland_orig;
~~~~

This is the tables you should have...

~~~~
geodevdb=# \dt
                List of relations
 Schema |         Name         | Type  |  Owner   
--------+----------------------+-------+----------
 public | fedland              | table | geodevdb
 public | fedland_orig         | table | geodevdb
 public | fedland_v2           | table | geodevdb
 public | knex_migrations      | table | geodevdb
 public | knex_migrations_lock | table | geodevdb
 public | owner                | table | geodevdb
 public | spatial_ref_sys      | table | postgres
(7 rows)
~~~~

Populate owner table
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

Update where owner_code is null to 'PRI'
~~~~
geodevdb=# update fedland set owner_code = 'PRI' where owner_code is null;
UPDATE 22045
geodevdb=# update fedland_postgis set owner_code = 'PRI' where owner_code is null;
UPDATE 22045
~~~~

## Export fedland table to csv
~~~~
geodevdb=# COPY fedland TO '/tmp/fedland.csv' DELIMITER ',' CSV HEADER;
COPY 49778
~~~~

## Export owner table to csv
~~~~
geodevdb=# COPY owner TO '/tmp/owner.csv' DELIMITER ',' CSV HEADER;
COPY 8
geodevdb=# \q
$ logout
~~~~

## Import owner.csv into MongoDB

~~~~
$ mongoimport -d geodevdb -c owners --type csv --file /tmp/owner.csv --headerline
2017-07-19T15:42:59.346-0600	connected to: localhost
2017-07-20T12:51:43.111-0600	imported 8 documents
~~~~

## Import fedland.csv into MongoDB

~~~~
$ mongoimport -d geodevdb -c fedlands --type csv --file /tmp/fedland.csv --headerline
2017-07-19T15:42:59.346-0600	connected to: localhost
2017-07-19T15:43:02.332-0600	imported 49778 documents
~~~~

## Parse the geojson column in mongodb
~~~~
$ mongo
> use geodevdb
> db.fedlands.find().forEach( function(obj) {
    obj.geojson = new Object(JSON.parse(obj.geojson));
    db.fedlands.save(obj);
});
> exit
~~~~

Restart app

~~~~
geodevdb=#
$ cd ~/app/geodev-node-rest
$ node server
~~~~
