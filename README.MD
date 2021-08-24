# Requirements 
```
- php ^7.4
- NodeJs
- yarn or npm
- symfony cli
```

## Clone this repository

`git clone https://github.com/mickaelnambs/test-fullstack.git`

Go inside 

`cd test-fullstack`

Update composer and node package

`composer install && npm install`

Create jwt dictectory inside config:

`mkdir -p config/jwt`

Generate two keypairs:

`php bin/console lexik:jwt:generate-keypair`

Update database configuration, edit this line in `.env` file with your own configuration:

`DATABASE_URL=mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=5.7`

Create database:

`php bin/console doctrine:database:create`

Then update schema by running:

`php bin/console d:s:u -f`

Run symfony server

`symfony serve`

Run npm to run ReactJS , open localhost:8000

`npm run dev-server`

