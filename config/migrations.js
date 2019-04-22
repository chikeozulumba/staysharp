import db from './db';
import Seeders from './seeders';

const Drop = async () => {
	const client = await db.connect();
	try {
		const dropTables = 'DROP TABLE IF EXISTS questions';
		await client.query(dropTables);
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
};

const User = async () => {
	const client = await db.connect();
	try {
		const query = `CREATE TABLE IF NOT EXISTS users (
          id SERIAL UNIQUE, 
          name VARCHAR(255), 
          email VARCHAR(255), 
          phone VARCHAR(255), 
          city VARCHAR(255), 
          country VARCHAR(255), 
					ipaddress INET , 
					facebookid VARCHAR(255),
          confirmed BOOLEAN DEFAULT false, 
          score INTEGER DEFAULT 0, 
          currenttime INTEGER DEFAULT 6000, 
          total INTEGER DEFAULT 0, 
          finished INTEGER DEFAULT 0, 
          timestamp TIMESTAMPTZ DEFAULT NOW(), 
          PRIMARY KEY(id, email)
      );`;
		await client.query(query);
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
};

const Question = async () => {
	const client = await db.connect();
	try {
		const query = `CREATE TABLE IF NOT EXISTS questions (
          id SERIAL UNIQUE, 
          question INTEGER NOT NULL, 
          images TEXT [] NOT NULL,
          answer VARCHAR(255) NOT NULL,
          timestamp TIMESTAMPTZ DEFAULT NOW(), 
          PRIMARY KEY(id, question)
      );`;
		await client.query(query);
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
};

const Token = async () => {
	const client = await db.connect();
	try {
		const query = `CREATE TABLE IF NOT EXISTS tokens (
          id SERIAL UNIQUE, 
          token VARCHAR(255),
          PRIMARY KEY(id)
      );`;
		await client.query(query);
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
};


const Topmint = async () => {
	const client = await db.connect();
	try {
		const query = `CREATE TABLE IF NOT EXISTS topmint (
          id SERIAL UNIQUE, 
          phonenumber VARCHAR(255),
          timespent VARCHAR(255),
          PRIMARY KEY(id)
      );`;
		await client.query(query);
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
};

(async () => {
	await Drop();
	await Question();
	await User();
	await Token();
	await Topmint();
	await Seeders();
	console.log('###############################################################');
	console.log('                   DONE, MIGRATION COMPLETE!                   ');
	console.log('###############################################################');
})().catch((err) => {
	console.log(err);
});
